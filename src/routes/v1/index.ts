import { Router } from 'express';
// import authRoutes from './auth.routes';
// import userRoutes from './user.routes';
// import artistRoutes from './artist.routes';
// import albumRoutes from './album.routes';
// import trackRoutes from './track.routes';
// import favoriteRoutes from './favorite.routes';
import authRoutes from './auth.routes';

const v1Router = Router();

// Mount routes
v1Router.use('/', authRoutes); // /api/v1/logout, /api/v1/login, /api/v1/signup
// v1Router.use('/users', userRoutes); // /api/v1/users/*
// v1Router.use('/artists', artistRoutes); // /api/v1/artists/*
// v1Router.use('/albums', albumRoutes); // /api/v1/albums/*
// v1Router.use('/tracks', trackRoutes); // /api/v1/tracks/*
// v1Router.use('/favorites', favoriteRoutes); // /api/v1/favorites/*

export default v1Router;
