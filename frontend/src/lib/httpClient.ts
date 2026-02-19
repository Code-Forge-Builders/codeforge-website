const DEFAULT_API_BASE_URL = "http://localhost:8080/api";

function getBaseUrl(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  return DEFAULT_API_BASE_URL;
}

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly statusText: string,
    public readonly body?: unknown
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export interface RequestOptions {
  headers?: Record<string, string>;
  query?: Record<string, string>;
  body?: unknown;
}

function buildUrl(baseUrl: string, path: string, query?: Record<string, string>): string {
  const base = baseUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${base}${normalizedPath}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }
  return url.toString();
}

async function request<T = unknown>(
  method: string,
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const baseUrl = getBaseUrl();
  const { headers = {}, query, body } = options;
  const url = buildUrl(baseUrl, path.startsWith("/") ? path : `/${path}`, query);

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body !== undefined && body !== null && method !== "GET") {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, fetchOptions);
  const contentType = response.headers.get("content-type");
  const hasJson = contentType?.includes("application/json");
  let responseBody: unknown;
  if (hasJson) {
    try {
      responseBody = await response.json();
    } catch {
      responseBody = undefined;
    }
  }

  if (!response.ok) {
    const message =
      (responseBody as { message?: string })?.message ??
      (response.statusText || `Request failed with status ${response.status}`);
    throw new HttpError(message, response.status, response.statusText, responseBody);
  }

  if (response.status === 204 || response.status === 205) {
    return undefined as T;
  }

  return (responseBody ?? undefined) as T;
}

export const httpClient = {
  request<T = unknown>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
    return request<T>(method, path, options);
  },

  get<T = unknown>(path: string, options: Omit<RequestOptions, "body"> = {}): Promise<T> {
    return request<T>("GET", path, options);
  },

  post<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
    return request<T>("POST", path, options);
  },

  put<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
    return request<T>("PUT", path, options);
  },

  patch<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
    return request<T>("PATCH", path, options);
  },

  delete<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
    return request<T>("DELETE", path, options);
  },
};
