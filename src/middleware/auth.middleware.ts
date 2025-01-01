import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { verifyToken } from '../utils/jwt';
import { UserRole } from '../types/enums';

export interface AuthRequest extends Request {
	user?: {
		id: string;
		email: string;
		role: UserRole;
	};
}

export const authenticate = async (
	req: AuthRequest,
	_res: Response,
	next: NextFunction
) => {
	try {
		const token = req.headers.authorization?.split(' ')[1];

		if (!token) {
			throw new UnauthorizedError('No token provided');
		}

		const decoded = verifyToken(token);
		req.user = decoded;

		next();
	} catch (error) {
		next(error);
	}
};

export const authorize = (...roles: UserRole[]) => {
	return (req: AuthRequest, _res: Response, next: NextFunction) => {
		if (!req.user) {
			throw new UnauthorizedError('User not authenticated');
		}

		if (!roles.includes(req.user.role)) {
			throw new ForbiddenError('User not authorized');
		}

		next();
	};
};
