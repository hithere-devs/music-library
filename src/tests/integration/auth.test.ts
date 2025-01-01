import { describe, it, expect } from 'vitest';
import { request } from '../setup';

describe('Authentication', () => {
	describe('POST /signup', () => {
		it('should prevent duplicate email', async () => {
			const res = await request.post('/api/v1/signup').send({
				email: 'admin@example.com',
				password: 'password123',
			});

			expect(res.status).toBe(409);
			expect(res.body.message).toBe('Email already exists.');
		});
	});

	describe('POST /login', () => {
		it('should login user with valid credentials', async () => {
			const res = await request.post('/api/v1/login').send({
				email: 'admin@example.com',
				password: 'password',
			});

			expect(res.status).toBe(200);
			expect(res.body.data).toHaveProperty('token');
		});

		it('should reject invalid credentials', async () => {
			const res = await request.post('/api/v1/login').send({
				email: 'admin@example.com',
				password: 'wrongpass',
			});

			expect(res.status).toBe(400);
		});
	});
});
