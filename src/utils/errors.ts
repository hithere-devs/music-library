export class AppError extends Error {
	constructor(
		public statusCode: number,
		public message: string,
		public error: any = null
	) {
		super(message);
		Object.setPrototypeOf(this, AppError.prototype);
	}
}

export class UnauthorizedError extends AppError {
	constructor(message: string = 'Unauthorized Access') {
		super(401, message);
	}
}

export class ForbiddenError extends AppError {
	constructor(message: string = 'Forbidden Access') {
		super(403, message);
	}
}

export class NotFoundError extends AppError {
	constructor(message: string = 'Resource not found') {
		super(404, message);
	}
}

export class BadRequestError extends AppError {
	constructor(message: string = 'Bad Request') {
		super(400, message);
	}
}

export class AlreadyExists extends AppError {
	constructor(resource: string = 'Resource') {
		super(409, `${resource} already exists.`);
	}
}
