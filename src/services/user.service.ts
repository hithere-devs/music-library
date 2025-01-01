import bcrypt from 'bcryptjs';
import db from '../models';
import {
	BadRequestError,
	NotFoundError,
	ForbiddenError,
	AlreadyExists,
} from '../utils/errors';
import { UserRole } from '../types/enums';

export class UserService {
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

	async deleteUser(userId: string, requestingUser: any) {
		const user = await db.User.findByPk(userId);

		if (!user) {
			throw new NotFoundError('User not found.');
		}

		if (user.role === UserRole.ADMIN) {
			throw new ForbiddenError('Cannot delete admin user');
		}

		if (user.id === requestingUser.id) {
			throw new ForbiddenError('Cannot delete your own account');
		}

		await user.destroy();
	}

	async updatePassword(
		userId: string,
		oldPassword: string,
		newPassword: string
	) {
		const user = await db.User.findByPk(userId);

		if (!user) {
			throw new NotFoundError('User not found');
		}

		const isValidPassword = await bcrypt.compare(oldPassword, user.password);
		if (!isValidPassword) {
			throw new BadRequestError('Invalid old password');
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);
		await user.update({ password: hashedPassword });
	}
}
