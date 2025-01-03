/**
 * Enum representing the different roles a user can have in the system.
 *
 * @enum {string}
 * @property {string} ADMIN - Represents an admin user with full access.
 * @property {string} EDITOR - Represents an editor user with permissions to modify content.
 * @property {string} VIEWER - Represents a viewer user with read-only access.
 */
export enum UserRole {
	ADMIN = 'admin',
	EDITOR = 'editor',
	VIEWER = 'viewer',
}

/**
 * Enum representing the types of favorites in the music library.
 *
 * @enum {string}
 * @property {string} ARTIST - Represents a favorite artist.
 * @property {string} ALBUM - Represents a favorite album.
 * @property {string} TRACK - Represents a favorite track.
 */
export enum FavoriteType {
	ARTIST = 'artist',
	ALBUM = 'album',
	TRACK = 'track',
}
