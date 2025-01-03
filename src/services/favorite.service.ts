// models
import db from '../models';

// utils
import { BadRequestError, NotFoundError } from '../utils/errors';

// types
import { FavoriteType } from '../types/enums';

/**
 * Service for handling favorite-related operations.
 *
 * This service provides methods to handle operations for retrieving,
 * adding, and removing favorite items for a user. It interacts with the database
 * to perform the necessary operations and returns the results.
 *
 * @class FavoriteService
 */
export class FavoriteService {
	/**
	 * Retrieves the details of an item based on its type and ID.
	 *
	 * @param type - The type of the favorite item (e.g., ARTIST, ALBUM, TRACK).
	 * @param itemId - The ID of the item to retrieve details for.
	 * @returns A promise that resolves to the item details.
	 */
	private async getItemDetails(type: FavoriteType, itemId: string) {
		switch (type) {
			case FavoriteType.ARTIST:
				return await db.Artist.findByPk(itemId);
			case FavoriteType.ALBUM:
				return await db.Album.findByPk(itemId);
			case FavoriteType.TRACK:
				return await db.Track.findByPk(itemId);
			default:
				return null;
		}
	}

	/**
	 * Retrieves a user's favorite items based on category and pagination parameters.
	 *
	 * @param userId - The ID of the user whose favorites are being retrieved.
	 * @param category - The category of favorites to retrieve.
	 * @param limit - The maximum number of favorites to retrieve (default is 5).
	 * @param offset - The number of favorites to skip before starting to collect the result set (default is 0).
	 * @returns A promise that resolves to an array of favorite items with details.
	 */
	async getFavorites(
		userId: string,
		category: string,
		limit: number = 5,
		offset: number = 0
	) {
		const favorites = await db.Favorite.findAll({
			where: {
				user_id: userId,
				favorite_type: category,
			},
			limit,
			offset,
			order: [['created_at', 'DESC']],
		});

		const detailedFavorites = await Promise.all(
			favorites.map(async (fav) => {
				const item = await this.getItemDetails(
					fav.favorite_type as FavoriteType,
					fav.favorite_id
				);
				return {
					favorite_id: fav.id,
					category: fav.favorite_type,
					item_id: fav.favorite_id,
					name: item?.name || 'Unknown',
					created_at: fav.created_at,
				};
			})
		);

		return detailedFavorites;
	}

	/**
	 * Adds an item to a user's favorites.
	 *
	 * @param userId - The ID of the user adding the favorite.
	 * @param category - The category of the item being favorited.
	 * @param itemId - The ID of the item to be favorited.
	 * @returns A promise that resolves to void.
	 *
	 * @throws Will throw an error if the item is not found.
	 */
	async addFavorite(userId: string, category: string, itemId: string) {
		// Verify item exists
		const item = await this.getItemDetails(category as FavoriteType, itemId);
		if (!item) {
			throw new NotFoundError('Item not found.');
		}

		// Check if already favorited
		const existingFavorite = await db.Favorite.findOne({
			where: {
				user_id: userId,
				favorite_type: category,
				favorite_id: itemId,
			},
		});

		if (existingFavorite) {
			throw new BadRequestError('Item already in favorites.');
		}

		await db.Favorite.create({
			user_id: userId,
			favorite_type: category,
			favorite_id: itemId,
		});
	}

	/**
	 * Removes an item from a user's favorites.
	 *
	 * @param userId - The ID of the user removing the favorite.
	 * @param favoriteId - The ID of the favorite item to remove.
	 * @returns A promise that resolves to void.
	 *
	 * @throws Will throw an error if the favorite item is not found.
	 */
	async removeFavorite(userId: string, favoriteId: string) {
		const favorite = await db.Favorite.findOne({
			where: {
				id: favoriteId,
				user_id: userId,
			},
		});

		if (!favorite) {
			throw new NotFoundError('Favorite not found.');
		}

		await favorite.destroy();
	}
}
