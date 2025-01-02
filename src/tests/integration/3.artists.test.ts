// src/tests/integration/artists.test.ts
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { request } from '../setup';
import {
	loginAsAdmin,
	loginAsEditor,
	loginAsViewer,
} from '../helpers/auth.helpers';

describe('Artist Management', () => {
	let adminToken: string;
	let editorToken: string;
	let viewerToken: string;

	beforeAll(async () => {
		adminToken = await loginAsAdmin();
		editorToken = await loginAsEditor();
		viewerToken = await loginAsViewer();
	});

	describe('GET /artists', () => {
		it('should allow any authenticated user to fetch artists', async () => {
			const res = await request
				.get('/api/v1/artists')
				.set('Authorization', `Bearer ${viewerToken}`);

			expect(res.status).toBe(200);
			expect(Array.isArray(res.body.data)).toBe(true);
		});

		it('should support pagination', async () => {
			const res = await request
				.get('/api/v1/artists?limit=2&offset=0')
				.set('Authorization', `Bearer ${viewerToken}`);

			expect(res.body.data.length).toBeLessThanOrEqual(2);
		});

		it('should filter by grammy status', async () => {
			const res = await request
				.get('/api/v1/artists?grammy=true')
				.set('Authorization', `Bearer ${viewerToken}`);

			expect(res.status).toBe(200);
			res.body.data.forEach((artist: any) => {
				expect(artist.grammy).toBe(true);
			});
		});

		it('should return 401 for unauthenticated request', async () => {
			const res = await request.get('/api/v1/artists');
			expect(res.status).toBe(401);
		});
	});

	describe('GET /artists/:id', () => {
		let testArtistId: string;

		beforeAll(async () => {
			// Create a test artist
			await request
				.post('/api/v1/artists/add-artist')
				.set('Authorization', `Bearer ${adminToken}`)
				.send({
					name: 'Test Artist',
					grammy: 0,
					hidden: false,
				});

			const fetchArtists = await request
				.get('/api/v1/artists')
				.set('Authorization', `Bearer ${viewerToken}`);

			console.log('=============================');
			console.log(fetchArtists.body);
			console.log('=============================');

			testArtistId = fetchArtists.body.data[0].artist_id;
		});

		it('should fetch artist by id', async () => {
			const res = await request
				.get(`/api/v1/artists/${testArtistId}`)
				.set('Authorization', `Bearer ${viewerToken}`);

			expect(res.status).toBe(200);
			expect(res.body.data.artist_id).toBe(testArtistId);
		});

		it('should return 404 for non-existent artist', async () => {
			const res = await request
				.get('/api/v1/artists/123e4567-e89b-12d3-a456-426614174000')
				.set('Authorization', `Bearer ${viewerToken}`);

			expect(res.status).toBe(404);
		});
	});

	describe('POST /artists/add-artist', () => {
		const newArtist = {
			name: 'New Test Artist',
			grammy: 5,
			hidden: false,
		};

		it('should allow admin to create artist', async () => {
			const res = await request
				.post('/api/v1/artists/add-artist')
				.set('Authorization', `Bearer ${adminToken}`)
				.send(newArtist);

			expect(res.status).toBe(201);
			expect(res.body.message).toBe('Artist created successfully');
		});

		it('should allow editor to create artist', async () => {
			const res = await request
				.post('/api/v1/artists/add-artist')
				.set('Authorization', `Bearer ${editorToken}`)
				.send(newArtist);

			expect(res.status).toBe(201);
		});

		it('should not allow viewer to create artist', async () => {
			const res = await request
				.post('/api/v1/artists/add-artist')
				.set('Authorization', `Bearer ${viewerToken}`)
				.send(newArtist);

			expect(res.status).toBe(403);
		});

		it('should validate required fields', async () => {
			const res = await request
				.post('/api/v1/artists/add-artist')
				.set('Authorization', `Bearer ${adminToken}`)
				.send({
					grammy: 1,
					// Missing name
				});

			expect(res.status).toBe(400);
		});
	});

	describe('PUT /artists/:id', () => {
		let testArtistId: string;

		beforeAll(async () => {
			const artistRes = await request
				.post('/api/v1/artists/add-artist')
				.set('Authorization', `Bearer ${adminToken}`)
				.send({
					name: 'Update Test Artist',
					grammy: 0,
					hidden: false,
				});
			const fetchArtists = await request
				.get('/api/v1/artists')
				.set('Authorization', `Bearer ${viewerToken}`);

			console.log('=============================');
			console.log(fetchArtists.body);
			console.log('=============================');

			testArtistId = fetchArtists.body.data[0].artist_id;
		});

		it('should allow admin to update artist', async () => {
			const res = await request
				.put(`/api/v1/artists/${testArtistId}`)
				.set('Authorization', `Bearer ${adminToken}`)
				.send({
					name: 'Updated Artist Name',
				});

			expect(res.status).toBe(204);
		});

		it('should allow partial updates', async () => {
			const res = await request
				.put(`/api/v1/artists/${testArtistId}`)
				.set('Authorization', `Bearer ${adminToken}`)
				.send({
					grammy: 10,
				});

			expect(res.status).toBe(204);
		});

		it('should not allow viewer to update artist', async () => {
			const res = await request
				.put(`/api/v1/artists/${testArtistId}`)
				.set('Authorization', `Bearer ${viewerToken}`)
				.send({
					name: 'Try Update',
				});

			expect(res.status).toBe(403);
		});

		it('should validate grammy value', async () => {
			const res = await request
				.put(`/api/v1/artists/${testArtistId}`)
				.set('Authorization', `Bearer ${adminToken}`)
				.send({
					grammy: -1, // Invalid value
				});

			expect(res.status).toBe(400);
		});
	});

	describe('DELETE /artists/:id', () => {
		let testArtistId: string;

		beforeEach(async () => {
			// Create a fresh test artist for each test
			const artistRes = await request
				.post('/api/v1/artists/add-artist')
				.set('Authorization', `Bearer ${adminToken}`)
				.send({
					name: 'Delete Test Artist',
					grammy: 0,
					hidden: false,
				});

			testArtistId = artistRes.body.data.id;
		});

		it('should allow admin to delete artist', async () => {
			const res = await request
				.delete(`/api/v1/artists/${testArtistId}`)
				.set('Authorization', `Bearer ${adminToken}`);

			expect(res.status).toBe(200);
			expect(res.body.message).toBe('Artist deleted successfully');
		});

		it('should return 404 for already deleted artist', async () => {
			await request
				.delete(`/api/v1/artists/${testArtistId}`)
				.set('Authorization', `Bearer ${adminToken}`);

			const res = await request
				.delete(`/api/v1/artists/${testArtistId}`)
				.set('Authorization', `Bearer ${adminToken}`);

			expect(res.status).toBe(404);
		});

		it('should not allow viewer to delete artist', async () => {
			const res = await request
				.delete(`/api/v1/artists/${testArtistId}`)
				.set('Authorization', `Bearer ${viewerToken}`);

			expect(res.status).toBe(403);
		});

		it('should cascade delete related albums', async () => {
			// Add an album to the artist
			await request
				.post('/api/v1/albums/add-album')
				.set('Authorization', `Bearer ${adminToken}`)
				.send({
					artist_id: testArtistId,
					name: 'Test Album',
					year: 2024,
					hidden: false,
				});

			// Delete the artist
			await request
				.delete(`/api/v1/artists/${testArtistId}`)
				.set('Authorization', `Bearer ${adminToken}`);

			// Try to fetch the album
			const albumRes = await request
				.get('/api/v1/albums')
				.set('Authorization', `Bearer ${adminToken}`);

			expect(
				albumRes.body.data.find(
					(album: any) => album.artist_id === testArtistId
				)
			).toBeUndefined();
		});
	});
});
