import { Request, Response, NextFunction } from 'express';

// service
import { AlbumService } from '../services/album.service';

// utils
import { successResponse } from '../utils/responseHandler';

/**
 * Controller for handling album-related operations.
 *
 * This controller provides methods to handle requests for retrieving,
 * creating, updating, and deleting albums. It interacts with the
 * AlbumService to perform the necessary operations and sends appropriate
 * responses back to the client.
 *
 * @class AlbumController
 */
export class AlbumController {
	/**
	 * The AlbumService instance to be used by the controller.
	 *
	 * @private
	 * @type {AlbumService}
	 * */
	private albumService: AlbumService;

	constructor() {
		this.albumService = new AlbumService();
	}

	/**
	 * Retrieves a list of albums based on the provided query parameters.
	 *
	 * @param req - The request object containing query parameters.
	 * @param res - The response object used to send the response.
	 * @param next - The next middleware function in the stack.
	 * @returns A promise that resolves to void.
	 *
	 * Query Parameters:
	 * - limit: The maximum number of albums to retrieve (default is 5).
	 * - offset: The number of albums to skip before starting to collect the result set (default is 0).
	 * - artist_id: The ID of the artist to filter albums by.
	 * - hidden: A boolean indicating whether to include hidden albums.
	 *
	 * @throws Will pass any errors to the next middleware function.
	 */
	async getAlbums(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { limit, offset, artist_id, hidden } = req.query;
			const albums = await this.albumService.getAlbums(
				Number(limit) || 5,
				Number(offset) || 0,
				artist_id as string,
				hidden ? hidden === 'true' : undefined
			);

			successResponse(res, albums, 'Albums retrieved successfully.');
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Retrieves an album by its ID.
	 *
	 * @param req - The request object containing the album ID in the parameters and query parameters.
	 * @param res - The response object used to send the album data back to the client.
	 * @param next - The next middleware function in the stack.
	 * @returns A promise that resolves to void.
	 *
	 * Query Parameters:
	 * - id: Album Id.
	 *
	 * @throws Will pass any errors to the next middleware function.
	 */
	async getAlbumById(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			const album = await this.albumService.getAlbumById(id);

			successResponse(res, album, 'Album retrieved successfully.');
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Creates a new album.
	 *
	 * This method handles the HTTP request to create a new album. It uses the albumService
	 * to create the album with the data provided in the request body. If the album is created
	 * successfully, it sends a success response with a status code of 201. If an error occurs,
	 * it passes the error to the next middleware.
	 *
	 * @param req - The HTTP request object.
	 * @param res - The HTTP response object.
	 * @param next - The next middleware function.
	 * @returns A promise that resolves to void.
	 */
	async createAlbum(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			await this.albumService.createAlbum(req.body);
			successResponse(res, null, 'Album created successfully.', 201);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Updates an album with the provided data.
	 *
	 * @param req - The request object containing the album ID in the params and the update data in the body.
	 * @param res - The response object used to send the response.
	 * @param next - The next middleware function in the stack.
	 * @returns A promise that resolves to void.
	 *
	 * @throws Will pass any errors to the next middleware function.
	 */
	async updateAlbum(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			await this.albumService.updateAlbum(id, req.body);
			successResponse(res, null, 'Album updated successfully.', 204);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Deletes an album by its ID.
	 *
	 * @param req - The request object containing the album ID in the parameters.
	 * @param res - The response object used to send the success response.
	 * @param next - The next middleware function in the stack.
	 * @returns A promise that resolves to void.
	 *
	 * @throws Will pass any errors to the next middleware function.
	 */
	async deleteAlbum(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			await this.albumService.deleteAlbum(id);
			successResponse(res, null, 'Album deleted successfully.');
		} catch (error) {
			next(error);
		}
	}
}
