import bcrypt from 'bcryptjs';

// models
import db from '../models';

// utils
import { AlreadyExists, BadRequestError, NotFoundError } from '../utils/errors';
import { generateToken } from '../utils/jwt';

// types
import { UserRole } from '../types/enums';

/**
 * Service for handling authentication-related operations.
 *
 * This service provides methods to handle user signup and login operations.
 * It interacts with the database to perform the necessary operations and returns the results.
 *
 * @class AuthService
 */
export class AuthService {
	/**
	 * Signs up a new user.
	 *
	 * This method handles the signup process by checking if the user already exists,
	 * hashing the password, and creating a new user in the database. The first user
	 * to sign up is assigned the admin role.
	 *
	 * @param email - The email of the user to sign up.
	 * @param password - The password of the user to sign up.
	 * @returns A promise that resolves to void.
	 *
	 * @throws Will throw an error if the email already exists.
	 */
	async signup(email: string, password: string): Promise<void> {
		// Check if user exists
		const existingUser = await db.User.findOne({ where: { email } });
		if (existingUser) {
			throw new AlreadyExists('Email');
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

	/**
	 * Logs in a user.
	 *
	 * This method handles the login process by finding the user in the database,
	 * verifying the password, and generating a JWT token if the credentials are valid.
	 *
	 * @param email - The email of the user to log in.
	 * @param password - The password of the user to log in.
	 * @returns A promise that resolves to a JWT token.
	 *
	 * @throws Will throw an error if the user is not found or the password is incorrect.
	 */
	async login(email: string, password: string): Promise<string> {
		// Find user
		const user = await db.User.findOne({ where: { email } });
		if (!user) {
			throw new NotFoundError('User not found.');
		}

		// Verify password
		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			throw new BadRequestError('Invalid password.');
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
