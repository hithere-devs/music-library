import { request } from '../setup';

export const loginAsAdmin = async () => {
	const res = await request.post('/api/v1/login').send({
		email: 'admin@example.com',
		password: 'password',
	});

	return res.body.data.token;
};

export const loginAsEditor = async () => {
	const res = await request.post('/api/v1/login').send({
		email: 'editor@example.com',
		password: 'password',
	});

	return res.body.data.token;
};
