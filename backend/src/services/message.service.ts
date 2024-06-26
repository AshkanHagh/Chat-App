import type { TInferSelectMessage, TInferSelectParticipant } from '../@types';
import { insertIntoCache } from '../db/cache';
import { findParticipantsInCache } from '../db/cache/message.cache';
import { insertInToCacheSetList, insertInToCacheList } from '../db/cache'
import { findFirstParticipantByConversationId, findManyMessageByConversationId, findManyParticipantByUsersId, insertNewConversation, insertNewMessage } 
from '../db/query/message.query';
import { BadRequestError } from '../utils/customErrors';
import ErrorHandler from '../utils/errorHandler';
import { getReceiverSocketId, io } from '../webSocket/socket.io';

const findCommonConversation = (firstPerson : TInferSelectParticipant[], secondPerson : TInferSelectParticipant[]) => {
    const firstPersonConversations : Set<string | null> = new Set(firstPerson.map(person => person.conversationId));
    for (const person of secondPerson) {
        if (firstPersonConversations.has(person.conversationId)) {
            return person.conversationId
        }
    }
    return null;
}

const insertParticipantsArrayInCache = async (firstPerson : TInferSelectParticipant[], secondPerson : TInferSelectParticipant[], 
    senderId : string, receiverId : string
) : Promise<void> => {
    await Promise.all([firstPerson.map(async user => {await insertInToCacheSetList(`participants:user:${senderId}`, user)}),
        secondPerson.map(async user => {await insertInToCacheSetList(`participants:user:${receiverId}`, user)})
    ])
}

const insertNewParticipantsInCache = async <T extends unknown, B extends unknown>(firstPerson : T, secondPerson : B, 
    senderId : string, receiverId : string
) : Promise<void> => {
    await Promise.all([insertInToCacheSetList(`participants:user:${senderId}`, firstPerson), 
        insertInToCacheSetList(`participants:user:${receiverId}`, secondPerson)
    ]);
}

export const sendMessageService = async (message : string, senderId : string, receiverId : string) : Promise<TInferSelectMessage> => {
    try {
        let conversationId;
        const receiverSocketId : string | undefined = getReceiverSocketId(receiverId);
        const {firstPersonCache, secondPersonCache} = await findParticipantsInCache(`participants:user:${senderId}`,
        `participants:user:${receiverId}`);

        if(firstPersonCache.length <= 0 || secondPersonCache.length <= 0) {
            const {firstPerson, secondPerson} = await findManyParticipantByUsersId(senderId, receiverId);
            insertParticipantsArrayInCache(firstPerson, secondPerson, senderId, receiverId);
            conversationId = findCommonConversation(firstPerson, secondPerson);
        }

        conversationId = findCommonConversation(firstPersonCache, secondPersonCache);

        if(!conversationId) {
            const {firstPersonParticipant, secondPersonParticipant, conversation} = await insertNewConversation(senderId, receiverId);
            conversationId = conversation.id;

            insertIntoCache(`conversation:${conversationId}`, conversation, 1209600);
            insertNewParticipantsInCache(firstPersonParticipant, secondPersonParticipant, senderId, receiverId);

            const {firstPersonInfo, secondPersonInfo} = await findFirstParticipantByConversationId(conversationId);
            // insertNewParticipantsInCache(firstPersonInfo, secondPersonInfo, senderId, receiverId);
            if(receiverSocketId) {
                io.to(receiverSocketId).emit('newConversation', secondPersonInfo);
            }
        }
        const newMessage : TInferSelectMessage = await insertNewMessage(senderId, receiverId, conversationId!, message);
        if(!newMessage) throw new BadRequestError();
        await insertInToCacheList(`message:${conversationId}`, newMessage);

        if(receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }
        return newMessage;
        
    } catch (error : any) {
        throw new ErrorHandler(`An error occurred : ${error.message}`, 400);
    }
}

export const getMessagesService = async (currentUserId : string, receiverId : string) => {
    try {
        const {firstPerson, secondPerson} = await findManyParticipantByUsersId(currentUserId, receiverId);
        const conversationId : string | null = findCommonConversation(firstPerson, secondPerson);

        const messages = await findManyMessageByConversationId(conversationId!);
        return messages;
        
    } catch (error : any) {
        throw new ErrorHandler(`An error occurred : ${error.message}`, error.statusCode);
    }
}