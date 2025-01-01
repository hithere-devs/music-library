import { Router } from 'express';

import authRoutes from './auth.routes';

const v1Router = Router();

v1Router.use(authRoutes);

export default v1Router;
