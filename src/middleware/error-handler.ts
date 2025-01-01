import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export const errorHandler = (
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	if (err instanceof AppError) {
		res.status(err.statusCode).json({
			status: err.statusCode,
			message: err.message,
			error: err.error,
			data: null,
		});
		return;
	}

	// Unhandled errors
	console.error('Unhandled error:', err);
	res.status(500).json({
		status: 500,
		message: 'Internal Server Error',
		error: process.env.NODE_ENV === 'development' ? err : null,
		data: null,
	});
	return;
};
