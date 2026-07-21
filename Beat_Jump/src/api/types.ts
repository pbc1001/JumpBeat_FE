export type User = {
  id: string;
  email: string;
  nickname: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
};

export type AccessTokenResponse = {
  accessToken: string;
};

export type ApiResponse<T> = {
  data: T;
};

export type ApiErrorResponse = {
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
};
