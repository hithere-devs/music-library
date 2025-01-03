import { Request, Response, NextFunction } from 'express';

// service
import { AuthService } from '../services/auth.service';

// utils
import { successResponse } from '../utils/responseHandler';

export interface IAuthController {
	signup(req: Request, res: Response, next: NextFunction): Promise<void>;
	login(req: Request, res: Response, next: NextFunction): Promise<void>;
	logout(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * Controller for handling authentication-related operations.
 *
 * This controller provides methods to handle requests for user signup,
 * login, and logout. It interacts with the AuthService to perform the
 * necessary operations and sends appropriate responses back to the client.
 *
 * @class AuthController
 * @implements {IAuthController}
 */
export class AuthController implements IAuthController {
	/**
	 * The AuthService instance to be used by the controller.
	 *
	 * @private
	 * @type {AuthService}
	 */
	private authService: AuthService;

	constructor() {
		this.authService = new AuthService();
	}

	/**
	 * Handles user signup.
	 *
	 * @param req - The request object containing the user's email and password.
	 * @param res - The response object used to send the response.
	 * @param next - The next middleware function in the stack.
	 * @returns A promise that resolves to void.
	 *
	 * @throws Will pass any errors to the next middleware function.
	 */
	async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { email, password } = req.body;

			await this.authService.signup(email, password);

			successResponse(res, null, 'User created successfully.', 201);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Handles user login.
	 *
	 * @param req - The request object containing email and password in the body.
	 * @param res - The response object used to send the response.
	 * @param next - The next middleware function in the stack.
	 * @returns A promise that resolves to void.
	 *
	 * @throws Will pass any error to the next middleware function.
	 */
	async login(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { email, password } = req.body;

			const token = await this.authService.login(email, password);

			successResponse(res, { token }, 'Login successful.');
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Logs out the user by invalidating the provided authorization token.
	 *
	 * @param {Request} req - The request object containing the authorization header.
	 * @param {Response} res - The response object used to send the success message.
	 * @param {NextFunction} next - The next middleware function in the stack.
	 * @returns {Promise<void>} - A promise that resolves when the logout process is complete.
	 *
	 * @throws Will pass any errors to the next middleware function.
	 */
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
