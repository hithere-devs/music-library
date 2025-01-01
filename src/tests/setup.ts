import supertest from 'supertest';
import { createServer } from '../server';

const app = createServer();
export const request = supertest(app);
