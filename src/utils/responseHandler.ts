import { Response } from 'express';

export const successResponse = (
	res: Response,
	data: any = null,
	message: string = 'Success',
	statusCode: number = 200
) => {
	return res.status(statusCode).json({
		status: statusCode,
		data,
		message,
		error: null,
	});
};

export const errorResponse = (
	res: Response,
	message: string = 'Error occurred',
	statusCode: number = 500,
	error: any = null
) => {
	return res.status(statusCode).json({
		status: statusCode,
		data: null,
		message,
		error,
	});
};
