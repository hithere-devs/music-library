import bcrypt from 'bcryptjs';
import { UserRole } from '../types/enums';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { generateToken } from '../utils/jwt';
import db from '../models';

export class AuthService {
	async signup(email: string, password: string): Promise<void> {
		// Check if user exists
		const existingUser = await db.User.findOne({ where: { email } });
		if (existingUser) {
			throw new BadRequestError('Email already exists');
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create user
		// First user becomes admin
		const isFirstUser = (await db.User.count()) === 0;

		await db.User.create({
			email,
			password: hashedPassword,
			role: isFirstUser ? UserRole.ADMIN : UserRole.VIEWER,
		});
	}

	async login(email: string, password: string): Promise<string> {
		// Find user
		const user = await db.User.findOne({ where: { email } });
		if (!user) {
			throw new NotFoundError('User not found');
		}

		// Verify password
		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			throw new BadRequestError('Invalid password');
		}

		// Generate token
		const token = generateToken({
			id: user.id,
			email: user.email,
			role: user.role,
		});

		return token;
	}

	async logout(token: string): Promise<void> {
		// In a real application, you might want to blacklist the token
		// For now, we'll just return success as client-side should remove the token
		return;
	}
}
