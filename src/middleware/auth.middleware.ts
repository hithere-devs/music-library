import { Request, Response, NextFunction } from 'express';

// utils
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { verifyToken } from '../utils/jwt';

// types
import { UserRole } from '../types/enums';

export interface AuthRequest extends Request {
	user?: {
		id: string;
		email: string;
		role: UserRole;
	};
}

/**
 * Middleware to authenticate a user based on the provided authorization token.
 *
 * @param req - The request object, which should include the authorization header.
 * @param _res - The response object (not used in this middleware).
 * @param next - The next middleware function to be called.
 *
 * @throws {UnauthorizedError} If the authorization token is missing or invalid.
 *
 * @example
 * // Example usage in an Express route
 * app.get('/protected-route', authenticate, (req, res) => {
 *   res.send('This is a protected route');
 * });
 */
export const authenticate = async (
	req: AuthRequest,
	_res: Response,
	next: NextFunction
) => {
	try {
		const token = req.headers.authorization?.split(' ')[1];

		if (!token) {
			throw new UnauthorizedError();
		}

		const decoded = verifyToken(token);
		req.user = decoded;

		next();
	} catch (error) {
		next(error);
	}
};

/**
 * Middleware to authorize users based on their roles.
 *
 * @param {...UserRole[]} roles - The roles that are allowed to access the route.
 * @returns {Function} Middleware function that checks if the user is authenticated and has the required role.
 *
 * @throws {UnauthorizedError} If the user is not authenticated.
 * @throws {ForbiddenError} If the user does not have the required role.
 */
export const authorize = (...roles: UserRole[]) => {
	return (req: AuthRequest, _res: Response, next: NextFunction) => {
		if (!req.user) {
			throw new UnauthorizedError('User not authenticated.');
		}

		if (!roles.includes(req.user.role)) {
			throw new ForbiddenError('Forbidden Access/Operation not allowed.');
		}

		next();
	};
};
