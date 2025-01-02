import { describe, it, expect, beforeAll } from 'vitest';
import { request } from '../setup';
import {
	loginAsAdmin,
	loginAsEditor,
	loginAsViewer,
} from '../helpers/auth.helpers';
import { createTestArtist } from '../helpers/artist.helpers';

describe('Album Management', () => {
	let adminToken: string;
	let editorToken: string;
	let viewerToken: string;
	let testArtistId: string;

	beforeAll(async () => {
		adminToken = await loginAsAdmin();
		editorToken = await loginAsEditor();
		viewerToken = await loginAsViewer();
		testArtistId = await createTestArtist(adminToken);
	});

	describe('GET /albums', () => {
		it('should allow any authenticated user to fetch albums', async () => {
			const res = await request
				.get('/api/v1/albums')
				.set('Authorization', `Bearer ${viewerToken}`);

			expect(res.status).toBe(200);
			expect(Array.isArray(res.body.data)).toBe(true);
		});

		it('should support pagination', async () => {
			const res = await request
				.get('/api/v1/albums?limit=2&offset=0')
				.set('Authorization', `Bearer ${viewerToken}`);

			expect(res.body.data.length).toBeLessThanOrEqual(2);
		});

		it('should filter by artist_id', async () => {
			const res = await request
				.get(`/api/v1/albums?artist_id=${testArtistId}`)
				.set('Authorization', `Bearer ${viewerToken}`);

			expect(res.status).toBe(200);
			res.body.data.forEach((album: any) => {
				expect(album.artist_id).toBe(testArtistId);
			});
		});

		it('should return 401 for unauthenticated request', async () => {
			const res = await request.get('/api/v1/albums');
			expect(res.status).toBe(401);
		});
	});

	describe('GET /albums/:id', () => {
		let testAlbumId: string;

		beforeAll(async () => {
			// Create a test album
			const albumRes = await request
				.post('/api/v1/albums/add-album')
				.set('Authorization', `Bearer ${adminToken}`)
				.send({
					artist_id: testArtistId,
					name: 'Test Album',
					year: 2024,
					hidden: false,
				});
			testAlbumId = albumRes.body.data.id;
		});

		it('should fetch album by id', async () => {
			const res = await request
				.get(`/api/v1/albums/${testAlbumId}`)
				.set('Authorization', `Bearer ${viewerToken}`);

			expect(res.status).toBe(200);
			expect(res.body.data.album_id).toBe(testAlbumId);
		});

		it('should return 404 for non-existent album', async () => {
			const res = await request
				.get('/api/v1/albums/123e4567-e89b-12d3-a456-426614174000')
				.set('Authorization', `Bearer ${viewerToken}`);

			expect(res.status).toBe(404);
		});
	});

	describe('POST /albums/add-album', () => {
		const newAlbum = {
			artist_id: null, // Will be set in beforeAll
			name: 'New Test Album',
			year: 2024,
			hidden: false,
		};

		beforeAll(() => {
			// @ts-ignore
			newAlbum.artist_id = testArtistId;
		});

		it('should allow admin to create album', async () => {
			const res = await request
				.post('/api/v1/albums/add-album')
				.set('Authorization', `Bearer ${adminToken}`)
				.send(newAlbum);

			expect(res.status).toBe(201);
			expect(res.body.message).toBe('Album created successfully');
		});

		it('should allow editor to create album', async () => {
			const res = await request
				.post('/api/v1/albums/add-album')
				.set('Authorization', `Bearer ${editorToken}`)
				.send(newAlbum);

			expect(res.status).toBe(201);
		});

		it('should not allow viewer to create album', async () => {
			const res = await request
				.post('/api/v1/albums/add-album')
				.set('Authorization', `Bearer ${viewerToken}`)
				.send(newAlbum);

			expect(res.status).toBe(403);
		});

		it('should validate required fields', async () => {
			const res = await request
				.post('/api/v1/albums/add-album')
				.set('Authorization', `Bearer ${adminToken}`)
				.send({
					name: 'Test Album',
					// Missing artist_id and year
				});

			expect(res.status).toBe(400);
		});

		it('should validate artist exists', async () => {
			const res = await request
				.post('/api/v1/albums/add-album')
				.set('Authorization', `Bearer ${adminToken}`)
				.send({
					...newAlbum,
					artist_id: '123e4567-e89b-12d3-a456-426614174000', // Non-existent artist
				});

			expect(res.status).toBe(404);
		});
	});

	describe('PUT /albums/:id', () => {
		let testAlbumId: string;

		beforeAll(async () => {
			// Create a test album
			const albumRes = await request
				.post('/api/v1/albums/add-album')
				.set('Authorization', `Bearer ${adminToken}`)
				.send({
					artist_id: testArtistId,
					name: 'Update Test Album',
					year: 2024,
					hidden: false,
				});
			testAlbumId = albumRes.body.data.id;
		});

		it('should allow admin to update album', async () => {
			const res = await request
				.put(`/api/v1/albums/${testAlbumId}`)
				.set('Authorization', `Bearer ${adminToken}`)
				.send({
					name: 'Updated Album Name',
				});

			expect(res.status).toBe(204);
		});

		it('should allow partial updates', async () => {
			const res = await request
				.put(`/api/v1/albums/${testAlbumId}`)
				.set('Authorization', `Bearer ${adminToken}`)
				.send({
					hidden: true,
				});

			expect(res.status).toBe(204);
		});

		it('should not allow viewer to update album', async () => {
			const res = await request
				.put(`/api/v1/albums/${testAlbumId}`)
				.set('Authorization', `Bearer ${viewerToken}`)
				.send({
					name: 'Try Update',
				});

			expect(res.status).toBe(403);
		});

		it('should validate year range', async () => {
			const res = await request
				.put(`/api/v1/albums/${testAlbumId}`)
				.set('Authorization', `Bearer ${adminToken}`)
				.send({
					year: 1800, // Too early
				});

			expect(res.status).toBe(400);
		});
	});

	describe('DELETE /albums/:id', () => {
		let testAlbumId: string;

		beforeAll(async () => {
			// Create a test album for deletion
			const albumRes = await request
				.post('/api/v1/albums/add-album')
				.set('Authorization', `Bearer ${adminToken}`)
				.send({
					artist_id: testArtistId,
					name: 'Delete Test Album',
					year: 2024,
					hidden: false,
				});
			testAlbumId = albumRes.body.data.id;
		});

		it('should allow admin to delete album', async () => {
			const res = await request
				.delete(`/api/v1/albums/${testAlbumId}`)
				.set('Authorization', `Bearer ${adminToken}`);

			expect(res.status).toBe(200);
			expect(res.body.message).toBe('Album deleted successfully');
		});

		it('should return 404 for already deleted album', async () => {
			const res = await request
				.delete(`/api/v1/albums/${testAlbumId}`)
				.set('Authorization', `Bearer ${adminToken}`);

			expect(res.status).toBe(404);
		});

		it('should not allow viewer to delete album', async () => {
			const newAlbumRes = await request
				.post('/api/v1/albums/add-album')
				.set('Authorization', `Bearer ${adminToken}`)
				.send({
					artist_id: testArtistId,
					name: 'Another Test Album',
					year: 2024,
					hidden: false,
				});

			const res = await request
				.delete(`/api/v1/albums/${newAlbumRes.body.data.id}`)
				.set('Authorization', `Bearer ${viewerToken}`);

			expect(res.status).toBe(403);
		});
	});
});
