import { z } from 'zod';

// types
import { UserRole } from '../types/enums';

/**
 * Req Body Schemas for user-related API endpoints.
 */
export const userSchemas = {
	getUsers: z.object({
		query: z.object({
			limit: z.string().optional(),
			offset: z.string().optional(),
			role: z.enum([UserRole.EDITOR, UserRole.VIEWER]).optional(),
		}),
	}),

	addUser: z.object({
		body: z.object({
			email: z.string().email('Invalid email format'),
			password: z.string().min(6, 'Password must be at least 6 characters'),
			role: z.enum([UserRole.EDITOR, UserRole.VIEWER]),
		}),
	}),

	deleteUser: z.object({
		params: z.object({
			id: z.string().uuid('Invalid user ID'),
		}),
	}),

	updatePassword: z.object({
		body: z.object({
			old_password: z.string().min(1, 'Old password is required'),
			new_password: z
				.string()
				.min(6, 'New password must be at least 6 characters'),
		}),
	}),
};
