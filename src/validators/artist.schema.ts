import { z } from 'zod';

export const artistSchemas = {
	getArtists: z.object({
		query: z.object({
			limit: z.string().optional(),
			offset: z.string().optional(),
			grammy: z.string().optional(),
			hidden: z.enum(['true', 'false']).optional(),
		}),
	}),

	addArtist: z.object({
		body: z.object({
			name: z.string().min(1, 'Name is required'),
			grammy: z.number().int().min(0),
			hidden: z.boolean().default(false),
		}),
	}),

	updateArtist: z.object({
		params: z.object({
			id: z.string().uuid('Invalid artist ID'),
		}),
		body: z.object({
			name: z.string().optional(),
			grammy: z.number().int().min(0).optional(),
			hidden: z.boolean().optional(),
		}),
	}),

	deleteArtist: z.object({
		params: z.object({
			id: z.string().uuid('Invalid artist ID'),
		}),
	}),
};
