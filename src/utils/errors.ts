/**
 * Base class for application-specific errors.
 *
 * @class AppError
 * @extends {Error}
 */
export class AppError extends Error {
	/**
	 * Creates an instance of AppError.
	 *
	 * @param statusCode - The HTTP status code associated with the error.
	 * @param message - The error message.
	 * @param error - Additional error details (optional).
	 */
	constructor(
		public statusCode: number,
		public message: string,
		public error: any = null
	) {
		super(message);
		Object.setPrototypeOf(this, AppError.prototype);
	}
}

/**
 * Error class for unauthorized access errors.
 *
 * @class UnauthorizedError
 * @extends {AppError}
 */
export class UnauthorizedError extends AppError {
	/**
	 * Creates an instance of UnauthorizedError.
	 *
	 * @param message - The error message (default is 'Unauthorized Access').
	 */
	constructor(message: string = 'Unauthorized Access.') {
		super(401, message);
	}
}

/**
 * Error class for forbidden access errors.
 *
 * @class ForbiddenError
 * @extends {AppError}
 */
export class ForbiddenError extends AppError {
	/**
	 * Creates an instance of ForbiddenError.
	 *
	 * @param message - The error message (default is 'Forbidden Access').
	 */
	constructor(message: string = 'Forbidden Access.') {
		super(403, message);
	}
}

/**
 * Error class for not found errors.
 *
 * @class NotFoundError
 * @extends {AppError}
 */
export class NotFoundError extends AppError {
	/**
	 * Creates an instance of NotFoundError.
	 *
	 * @param message - The error message (default is 'Resource not found').
	 */
	constructor(message: string = 'Resource not found.') {
		super(404, message);
	}
}

/**
 * Error class for bad request errors.
 *
 * @class BadRequestError
 * @extends {AppError}
 */
export class BadRequestError extends AppError {
	/**
	 * Creates an instance of BadRequestError.
	 *
	 * @param message - The error message (default is 'Bad Request').
	 */
	constructor(message: string = 'Bad Request.') {
		super(400, message);
	}
}

/**
 * Error class for already exists errors.
 *
 * @class AlreadyExists
 * @extends {AppError}
 */
export class AlreadyExists extends AppError {
	/**
	 * Creates an instance of AlreadyExists.
	 *
	 * @param message - The error message (default is 'Resource already exists').
	 */
	constructor(resource: string = 'Resource') {
		super(409, `${resource} already exists.`);
	}
}
