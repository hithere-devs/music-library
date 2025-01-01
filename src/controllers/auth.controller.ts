import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../utils/errors';

export interface IAuthController {
	signup(req: Request, res: Response, next: NextFunction): Promise<void>;
	login(req: Request, res: Response, next: NextFunction): Promise<void>;
	logout(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class AuthController implements IAuthController {
	async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { email, password } = req.body;

			if (!email || !password) {
				throw new BadRequestError('Email and password are required');
			}

			// TODO: Implementation

			res.status(201).json({
				status: 201,
				data: null,
				message: 'User created successfully.',
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async login(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { email, password } = req.body;

			if (!email || !password) {
				throw new BadRequestError('Email and password are required');
			}

			// TODO: Implementation

			res.status(200).json({
				status: 200,
				data: {
					token: 'jwt_token_here',
				},
				message: 'Login successful.',
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}

	async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			// TODO: Implementation

			res.status(200).json({
				status: 200,
				data: null,
				message: 'User logged out successfully.',
				error: null,
			});
		} catch (error) {
			next(error);
		}
	}
}
