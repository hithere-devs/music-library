import { Request, Response, NextFunction } from 'express';

// service
import { TrackService } from '../services/track.service';

// utils
import { successResponse } from '../utils/responseHandler';

/**
 * Controller for handling track-related operations.
 *
 * This controller provides methods to handle requests for retrieving,
 * creating, updating, and deleting tracks. It interacts with the
 * TrackService to perform the necessary operations and sends appropriate
 * responses back to the client.
 *
 * @class TrackController
 */
export class TrackController {
	/**
	 * The TrackService instance to be used by the controller.
	 *
	 * @private
	 * @type {TrackService}
	 */
	private trackService: TrackService;

	constructor() {
		this.trackService = new TrackService();
	}

	/**
	 * Retrieves a list of tracks based on the provided query parameters.
	 *
	 * @param req - The request object containing query parameters.
	 * @param res - The response object used to send the response.
	 * @param next - The next middleware function in the stack.
	 * @returns A promise that resolves to void.
	 *
	 * Query Parameters:
	 * - limit: The maximum number of tracks to retrieve (default is 5).
	 * - offset: The number of tracks to skip before starting to collect the result set (default is 0).
	 * - album_id: The ID of the album to filter tracks by.
	 * - hidden: A boolean indicating whether to include hidden tracks.
	 *
	 * @throws Will pass any errors to the next middleware function.
	 */
	async getTracks(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { limit, offset, artist_id, album_id, hidden } = req.query;
			const tracks = await this.trackService.getTracks(
				Number(limit) || 5,
				Number(offset) || 0,
				artist_id as string,
				album_id as string,
				hidden ? hidden === 'true' : undefined
			);

			successResponse(res, tracks, 'Tracks retrieved successfully.');
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Retrieves a track by its ID.
	 *
	 * @param req - The request object containing the track ID in the parameters.
	 * @param res - The response object used to send the track data back to the client.
	 * @param next - The next middleware function in the stack.
	 * @returns A promise that resolves to void.
	 *
	 * Route Parameters:
	 * - id: Track ID.
	 *
	 * @throws Will pass any errors to the next middleware function.
	 */
	async getTrackById(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			const track = await this.trackService.getTrackById(id);

			successResponse(res, track, 'Track retrieved successfully.');
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Creates a new track.
	 *
	 * This method handles the HTTP request to create a new track. It uses the trackService
	 * to create the track with the data provided in the request body. If the track is created
	 * successfully, it sends a success response with a status code of 201. If an error occurs,
	 * it passes the error to the next middleware.
	 *
	 * @param req - The HTTP request object.
	 * @param res - The HTTP response object.
	 * @param next - The next middleware function.
	 * @returns A promise that resolves to void.
	 */
	async createTrack(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			await this.trackService.createTrack(req.body);
			successResponse(res, null, 'Track created successfully.', 201);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Updates a track with the provided data.
	 *
	 * @param req - The request object containing the track ID in the params and the update data in the body.
	 * @param res - The response object used to send the response.
	 * @param next - The next middleware function in the stack.
	 * @returns A promise that resolves to void.
	 *
	 * @throws Will pass any errors to the next middleware function.
	 */
	async updateTrack(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			await this.trackService.updateTrack(id, req.body);
			successResponse(res, null, 'Track updated successfully.', 204);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Deletes a track by its ID.
	 *
	 * @param req - The request object containing the track ID in the parameters.
	 * @param res - The response object used to send the success response.
	 * @param next - The next middleware function in the stack.
	 * @returns A promise that resolves to void.
	 *
	 * @throws Will pass any errors to the next middleware function.
	 */
	async deleteTrack(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			const trackName = await this.trackService.deleteTrack(id);
			successResponse(res, null, `Track:${trackName} deleted successfully.`);
		} catch (error) {
			next(error);
		}
	}
}
