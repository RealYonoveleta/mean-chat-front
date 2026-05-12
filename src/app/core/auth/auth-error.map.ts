export const AUTH_ERROR_MAP: Record<string, string> = {
  'Username already exists': 'Username already exists',
  'Email already in use': 'Email is already in use',
  'Invalid username or password': 'Incorrect username or password',
};

export function mapAuthError(serverError: string): string {
  return AUTH_ERROR_MAP[serverError] ?? serverError ?? 'An unexpected error has occurred';
}
