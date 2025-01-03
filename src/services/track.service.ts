// modes
import db from '../models';

// utils
import { NotFoundError } from '../utils/errors';

/**
 * Service for handling track-related operations.
 *
 * This service provides methods to handle operations for retrieving,
 * creating, updating, and deleting tracks. It interacts with the database
 * to perform the necessary operations and returns the results.
 *
 * @class TrackService
 */
export class TrackService {
	/**
	 * Retrieves a list of tracks based on the provided parameters.
	 *
	 * @param limit - The maximum number of tracks to retrieve (default is 5).
	 * @param offset - The number of tracks to skip before starting to collect the result set (default is 0).
	 * @param artist_id - The ID of the artist to filter tracks by.
	 * @param album_id - The ID of the album to filter tracks by.
	 * @param hidden - A boolean indicating whether to include hidden tracks.
	 * @returns A promise that resolves to an array of tracks.
	 */
	async getTracks(
		limit: number = 5,
		offset: number = 0,
		artist_id?: string,
		album_id?: string,
		hidden?: boolean
	) {
		const where: any = {};

		if (artist_id) where.artist_id = artist_id;
		if (album_id) where.album_id = album_id;
		if (hidden !== undefined) where.hidden = hidden;

		const tracks = await db.Track.findAll({
			where,
			limit,
			offset,
			include: [
				{
					model: db.Artist,
					attributes: ['name'],
				},
				{
					model: db.Album,
					attributes: ['name'],
				},
			],
			order: [['created_at', 'DESC']],
		});

		return tracks.map((track) => ({
			track_id: track.id,
			artist_name: track.artist?.name,
			album_name: track.album?.name,
			name: track.name,
			duration: track.duration,
			hidden: track.hidden,
		}));
	}

	/**
	 * Retrieves a track by its ID.
	 *
	 * @param id - The ID of the track to retrieve.
	 * @returns A promise that resolves to the track data.
	 *
	 * @throws Will throw an error if the track is not found.
	 */
	async getTrackById(id: string) {
		const track = await db.Track.findByPk(id, {
			include: [
				{
					model: db.Artist,
					attributes: ['name'],
				},
				{
					model: db.Album,
					attributes: ['name'],
				},
			],
		});

		if (!track) {
			throw new NotFoundError('Track not found.');
		}

		return {
			track_id: track.id,
			artist_name: track.artist?.name,
			album_name: track.album?.name,
			name: track.name,
			duration: track.duration,
			hidden: track.hidden,
		};
	}

	/**
	 * Creates a new track.
	 *
	 * @param data - The data for the new track.
	 * @returns A promise that resolves to the created track.
	 *
	 * @throws Will throw an error if the artist or album is not found.
	 */
	async createTrack(data: {
		artist_id: string;
		album_id: string;
		name: string;
		duration: number;
		hidden: boolean;
	}) {
		// Verify artist exists
		const artist = await db.Artist.findByPk(data.artist_id);
		if (!artist) {
			throw new NotFoundError('Artist not found.');
		}

		// Verify album exists
		const album = await db.Album.findByPk(data.album_id);
		if (!album) {
			throw new NotFoundError('Album not found.');
		}

		const track = await db.Track.create(data);
		return track;
	}

	/**
	 * Updates a track with the provided data.
	 *
	 * @param id - The ID of the track to update.
	 * @param data - The data to update the track with.
	 * @returns A promise that resolves to void.
	 *
	 * @throws Will throw an error if the track is not found.
	 */
	async updateTrack(
		id: string,
		data: Partial<{
			name: string;
			duration: number;
			hidden: boolean;
		}>
	) {
		const track = await db.Track.findByPk(id);
		if (!track) {
			throw new NotFoundError('Track not found.');
		}

		await track.update(data);
	}

	/**
	 * Deletes a track by its ID.
	 *
	 * @param id - The ID of the track to delete.
	 * @returns A promise that resolves to the name of the deleted track.
	 * @throws {NotFoundError} If the track is not found.
	 */
	async deleteTrack(id: string) {
		const track = await db.Track.findByPk(id);
		if (!track) {
			throw new NotFoundError('Track not found.');
		}

		const trackName = track.name;
		await track.destroy();
		return trackName;
	}
}
