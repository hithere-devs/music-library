// models
import db from '../models';

// utils
import { NotFoundError } from '../utils/errors';

/**
 * Service for handling album-related operations.
 *
 * This service provides methods to handle operations for retrieving,
 * creating, updating, and deleting albums. It interacts with the database
 * to perform the necessary operations and returns the results.
 *
 * @class AlbumService
 */
export class AlbumService {
	/**
	 * Retrieves a list of albums based on the provided parameters.
	 *
	 * @param limit - The maximum number of albums to retrieve (default is 5).
	 * @param offset - The number of albums to skip before starting to collect the result set (default is 0).
	 * @param artist_id - The ID of the artist to filter albums by.
	 * @param hidden - A boolean indicating whether to include hidden albums.
	 * @returns A promise that resolves to an array of albums.
	 *
	 * @throws Will throw an error if the artist is not found.
	 */
	async getAlbums(
		limit: number = 5,
		offset: number = 0,
		artist_id?: string,
		hidden?: boolean
	) {
		const where: any = {};

		if (artist_id) {
			where.artist_id = artist_id;
			// Verify artist exists
			const artist = await db.Artist.findByPk(artist_id);
			if (!artist) {
				throw new NotFoundError('Artist not found');
			}
		}

		if (hidden !== undefined) {
			where.hidden = hidden;
		}

		const albums = await db.Album.findAll({
			where,
			limit,
			offset,
			include: [
				{
					model: db.Artist,
					attributes: ['name'],
				},
			],
			order: [['created_at', 'DESC']],
		});

		return albums.map((album: any) => ({
			album_id: album.id,
			artist_name: album.artist?.name,
			name: album.name,
			year: album.year,
			hidden: album.hidden,
		}));
	}

	/**
	 * Retrieves an album by its ID.
	 *
	 * @param id - The ID of the album to retrieve.
	 * @returns A promise that resolves to the album data.
	 *
	 * @throws Will throw an error if the album is not found.
	 */
	async getAlbumById(id: string) {
		const album = await db.Album.findByPk(id, {
			include: [
				{
					model: db.Artist,
					attributes: ['name'],
				},
			],
		});

		if (!album) {
			throw new NotFoundError('Album not found.');
		}

		return {
			album_id: album.id,
			artist_name: album.artist?.name,
			name: album.name,
			year: album.year,
			hidden: album.hidden,
		};
	}

	/**
	 * Creates a new album.
	 *
	 * @param data - The data for the new album.
	 * @returns A promise that resolves to the created album.
	 *
	 * @throws Will throw an error if the artist is not found.
	 */
	async createAlbum(data: {
		artist_id: string;
		name: string;
		year: number;
		hidden: boolean;
	}) {
		// Verify artist exists
		const artist = await db.Artist.findByPk(data.artist_id);
		if (!artist) {
			throw new NotFoundError('Artist not found.');
		}

		const album = await db.Album.create(data);
		return album;
	}

	/**
	 * Updates an album with the provided data.
	 *
	 * @param id - The ID of the album to update.
	 * @param data - The data to update the album with.
	 * @returns A promise that resolves to void.
	 *
	 * @throws Will throw an error if the album is not found.
	 */
	async updateAlbum(
		id: string,
		data: Partial<{ name: string; year: number; hidden: boolean }>
	) {
		const album = await db.Album.findByPk(id);
		if (!album) {
			throw new NotFoundError('Album not found.');
		}

		await album.update(data);
	}

	/**
	 * Deletes an album by its ID.
	 *
	 * @param id - The ID of the album to delete.
	 * @returns A promise that resolves to void.
	 *
	 * @throws Will throw an error if the album is not found.
	 */
	async deleteAlbum(id: string) {
		const album = await db.Album.findByPk(id);
		if (!album) {
			throw new NotFoundError('Album not found.');
		}

		await album.destroy();
	}
}
