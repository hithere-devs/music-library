import { request } from '../setup';

export const createTestArtist = async (adminToken: string) => {
	const res = await request
		.post('/api/v1/artists/add-artist')
		.set('Authorization', `Bearer ${adminToken}`)
		.send({
			name: 'Test Artist',
			grammy: 0,
			hidden: false,
		});
	const fetchArtists = await request
		.get('/api/v1/artists')
		.set('Authorization', `Bearer ${adminToken}`);

	console.log('=============================');
	console.log(fetchArtists.body);
	console.log('=============================');

	return fetchArtists.body.data[0].artist_id;
};
