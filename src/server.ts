import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './middleware/error-handler';

export async function createServer() {
	const app = express();

	// Security middleware
	app.use(helmet());

	// CORS configuration
	app.use(
		cors({
			origin: '*',
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization'],
		})
	);

	// Body parser
	app.use(express.json());

	// Request logging
	app.use(morgan('dev'));

	// API routes
	app.use('/api', routes);

	// Error handling
	app.use(errorHandler);

	return app;
}
