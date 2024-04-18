import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors : {
        origin : ['http://localhost:3000'],
        methods : ['GET', 'POST']
    }
});

export const getReceiverSocketId = (receiverId : any) => {
    return userSocketMap[receiverId];
};

const userSocketMap = <any>{};

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    'localhost:500, hello'
    const userId : any = socket.handshake.query.userId;
    if(userId != 'undefined') userSocketMap[userId] = socket.id;

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log('a user disconnected', socket.id);
        delete userSocketMap[userId];
    })

});


export { app, io, server };