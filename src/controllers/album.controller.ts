// src/controllers/album.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AlbumService } from '../services/album.service';
import { successResponse } from '../utils/responseHandler';

export class AlbumController {
	private albumService: AlbumService;

	constructor() {
		this.albumService = new AlbumService();
	}

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

			successResponse(res, albums, 'Albums retrieved successfully');
		} catch (error) {
			next(error);
		}
	}

	async getAlbumById(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			const album = await this.albumService.getAlbumById(id);

			successResponse(res, album, 'Album retrieved successfully');
		} catch (error) {
			next(error);
		}
	}

	async createAlbum(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			await this.albumService.createAlbum(req.body);
			successResponse(res, null, 'Album created successfully', 201);
		} catch (error) {
			next(error);
		}
	}

	async updateAlbum(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			await this.albumService.updateAlbum(id, req.body);
			successResponse(res, null, 'Album updated successfully', 204);
		} catch (error) {
			next(error);
		}
	}

	async deleteAlbum(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			await this.albumService.deleteAlbum(id);
			successResponse(res, null, 'Album deleted successfully');
		} catch (error) {
			next(error);
		}
	}
}
