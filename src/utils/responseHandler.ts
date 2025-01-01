import { Response } from 'express';

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
