export const AUTH_STORAGE_KEYS = {
  REFRESH_TOKEN: 'authRefreshToken',
  ACCESS_TOKEN: 'authAccessToken',
  ID_TOKEN: 'authIdToken',
  AUTH_STORAGE: 'authStorage',
} as const

export enum AUTH_ERROR_TYPE {
  INVALID_LOGIN_CREDENTIALS = 'INVALID_LOGIN_CREDENTIALS',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
}

export enum AUTH_PROVIDER {
  GOOGLE = 'google',
  GITHUB = 'github',
}
