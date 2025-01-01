import { Router } from 'express';

import authRoutes from './auth.routes';
import userRoutes from './user.routes';

const v1Router = Router();

v1Router.use(authRoutes);
v1Router.use('/users', userRoutes);

export default v1Router;
