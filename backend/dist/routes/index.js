import { Router } from 'express';
import userRoutes from './user-routes.js';
import chatRoutes from './chat-routes.js';
const appRouter = Router();
//  /api/v1/user
appRouter.use('/user', userRoutes);
//  /api/v1/chat
appRouter.use('/chat', chatRoutes);
export default appRouter;
//# sourceMappingURL=index.js.map