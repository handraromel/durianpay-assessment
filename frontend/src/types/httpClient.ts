export interface HttpClientConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
  timeout?: number;
}
