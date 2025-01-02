import { z } from 'zod';

export const trackSchemas = {
	getTracks: z.object({
		query: z.object({
			limit: z.string().optional(),
			offset: z.string().optional(),
			artist_id: z.string().uuid().optional(),
			album_id: z.string().uuid().optional(),
			hidden: z.enum(['true', 'false']).optional(),
		}),
	}),

	addTrack: z.object({
		body: z.object({
			artist_id: z.string().uuid('Invalid artist ID'),
			album_id: z.string().uuid('Invalid album ID'),
			name: z.string().min(1, 'Name is required'),
			duration: z.number().min(1, 'Duration must be positive'),
			hidden: z.boolean().default(false),
		}),
	}),

	updateTrack: z.object({
		params: z.object({
			id: z.string().uuid('Invalid track ID'),
		}),
		body: z.object({
			name: z.string().min(1).optional(),
			duration: z.number().min(1).optional(),
			hidden: z.boolean().optional(),
		}),
	}),

	deleteTrack: z.object({
		params: z.object({
			id: z.string().uuid('Invalid track ID'),
		}),
	}),
};
