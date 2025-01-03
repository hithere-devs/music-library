// models
import db from '../models';

// utils
import { NotFoundError } from '../utils/errors';

export class ArtistService {
	/**
	 * Retrieves a list of artists based on the provided parameters.
	 *
	 * @param limit - The maximum number of artists to retrieve (default is 5).
	 * @param offset - The number of artists to skip before starting to collect the result set (default is 0).
	 * @param grammy - The Grammy status to filter artists by.
	 * @param hidden - A boolean indicating whether to include hidden artists.
	 * @returns A promise that resolves to an array of artists.
	 */
	async getArtists(
		limit: number = 5,
		offset: number = 0,
		grammy?: number,
		hidden?: boolean
	) {
		const where: any = {};

		if (grammy !== undefined) {
			where.grammy = grammy;
		}
		if (hidden !== undefined) {
			where.hidden = hidden;
		}

		const artists = await db.Artist.findAll({
			where,
			limit,
			offset,
			attributes: ['artist_id', 'name', 'grammy', 'hidden'],
			order: [['created_at', 'DESC']],
		});

		return artists;
	}

	/**
	 * Retrieves an artist by their ID.
	 *
	 * @param id - The ID of the artist to retrieve.
	 * @returns A promise that resolves to the artist data.
	 *
	 * @throws Will throw an error if the artist is not found.
	 */
	async getArtistById(id: string) {
		const artist = await db.Artist.findByPk(id);
		if (!artist) {
			throw new NotFoundError('Artist not found.');
		}
		return artist;
	}

	/**
	 * Creates a new artist.
	 *
	 * @param data - The data for the new artist.
	 * @returns A promise that resolves to the created artist.
	 */
	async createArtist(data: { name: string; grammy: number; hidden: boolean }) {
		const artist = await db.Artist.create(data);
		return artist;
	}

	/**
	 * Updates an artist with the provided data.
	 *
	 * @param id - The ID of the artist to update.
	 * @param data - The data to update the artist with.
	 * @returns A promise that resolves to void.
	 *
	 * @throws Will throw an error if the artist is not found.
	 */
	async updateArtist(
		id: string,
		data: Partial<{ name: string; grammy: number; hidden: boolean }>
	) {
		const artist = await this.getArtistById(id);
		await artist.update(data);
		return artist;
	}

	/**
	 * Deletes an artist by their ID.
	 *
	 * @param id - The ID of the artist to delete.
	 * @returns A promise that resolves to void.
	 *
	 * @throws Will throw an error if the artist is not found.
	 */
	async deleteArtist(id: string) {
		const artist = await this.getArtistById(id);
		await artist.destroy();
		return artist;
	}
}
