import { Request, Response, NextFunction } from 'express';

// service
import { ArtistService } from '../services/artist.service';

// utils
import { successResponse } from '../utils/responseHandler';

/**
 * Controller for handling artist-related operations.
 *
 * This controller provides methods to handle requests for retrieving,
 * creating, updating, and deleting artists. It interacts with the
 * ArtistService to perform the necessary operations and sends appropriate
 * responses back to the client.
 *
 * @class ArtistController
 */
export class ArtistController {
	/**
	 * The ArtistService instance to be used by the controller.
	 *
	 * @private
	 * @type {ArtistService}
	 */
	private artistService: ArtistService;

	constructor() {
		this.artistService = new ArtistService();
	}

	/**
	 * Retrieves a list of artists based on query parameters.
	 *
	 * @param req - The request object containing query parameters.
	 * @param res - The response object to send the retrieved artists.
	 * @param next - The next middleware function in the stack.
	 * @returns A promise that resolves to void.
	 *
	 * Query Parameters:
	 * - limit: The maximum number of artists to retrieve (default is 5).
	 * - offset: The number of artists to skip before starting to collect the result set (default is 0).
	 * - grammy: Filter artists based on Grammy awards (optional).
	 * - hidden: Filter artists based on their hidden status (optional, 'true' or 'false').
	 *
	 * @throws Will pass any errors to the next middleware function.
	 */
	async getArtists(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { limit, offset, grammy, hidden } = req.query;
			const artists = await this.artistService.getArtists(
				Number(limit) || 5,
				Number(offset) || 0,
				grammy ? Number(grammy) : undefined,
				hidden ? hidden === 'true' : undefined
			);

			successResponse(res, artists, 'Artists retrieved successfully.');
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Retrieves an artist by their ID.
	 *
	 * @param req - The request object containing the artist ID in the parameters.
	 * @param res - The response object used to send the artist data back to the client.
	 * @param next - The next middleware function in the stack.
	 * @returns A promise that resolves to void.
	 *
	 * @throws Will pass any errors to the next middleware function.
	 */
	async getArtistById(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			const artist = await this.artistService.getArtistById(id);

			successResponse(res, artist, 'Artist retrieved successfully.');
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Creates a new artist.
	 *
	 * This method handles the creation of a new artist by calling the artist service
	 * with the data provided in the request body. If the artist is successfully created,
	 * it sends a success response with a status code of 201. If an error occurs during
	 * the creation process, it passes the error to the next middleware.
	 *
	 * @param req - The request object containing the artist data.
	 * @param res - The response object used to send the success response.
	 * @param next - The next middleware function to handle errors.
	 * @returns A promise that resolves to void.
	 */
	async createArtist(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const artist = await this.artistService.createArtist(req.body);
			successResponse(res, null, 'Artist created successfully.', 201);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Updates an existing artist.
	 *
	 * This method handles the update of an existing artist by calling the artist service
	 * with the artist ID from the request parameters and the updated data from the request body.
	 * If the artist is successfully updated, it sends a success response with a status code of 204.
	 * If an error occurs during the update process, it passes the error to the next middleware.
	 *
	 * @param req - The request object containing the artist ID in the parameters and the updated data in the body.
	 * @param res - The response object used to send the success response.
	 * @param next - The next middleware function to handle errors.
	 * @returns A promise that resolves to void.
	 */
	async updateArtist(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			await this.artistService.updateArtist(id, req.body);
			successResponse(res, null, 'Artist updated successfully.', 204);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Deletes an existing artist.
	 *
	 * This method handles the deletion of an existing artist by calling the artist service
	 * with the artist ID from the request parameters. If the artist is successfully deleted,
	 * it sends a success response with the deleted artist's ID. If an error occurs during
	 * the deletion process, it passes the error to the next middleware.
	 *
	 * @param req - The request object containing the artist ID in the parameters.
	 * @param res - The response object used to send the success response.
	 * @param next - The next middleware function to handle errors.
	 * @returns A promise that resolves to void.
	 */
	async deleteArtist(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			const artist = await this.artistService.deleteArtist(id);
			successResponse(
				res,
				{ artist_id: artist.id },
				'Artist deleted successfully.'
			);
		} catch (error) {
			next(error);
		}
	}
}
