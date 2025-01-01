import db from '../models';
import { NotFoundError } from '../utils/errors';

export class ArtistService {
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

	async getArtistById(id: string) {
		const artist = await db.Artist.findByPk(id);
		if (!artist) {
			throw new NotFoundError('Artist not found');
		}
		return artist;
	}

	async createArtist(data: { name: string; grammy: number; hidden: boolean }) {
		const artist = await db.Artist.create(data);
		return artist;
	}

	async updateArtist(
		id: string,
		data: Partial<{ name: string; grammy: number; hidden: boolean }>
	) {
		const artist = await this.getArtistById(id);
		await artist.update(data);
		return artist;
	}

	async deleteArtist(id: string) {
		const artist = await this.getArtistById(id);
		await artist.destroy();
		return artist;
	}
}
