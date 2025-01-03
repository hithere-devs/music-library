import { Router } from 'express';

import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import artistRoutes from './artist.routes';
import albumRoutes from './album.routes';
import trackRoutes from './track.routes';
import favoriteRoutes from './favorite.routes';

const v1Router = Router();

v1Router.use(authRoutes);
v1Router.use('/users', userRoutes);
v1Router.use('/artists', artistRoutes);
v1Router.use('/albums', albumRoutes);
v1Router.use('/tracks', trackRoutes);
v1Router.use('/favorites', favoriteRoutes);

export default v1Router;
