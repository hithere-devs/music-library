import db from '../models';
import { NotFoundError } from '../utils/errors';

export class AlbumService {
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
			throw new NotFoundError('Album not found');
		}

		return {
			album_id: album.id,
			artist_name: album.artist?.name,
			name: album.name,
			year: album.year,
			hidden: album.hidden,
		};
	}

	async createAlbum(data: {
		artist_id: string;
		name: string;
		year: number;
		hidden: boolean;
	}) {
		// Verify artist exists
		const artist = await db.Artist.findByPk(data.artist_id);
		if (!artist) {
			throw new NotFoundError('Artist not found');
		}

		const album = await db.Album.create(data);
		return album;
	}

	async updateAlbum(
		id: string,
		data: Partial<{ name: string; year: number; hidden: boolean }>
	) {
		const album = await db.Album.findByPk(id);
		if (!album) {
			throw new NotFoundError('Album not found');
		}

		await album.update(data);
	}

	async deleteAlbum(id: string) {
		const album = await db.Album.findByPk(id);
		if (!album) {
			throw new NotFoundError('Album not found');
		}

		await album.destroy();
	}
}
