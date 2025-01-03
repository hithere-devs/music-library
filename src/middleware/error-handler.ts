import { Request, Response, NextFunction } from 'express';

// utils
import { AppError } from '../utils/errors';

/**
 * Middleware function to handle errors in the application.
 *
 * @param err - The error object that was thrown.
 * @param _req - The request object (not used in this middleware).
 * @param res - The response object used to send the error response.
 * @param _next - The next middleware function in the stack (not used in this middleware).
 *
 * If the error is an instance of `AppError`, it sends a JSON response with the error's status code, message, and additional error details.
 * For unhandled errors, it logs the error to the console and sends a generic 500 Internal Server Error response.
 */
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
		message: 'Internal Server Error.',
		error: process.env.NODE_ENV === 'development' ? err : null,
		data: null,
	});
	return;
};
