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

export type SongLanguage = 'KO' | 'EN' | 'JA' | 'OTHER';
export type SongDifficulty = 'EASY' | 'NORMAL' | 'HARD';

export type SongSummary = {
  id: string;
  title: string;
  artist: string;
  youtubeVideoId: string;
  language: SongLanguage;
  difficulty: SongDifficulty;
  lyricLineCount: number;
  playCount: number;
  creator: { id: string; nickname: string };
  publishedAt: string;
};

export type SongList = {
  items: SongSummary[];
  nextCursor: string | null;
};

export type LyricLine = {
  id: string;
  lineOrder: number;
  text: string;
  startTimeMs: number | null;
};

export type SongDetail = {
  id: string;
  title: string;
  artist: string;
  youtubeVideoId: string;
  language: SongLanguage;
  difficulty: SongDifficulty;
  status: 'DRAFT' | 'PUBLISHED';
  durationMs: number | null;
  lyrics: LyricLine[];
};

export type DuplicateSong = Pick<SongSummary, 'id' | 'title' | 'artist' | 'youtubeVideoId'>;
export type DuplicateSongs = { hasDuplicates: boolean; items: DuplicateSong[] };
