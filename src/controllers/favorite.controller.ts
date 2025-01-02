import { Response, NextFunction } from 'express';
import { FavoriteService } from '../services/favorite.service';
import { successResponse } from '../utils/responseHandler';
import { AuthRequest } from '../middleware/auth.middleware';

export class FavoriteController {
	private favoriteService: FavoriteService;

	constructor() {
		this.favoriteService = new FavoriteService();
	}

	async getFavorites(
		req: AuthRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { category } = req.params;
			const { limit, offset } = req.query;
			const userId = req.user!.id;

			const favorites = await this.favoriteService.getFavorites(
				userId,
				category,
				Number(limit) || 5,
				Number(offset) || 0
			);

			successResponse(res, favorites, 'Favorites retrieved successfully');
		} catch (error) {
			next(error);
		}
	}

	async addFavorite(
		req: AuthRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { category, item_id } = req.body;
			const userId = req.user!.id;

			await this.favoriteService.addFavorite(userId, category, item_id);
			successResponse(res, null, 'Favorite added successfully', 201);
		} catch (error) {
			next(error);
		}
	}

	async removeFavorite(
		req: AuthRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			const userId = req.user!.id;

			await this.favoriteService.removeFavorite(userId, id);
			successResponse(res, null, 'Favorite removed successfully');
		} catch (error) {
			next(error);
		}
	}
}
