import { Router, type NextFunction, type Request, type Response } from 'express';
import { isAuthenticated } from '../middlewares/auth';
import { deleteConversation, getConversations, newConversation, searchUser } from '../controllers/conversation.controller';
import { RouteNowFoundError } from '../utils/customErrors';

const router = Router();

router.get('/search/:query', isAuthenticated, searchUser);

router.get('/new/:id', isAuthenticated, newConversation);

router.get('/', isAuthenticated, getConversations);

router.delete('/:conversationId/:userToModify', isAuthenticated, deleteConversation);

router.all('*', (req : Request, res : Response, next : NextFunction) => {
    const error = new RouteNowFoundError(`Route : ${req.originalUrl} not found`);
    next(error);
});

export default router;