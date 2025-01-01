import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { BadRequestError } from '../utils/errors';
import { successResponse } from '../utils/responseHandler';

export interface IAuthController {
	signup(req: Request, res: Response, next: NextFunction): Promise<void>;
	login(req: Request, res: Response, next: NextFunction): Promise<void>;
	logout(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class AuthController implements IAuthController {
	private authService: AuthService;

	constructor() {
		this.authService = new AuthService();
	}

	async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { email, password } = req.body;

			await this.authService.signup(email, password);

			successResponse(res, null, 'User created successfully.', 201);
		} catch (error) {
			next(error);
		}
	}

	async login(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { email, password } = req.body;

			const token = await this.authService.login(email, password);

			successResponse(res, { token }, 'Login successful.');
		} catch (error) {
			next(error);
		}
	}

	async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const token = req.headers.authorization?.split(' ')[1];

			await this.authService.logout(token!);

			successResponse(res, null, 'User logged out successfully.');
		} catch (error) {
			next(error);
		}
	}
}
