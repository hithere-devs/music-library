import { Request, Response, NextFunction } from 'express';
import { ArtistService } from '../services/artist.service';
import { successResponse } from '../utils/responseHandler';

export class ArtistController {
	private artistService: ArtistService;

	constructor() {
		this.artistService = new ArtistService();
	}

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

			successResponse(res, artists, 'Artists retrieved successfully');
		} catch (error) {
			next(error);
		}
	}

	async getArtistById(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			const artist = await this.artistService.getArtistById(id);

			successResponse(res, artist, 'Artist retrieved successfully');
		} catch (error) {
			next(error);
		}
	}

	async createArtist(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const artist = await this.artistService.createArtist(req.body);
			successResponse(res, null, 'Artist created successfully', 201);
		} catch (error) {
			next(error);
		}
	}

	async updateArtist(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			await this.artistService.updateArtist(id, req.body);
			successResponse(res, null, 'Artist updated successfully', 204);
		} catch (error) {
			next(error);
		}
	}

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
				'Artist deleted successfully'
			);
		} catch (error) {
			next(error);
		}
	}
}
