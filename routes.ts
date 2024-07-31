/**
 * @description: Public routes that are accessible to the public,
 * These route do not require authentication.
 * @type {string[]}
 */

export const publicRoutes = ["/", "/auth/verify-email"];

/**
 * @description: Auth routes that are used for authentication,
 * These route will redirect logged in users to the main route
 * @type {string[]}
 */

export const authRoutes = ["/auth/register", "/auth/login", "/auth/error"];

/**
 * @description: The prefix for API authentication routes,
 * These route will start with prefix /api/auth are used for API authentication purposes
 * @type {string}
 */

export const apiAuthPrefix = "/api/auth";

/**
 * @description: The default redirect path after logged in,
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = "/settings";
