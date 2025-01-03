import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// routes
import routes from './routes';

// middleware
import { errorHandler } from './middleware/error-handler';

export function createServer() {
	const app = express();

	app.use(helmet());

	// CORS config
	app.use(
		cors({
			origin: '*',
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization'],
		})
	);

	// main route commenting
	app.get('/', (req: Request, res: Response, next: NextFunction) => {
		res.send(
			'Welcome to the music library API \n Please use https://music-api.hitheredevs.com/api/v1/{your-desired-route} to access the API.'
		);
	});

	app.use(express.json());

	// Request logging
	app.use(morgan('dev'));

	// API routes
	app.use('/api', routes);

	// Error handling
	app.use(errorHandler);

	return app;
}
