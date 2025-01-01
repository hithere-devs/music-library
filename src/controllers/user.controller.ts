import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { successResponse } from '../utils/responseHandler';
import { AuthRequest } from '../middleware/auth.middleware';

export class UserController {
	private userService: UserService;

	constructor() {
		this.userService = new UserService();
	}

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

	async deleteUser(
		req: AuthRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			await this.userService.deleteUser(id, req.user);

			successResponse(res, null, 'User deleted successfully');
		} catch (error) {
			next(error);
		}
	}

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

			successResponse(res, null, 'Password updated successfully', 204);
		} catch (error) {
			next(error);
		}
	}
}
