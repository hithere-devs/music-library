import { z } from 'zod';

/**
 * Req Body Schemas for favorite-related API endpoints.
 */
export const favoriteSchemas = {
	getFavorites: z.object({
		params: z.object({
			category: z.enum(['artist', 'album', 'track']),
		}),
		query: z.object({
			limit: z.string().optional(),
			offset: z.string().optional(),
		}),
	}),

	addFavorite: z.object({
		body: z.object({
			category: z.enum(['artist', 'album', 'track']),
			item_id: z.string().uuid('Invalid item ID'),
		}),
	}),

	deleteFavorite: z.object({
		params: z.object({
			id: z.string().uuid('Invalid favorite ID'),
		}),
	}),
};
