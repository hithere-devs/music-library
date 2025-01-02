import { Request, Response, NextFunction } from 'express';
import { TrackService } from '../services/track.service';
import { successResponse } from '../utils/responseHandler';

export class TrackController {
	private trackService: TrackService;

	constructor() {
		this.trackService = new TrackService();
	}

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

			successResponse(res, tracks, 'Tracks retrieved successfully');
		} catch (error) {
			next(error);
		}
	}

	async getTrackById(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			const track = await this.trackService.getTrackById(id);

			successResponse(res, track, 'Track retrieved successfully');
		} catch (error) {
			next(error);
		}
	}

	async createTrack(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			await this.trackService.createTrack(req.body);
			successResponse(res, null, 'Track created successfully', 201);
		} catch (error) {
			next(error);
		}
	}

	async updateTrack(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			await this.trackService.updateTrack(id, req.body);
			successResponse(res, null, 'Track updated successfully', 204);
		} catch (error) {
			next(error);
		}
	}

	async deleteTrack(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			const trackName = await this.trackService.deleteTrack(id);
			successResponse(res, null, `Track:${trackName} deleted successfully`);
		} catch (error) {
			next(error);
		}
	}
}
