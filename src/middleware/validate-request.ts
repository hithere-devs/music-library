import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

// utils
import { errorResponse } from '../utils/responseHandler';

/**
 * Middleware to validate the request using a Zod schema.
 *
 * @param schema - The Zod schema to validate the request against.
 * @returns An asynchronous function that validates the request and calls the next middleware.
 *
 * @throws If the request validation fails, responds with a 400 status code and an error message.
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import { validateRequest } from './middleware/validate-request';
 *
 * const schema = z.object({
 *   body: z.object({
 *     name: z.string(),
 *   }),
 * });
 *
 * app.post('/endpoint', validateRequest(schema), (req, res) => {
 *   res.send('Request is valid');
 * });
 * ```
 */
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
						.join(', ')}.`,
					400
					// error.errors
				);
				return;
			}
			next(error);
		}
	};
};
