/**
 * @description: Public routes that are accessible to the public,
 * These route do not require authentication.
 * @type {string[]}
 */

export const publicRoutes = ["/"];

/**
 * @description: Public routes that are used for authentication,
 * These route require authentication.
 * @type {string[]}
 */

export const authRoutes = ["/auth/register", "/auth/login"];
