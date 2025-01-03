import { Request, Response, NextFunction } from 'express';

// service
import { UserService } from '../services/user.service';

// middleware
import { AuthRequest } from '../middleware/auth.middleware';

// utils
import { successResponse } from '../utils/responseHandler';

/**
 * Controller for handling user-related operations.
 *
 * This controller provides methods to handle requests for retrieving,
 * creating, updating, and deleting users. It interacts with the
 * UserService to perform the necessary operations and sends appropriate
 * responses back to the client.
 *
 * @class UserController
 */
export class UserController {
	/**
	 * The UserService instance to be used by the controller.
	 *
	 * @private
	 * @type {UserService}
	 */
	private userService: UserService;

	constructor() {
		this.userService = new UserService();
	}

	/**
	 * Retrieves a list of users based on the provided query parameters.
	 *
	 * @param req - The request object containing query parameters.
	 * @param res - The response object used to send the response.
	 * @param next - The next middleware function in the stack.
	 * @returns A promise that resolves to void.
	 *
	 * Query Parameters:
	 * - limit: The maximum number of users to retrieve (default is 5).
	 * - offset: The number of users to skip before starting to collect the result set (default is 0).
	 * - role: The role to filter users by.
	 *
	 * @throws Will pass any errors to the next middleware function.
	 */
	async getUsers(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { limit, offset, role } = req.query;
			const users = await this.userService.getUsers(
				Number(limit) || 5,
				Number(offset) || 0,
				role as any
			);

			successResponse(res, users, 'Users retrieved successfully.');
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Adds a new user.
	 *
	 * This method handles the HTTP request to create a new user. It uses the userService
	 * to create the user with the data provided in the request body. If the user is created
	 * successfully, it sends a success response with a status code of 201. If an error occurs,
	 * it passes the error to the next middleware.
	 *
	 * @param req - The HTTP request object.
	 * @param res - The HTTP response object.
	 * @param next - The next middleware function.
	 * @returns A promise that resolves to void.
	 */
	async addUser(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { email, password, role } = req.body;
			await this.userService.addUser(email, password, role);

			successResponse(res, null, 'User created successfully.', 201);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Deletes a user by their ID.
	 *
	 * @param req - The request object containing the user ID in the parameters.
	 * @param res - The response object used to send the success response.
	 * @param next - The next middleware function in the stack.
	 * @returns A promise that resolves to void.
	 *
	 * @throws Will pass any errors to the next middleware function.
	 */
	async deleteUser(
		req: AuthRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			await this.userService.deleteUser(id, req.user);

			successResponse(res, null, 'User deleted successfully.');
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Updates a user with the provided data.
	 *
	 * @param req - The request object containing the user ID in the params and the update data in the body.
	 * @param res - The response object used to send the response.
	 * @param next - The next middleware function in the stack.
	 * @returns A promise that resolves to void.
	 *
	 * @throws Will pass any errors to the next middleware function.
	 */
	async updatePassword(
		req: AuthRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { old_password, new_password } = req.body;
			await this.userService.updatePassword(
				req.user!.id,
				old_password,
				new_password
			);

			successResponse(res, null, 'Password updated successfully.', 204);
		} catch (error) {
			next(error);
		}
	}
}
