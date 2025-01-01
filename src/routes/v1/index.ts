import { Router } from 'express';

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import artistRoutes from './artist.routes';

const swaggerDocument = YAML.load(
	path.resolve(__dirname, './docs/openapi.yaml')
);

const v1Router = Router();

v1Router.use('/docs', swaggerUi.serve);
v1Router.get('/docs', swaggerUi.setup(swaggerDocument));

v1Router.use(authRoutes);
v1Router.use('/users', userRoutes);
v1Router.use('/artists', artistRoutes);

export default v1Router;
