/**
 * HTTP Client utility using native fetch API
 * Functional approach for making HTTP requests
 */

import { API_ENDPOINTS, HTTP_STATUS } from "@/constants";
import type { HttpClientConfig, RequestConfig } from "@/types/httpClient";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  isAccessTokenExpired,
  setTokens,
} from "./token";

export class HttpError extends Error {
  public status: number;
  public statusText: string;
  public data: unknown;

  constructor(
    status: number,
    statusText: string,
    data: unknown,
    message?: string,
  ) {
    super(message || statusText);
    this.name = "HttpError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

// Default configuration
const defaultConfig: HttpClientConfig = {
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
};

let globalConfig = { ...defaultConfig };
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

/**
 * Add subscriber to refresh queue
 */
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

/**
 * Notify all subscribers when token is refreshed
 */
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

/**
 * Refresh access token using refresh token
 */
const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(
      `${globalConfig.baseURL}${API_ENDPOINTS.AUTH.REFRESH}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      },
    );

    if (!response.ok) {
      clearTokens();
      return null;
    }

    const data = await response.json();
    const { token: accessToken, refreshToken: newRefreshToken } = data;

    setTokens(accessToken, newRefreshToken);
    return accessToken;
  } catch {
    clearTokens();
    return null;
  }
};

/**
 * Build full URL with query parameters
 */
const buildURL = (
  url: string,
  params?: Record<string, string | number | boolean>,
): string => {
  const fullURL = globalConfig.baseURL ? `${globalConfig.baseURL}${url}` : url;

  if (!params) return fullURL;

  const urlObj = new URL(fullURL, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    urlObj.searchParams.append(key, String(value));
  });

  return urlObj.toString();
};

/**
 * Make HTTP request with automatic token refresh
 */
const request = async <T>(
  url: string,
  config: RequestConfig = {},
): Promise<T> => {
  const { params, timeout = globalConfig.timeout, ...fetchConfig } = config;

  // Add access token to headers if available
  const accessToken = getAccessToken();
  const headers = {
    ...globalConfig.headers,
    ...(fetchConfig.headers as Record<string, string> | undefined),
  } as Record<string, string>;

  if (accessToken && !url.includes(API_ENDPOINTS.AUTH.LOGIN)) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const makeRequest = async (token?: string): Promise<Response> => {
    const requestHeaders = { ...headers };
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }

    return fetch(buildURL(url, params), {
      ...fetchConfig,
      headers: requestHeaders,
      signal: controller.signal,
    });
  };

  try {
    // Check if token needs refresh before making request
    if (
      accessToken &&
      isAccessTokenExpired() &&
      !url.includes(API_ENDPOINTS.AUTH.REFRESH) &&
      !url.includes(API_ENDPOINTS.AUTH.LOGIN)
    ) {
      if (!isRefreshing) {
        isRefreshing = true;
        const newToken = await refreshAccessToken();
        isRefreshing = false;

        if (newToken) {
          onTokenRefreshed(newToken);
          const response = await makeRequest(newToken);
          clearTimeout(timeoutId);
          return processResponse<T>(response);
        } else {
          // Refresh failed, redirect to login
          clearTokens();
          window.location.href = "/login";
          throw new Error("Session expired. Please login again.");
        }
      } else {
        // Wait for token refresh to complete
        const token = await new Promise<string>((resolve) => {
          subscribeTokenRefresh(resolve);
        });
        const response = await makeRequest(token);
        clearTimeout(timeoutId);
        return processResponse<T>(response);
      }
    }

    const response = await makeRequest();
    clearTimeout(timeoutId);

    // If 401 and we have a refresh token, try refreshing
    if (
      response.status === HTTP_STATUS.UNAUTHORIZED &&
      !url.includes(API_ENDPOINTS.AUTH.REFRESH) &&
      !url.includes(API_ENDPOINTS.AUTH.LOGIN)
    ) {
      if (!isRefreshing) {
        isRefreshing = true;
        const newToken = await refreshAccessToken();
        isRefreshing = false;

        if (newToken) {
          onTokenRefreshed(newToken);
          const retryResponse = await makeRequest(newToken);
          return processResponse<T>(retryResponse);
        } else {
          clearTokens();
          window.location.href = "/login";
          throw new Error("Session expired. Please login again.");
        }
      }
    }

    return processResponse<T>(response);
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof HttpError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timeout");
      }
      throw error;
    }

    throw new Error("Unknown error occurred");
  }
};

/**
 * Process response and handle errors
 */
const processResponse = async <T>(response: Response): Promise<T> => {
  // Parse response
  const contentType = response.headers.get("content-type");
  let data: unknown;

  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  // Handle error responses
  if (!response.ok) {
    let errorMessage = `HTTP Error: ${response.status}`;

    if (typeof data === "object" && data !== null) {
      if (
        "error" in data &&
        typeof (data as Record<string, unknown>).error === "string"
      ) {
        errorMessage = (data as Record<string, unknown>).error as string;
      } else if (
        "message" in data &&
        typeof (data as Record<string, unknown>).message === "string"
      ) {
        errorMessage = (data as Record<string, unknown>).message as string;
      }
    }

    throw new HttpError(
      response.status,
      response.statusText,
      data,
      errorMessage,
    );
  }

  return data as T;
};

/**
 * HTTP GET request
 */
export const httpGet = <T>(url: string, config?: RequestConfig): Promise<T> => {
  return request<T>(url, { ...config, method: "GET" });
};

/**
 * HTTP POST request
 */
export const httpPost = <T>(
  url: string,
  data?: unknown,
  config?: RequestConfig,
): Promise<T> => {
  return request<T>(url, {
    ...config,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * HTTP PUT request
 */
export const httpPut = <T>(
  url: string,
  data?: unknown,
  config?: RequestConfig,
): Promise<T> => {
  return request<T>(url, {
    ...config,
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * HTTP PATCH request
 */
export const httpPatch = <T>(
  url: string,
  data?: unknown,
  config?: RequestConfig,
): Promise<T> => {
  return request<T>(url, {
    ...config,
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * HTTP DELETE request
 */
export const httpDelete = <T>(
  url: string,
  config?: RequestConfig,
): Promise<T> => {
  return request<T>(url, { ...config, method: "DELETE" });
};

/**
 * Set global HTTP header
 */
export const setHttpHeader = (key: string, value: string): void => {
  globalConfig.headers = {
    ...globalConfig.headers,
    [key]: value,
  };
};

/**
 * Remove global HTTP header
 */
export const removeHttpHeader = (key: string): void => {
  const headers = { ...globalConfig.headers };
  delete headers[key];
  globalConfig.headers = headers;
};

/**
 * Set global base URL
 */
export const setBaseURL = (baseURL: string): void => {
  globalConfig.baseURL = baseURL;
};

/**
 * Reset configuration to defaults
 */
export const resetHttpConfig = (): void => {
  globalConfig = { ...defaultConfig };
};
