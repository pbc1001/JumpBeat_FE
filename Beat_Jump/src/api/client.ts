import type {
  AccessTokenResponse,
  ApiErrorResponse,
  ApiResponse,
  AuthResponse,
  User,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1';

let accessToken: string | null = null;
let refreshPromise: Promise<string> | null = null;

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;

  constructor(
    message: string,
    code: string,
    status: number,
    details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

const parseError = async (response: Response): Promise<ApiError> => {
  const body = (await response.json().catch(() => ({}))) as ApiErrorResponse;
  return new ApiError(
    body.error?.message ?? '요청을 처리하지 못했습니다.',
    body.error?.code ?? 'UNKNOWN_ERROR',
    response.status,
    body.error?.details,
  );
};

export const refreshAccessToken = async (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(async (response) => {
        if (!response.ok) {
          setAccessToken(null);
          throw await parseError(response);
        }
        const body = (await response.json()) as ApiResponse<AccessTokenResponse>;
        setAccessToken(body.data.accessToken);
        return body.data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

export const apiRequest = async <T>(
  path: string,
  init: RequestInit = {},
  retryOnUnauthorized = true,
): Promise<T> => {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  });

  if (response.status === 401 && retryOnUnauthorized && !path.startsWith('/auth/')) {
    await refreshAccessToken();
    return apiRequest<T>(path, init, false);
  }
  if (!response.ok) {
    throw await parseError(response);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  const body = (await response.json()) as ApiResponse<T>;
  return body.data;
};

export const authApi = {
  signup: async (request: { email: string; nickname: string; password: string }) => {
    const auth = await apiRequest<AuthResponse>(
      '/auth/signup',
      { method: 'POST', body: JSON.stringify(request) },
      false,
    );
    setAccessToken(auth.accessToken);
    return auth.user;
  },

  login: async (request: { email: string; password: string }) => {
    const auth = await apiRequest<AuthResponse>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify(request) },
      false,
    );
    setAccessToken(auth.accessToken);
    return auth.user;
  },

  logout: async () => {
    try {
      await apiRequest<void>('/auth/logout', { method: 'POST' }, false);
    } finally {
      setAccessToken(null);
    }
  },

  getMe: () => apiRequest<User>('/users/me'),
};
