/**
 * Token management utility
 * Handles storage, retrieval, and validation of JWT tokens
 */

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

/**
 * Store tokens in localStorage
 */
export const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

/**
 * Get access token from localStorage
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Get refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Remove tokens from localStorage
 */
export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Check if user is authenticated (has valid token)
 */
export const isAuthenticated = (): boolean => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  // If no tokens at all, not authenticated
  if (!accessToken && !refreshToken) {
    return false;
  }

  // If we have a refresh token, we can refresh the access token
  if (refreshToken && !isTokenExpired(refreshToken)) {
    return true;
  }

  // Check if access token is valid
  return !!accessToken && !isTokenExpired(accessToken);
};

/**
 * Get authorization header value
 */
export const getAuthorizationHeader = (): string | null => {
  const token = getAccessToken();
  if (!token) {
    return null;
  }
  return `Bearer ${token}`;
};

/**
 * Decode JWT token (without verification)
 * Note: This only decodes the payload, does not verify the signature
 */
export const decodeToken = (token: string): Record<string, unknown> | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);

  if (!decoded || !("exp" in decoded) || typeof decoded.exp !== "number") {
    return true;
  }

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

/**
 * Check if access token is expired
 */
export const isAccessTokenExpired = (): boolean => {
  const token = getAccessToken();

  if (!token) {
    return true;
  }

  return isTokenExpired(token);
};

/**
 * Check if refresh token is expired
 */
export const isRefreshTokenExpired = (): boolean => {
  const token = getRefreshToken();

  if (!token) {
    return true;
  }

  return isTokenExpired(token);
};
