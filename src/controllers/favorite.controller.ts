import { Response, NextFunction } from 'express';

// service
import { FavoriteService } from '../services/favorite.service';

// middleware
import { AuthRequest } from '../middleware/auth.middleware';

// utils
import { successResponse } from '../utils/responseHandler';

/**
 * Controller for handling favorite-related operations.
 *
 * This controller provides methods to handle requests for retrieving,
 * adding, and removing favorite items for a user. It interacts with the
 * FavoriteService to perform these operations and sends appropriate
 * responses back to the client.
 *
 * @class FavoriteController
 */
export class FavoriteController {
	/**
	 * The FavoriteService instance to be used by the controller.
	 *
	 * @private
	 * @type {FavoriteService}
	 */
	private favoriteService: FavoriteService;

	constructor() {
		this.favoriteService = new FavoriteService();
	}

	/**
	 * Retrieves a user's favorite items based on category and pagination parameters.
	 *
	 * @param req - The authenticated request object containing user information.
	 * @param res - The response object used to send the response.
	 * @param next - The next middleware function in the stack.
	 * @returns A promise that resolves to void.
	 *
	 * Parameters:
	 * - category: The category of favorites to retrieve (in req.params)
	 *
	 * Query Parameters:
	 * - limit: The maximum number of favorites to retrieve (default is 5)
	 * - offset: The number of favorites to skip before starting to collect the result set (default is 0)
	 *
	 * @throws Will pass any errors to the next middleware function.
	 */
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

			successResponse(res, favorites, 'Favorites retrieved successfully.');
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Adds an item to a user's favorites.
	 *
	 * @param req - The authenticated request object containing user information and favorite details.
	 * @param res - The response object used to send the response.
	 * @param next - The next middleware function in the stack.
	 * @returns A promise that resolves to void.
	 *
	 * @throws Will pass any errors to the next middleware function.
	 */
	async addFavorite(
		req: AuthRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { category, item_id } = req.body;
			const userId = req.user!.id;

			await this.favoriteService.addFavorite(userId, category, item_id);
			successResponse(res, null, 'Favorite added successfully.', 201);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Removes an item from a user's favorites.
	 *
	 * @param req - The authenticated request object containing user information and favorite ID.
	 * @param res - The response object used to send the response.
	 * @param next - The next middleware function in the stack.
	 * @returns A promise that resolves to void.
	 *
	 * Route Parameters:
	 * - id: The unique identifier of the favorite item to remove
	 *
	 * @throws Will pass any errors to the next middleware function.
	 */
	async removeFavorite(
		req: AuthRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			const userId = req.user!.id;

			await this.favoriteService.removeFavorite(userId, id);
			successResponse(res, null, 'Favorite removed successfully.');
		} catch (error) {
			next(error);
		}
	}
}
