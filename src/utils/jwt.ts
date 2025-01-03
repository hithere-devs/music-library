import jwt from 'jsonwebtoken';

// config
import config from '../config';

// utils
import { UnauthorizedError } from './errors';

/**
 * Generates a JSON Web Token (JWT) for the given payload.
 *
 * @param payload - The data to be encoded in the JWT.
 * @returns The generated JWT as a string.
 */
export const generateToken = (payload: any): string => {
	return jwt.sign(payload, config.jwt.secret, {
		expiresIn: config.jwt.expiresIn,
	});
};

/**
 * Verifies the provided JWT token.
 *
 * @param token - The JWT token to verify.
 * @returns The decoded token if verification is successful.
 * @throws {UnauthorizedError} If the token verification fails.
 */
export const verifyToken = (token: string): any => {
	try {
		return jwt.verify(token, config.jwt.secret);
	} catch (error) {
		throw new UnauthorizedError();
	}
};
