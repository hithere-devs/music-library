import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { BadRequestError } from '../utils/errors';
import { errorResponse } from '../utils/responseHandler';

export const validateRequest = (schema: AnyZodObject) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params,
				headers: req.headers,
			});
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				errorResponse(
					res,
					`Bad Request, Reason: ${error.errors
						.map((e) => e.path[1])
						.join(', ')}`,
					400
					// error.errors
				);
				return;
			}
			next(error);
		}
	};
};
