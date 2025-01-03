import { Response } from 'express';

/**
 * Sends a success response with the given data, message, and status code.
 *
 * @param res - The response object to send the response.
 * @param data - The data to include in the response. Defaults to null.
 * @param message - The message to include in the response. Defaults to 'Success'.
 * @param statusCode - The HTTP status code to use for the response. Defaults to 200.
 */
export const successResponse = (
	res: Response,
	data: any = null,
	message: string = 'Success',
	statusCode: number = 200
) => {
	res.status(statusCode).json({
		status: statusCode,
		data,
		message,
		error: null,
	});
	return;
};

/**
 * Sends an error response with the specified status code, message, and error details.
 *
 * @param res - The response object to send the error response.
 * @param message - The error message to send. Defaults to 'Error occurred'.
 * @param statusCode - The HTTP status code to send. Defaults to 500.
 * @param error - Additional error details to include in the response. Defaults to null.
 */
export const errorResponse = (
	res: Response,
	message: string = 'Error occurred',
	statusCode: number = 500,
	error: any = null
) => {
	res.status(statusCode).json({
		status: statusCode,
		data: null,
		message,
		error,
	});
	return;
};
