import db from '../models';
import { FavoriteType } from '../types/enums';

import { BadRequestError, NotFoundError } from '../utils/errors';

export class FavoriteService {
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

	async addFavorite(userId: string, category: string, itemId: string) {
		// Verify item exists
		const item = await this.getItemDetails(category as FavoriteType, itemId);
		if (!item) {
			throw new NotFoundError('Item not found');
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
			throw new BadRequestError('Item already in favorites');
		}

		await db.Favorite.create({
			user_id: userId,
			favorite_type: category,
			favorite_id: itemId,
		});
	}

	async removeFavorite(userId: string, favoriteId: string) {
		const favorite = await db.Favorite.findOne({
			where: {
				id: favoriteId,
				user_id: userId,
			},
		});

		if (!favorite) {
			throw new NotFoundError('Favorite not found');
		}

		await favorite.destroy();
	}
}
