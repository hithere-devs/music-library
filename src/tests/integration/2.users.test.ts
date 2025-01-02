import { describe, it, expect, beforeAll } from 'vitest';
import { request } from '../setup';
import { loginAsAdmin } from '../helpers/auth.helpers';

describe('User Management', () => {
	let adminToken: string;

	beforeAll(async () => {
		adminToken = await loginAsAdmin();
	});

	describe('GET /users', () => {
		it('should allow admin to fetch users', async () => {
			const res = await request
				.get('/api/v1/users')
				.set('Authorization', `Bearer ${adminToken}`);

			expect(res.status).toBe(200);
			expect(Array.isArray(res.body.data)).toBe(true);
		});

		it('should support pagination', async () => {
			const res = await request
				.get('/api/v1/users?limit=2&offset=0')
				.set('Authorization', `Bearer ${adminToken}`);

			expect(res.body.data.length).toBeLessThanOrEqual(2);
		});
	});

	describe('POST /users/add-user', () => {
		it('should allow admin to create editor user', async () => {
			const res = await request
				.post('/api/v1/users/add-user')
				.set('Authorization', `Bearer ${adminToken}`)
				.send({
					email: 'editor1@example.com',
					password: 'password',
					role: 'editor',
				});

			const _res = await request
				.post('/api/v1/users/add-user')
				.set('Authorization', `Bearer ${adminToken}`)
				.send({
					email: 'viewer1@example.com',
					password: 'password',
					role: 'viewer',
				});

			expect(res.status).toBe(201);
		});
	});
});
