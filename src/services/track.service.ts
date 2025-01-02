import db from '../models';
import { NotFoundError } from '../utils/errors';

export class TrackService {
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
			throw new NotFoundError('Track not found');
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
			throw new NotFoundError('Artist not found');
		}

		// Verify album exists
		const album = await db.Album.findByPk(data.album_id);
		if (!album) {
			throw new NotFoundError('Album not found');
		}

		const track = await db.Track.create(data);
		return track;
	}

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
			throw new NotFoundError('Track not found');
		}

		await track.update(data);
	}

	async deleteTrack(id: string) {
		const track = await db.Track.findByPk(id);
		if (!track) {
			throw new NotFoundError('Track not found');
		}

		const trackName = track.name;
		await track.destroy();
		return trackName;
	}
}
