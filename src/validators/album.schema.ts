import { z } from 'zod';

export const albumSchemas = {
	getAlbums: z.object({
		query: z.object({
			limit: z.string().optional(),
			offset: z.string().optional(),
			artist_id: z.string().uuid().optional(),
			hidden: z.enum(['true', 'false']).optional(),
		}),
	}),

	addAlbum: z.object({
		body: z.object({
			artist_id: z.string().uuid('Invalid artist ID'),
			name: z.string().min(1, 'Name is required'),
			year: z.number().min(1900).max(new Date().getFullYear()),
			hidden: z.boolean().default(false),
		}),
	}),

	updateAlbum: z.object({
		params: z.object({
			id: z.string().uuid('Invalid album ID'),
		}),
		body: z.object({
			name: z.string().min(1).optional(),
			year: z.number().min(1900).max(new Date().getFullYear()).optional(),
			hidden: z.boolean().optional(),
		}),
	}),

	deleteAlbum: z.object({
		params: z.object({
			id: z.string().uuid('Invalid album ID'),
		}),
	}),
};
