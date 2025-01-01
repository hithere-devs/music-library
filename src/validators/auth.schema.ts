import { z } from 'zod';

export const authSchemas = {
	signup: z.object({
		body: z.object({
			email: z.string().email('Invalid email format'),
			password: z.string().min(6, 'Password must be at least 6 characters'),
		}),
	}),

	login: z.object({
		body: z.object({
			email: z.string().email('Invalid email format'),
			password: z.string().min(3, 'Password is required'),
		}),
	}),
	logout: z.object({
		headers: z.object({
			authorization: z.string().min(4, 'Token is required'),
		}),
	}),
};
