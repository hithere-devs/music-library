import bcrypt from 'bcryptjs';

// models
import db from '../models';

// utils
import {
	BadRequestError,
	NotFoundError,
	ForbiddenError,
	AlreadyExists,
} from '../utils/errors';

// types
import { UserRole } from '../types/enums';

/**
 * Service for handling user-related operations.
 *
 * This service provides methods to handle operations for retrieving,
 * creating, updating, and deleting users. It interacts with the database
 * to perform the necessary operations and returns the results.
 *
 * @class UserService
 */
export class UserService {
	/**
	 * Retrieves a list of users based on the provided parameters.
	 *
	 * @param limit - The maximum number of users to retrieve (default is 5).
	 * @param offset - The number of users to skip before starting to collect the result set (default is 0).
	 * @param role - The role to filter users by.
	 * @returns A promise that resolves to an array of users.
	 */
	async getUsers(limit: number = 5, offset: number = 0, role?: UserRole) {
		const where = role ? { role } : {};

		const users = await db.User.findAll({
			where,
			limit,
			offset,
			attributes: ['user_id', 'email', 'role', 'created_at'],
		});

		return users;
	}

	/**
	 * Adds a new user.
	 *
	 * @param email - The email of the user to add.
	 * @param password - The password of the user to add.
	 * @param role - The role of the user to add.
	 * @throws {AlreadyExists} If the user already exists.
	 * @returns A promise that resolves to the created user.
	 *
	 * @throws Will throw an error if the email already exists.
	 */
	async addUser(email: string, password: string, role: UserRole) {
		const existingUser = await db.User.findOne({ where: { email } });
		if (existingUser) {
			throw new AlreadyExists('Email');
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await db.User.create({
			email,
			password: hashedPassword,
			role,
		});

		return user;
	}

	/**
	 * Deletes a user from the database.
	 *
	 * @param userId - The ID of the user to be deleted.
	 * @param requestingUser - The user making the delete request.
	 * @throws {NotFoundError} If the user with the specified ID is not found.
	 * @throws {ForbiddenError} If the user to be deleted is an admin.
	 * @throws {ForbiddenError} If the requesting user is trying to delete their own account.
	 * @returns {Promise<void>} A promise that resolves when the user is successfully deleted.
	 */
	async deleteUser(userId: string, requestingUser: any) {
		const user = await db.User.findByPk(userId);

		if (!user) {
			throw new NotFoundError('User not found.');
		}

		if (user.role === UserRole.ADMIN) {
			throw new ForbiddenError('Cannot delete admin user.');
		}

		if (user.id === requestingUser.id) {
			throw new ForbiddenError('Cannot delete your own account.');
		}

		await user.destroy();
	}

	/**
	 * Updates the password for a user.
	 *
	 * @param userId - The ID of the user whose password is to be updated.
	 * @param oldPassword - The current password of the user.
	 * @param newPassword - The new password to be set for the user.
	 * @throws {NotFoundError} If the user is not found.
	 * @throws {BadRequestError} If the old password is invalid.
	 * @returns A promise that resolves when the password has been successfully updated.
	 */
	async updatePassword(
		userId: string,
		oldPassword: string,
		newPassword: string
	) {
		const user = await db.User.findByPk(userId);

		if (!user) {
			throw new NotFoundError('User not found.');
		}

		const isValidPassword = await bcrypt.compare(oldPassword, user.password);
		if (!isValidPassword) {
			throw new BadRequestError('Invalid old password.');
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);
		await user.update({ password: hashedPassword });
	}
}
