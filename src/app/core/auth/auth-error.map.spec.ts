import { mapAuthError } from './auth-error.map';

describe('mapAuthError', () => {
  it('maps known server auth errors', () => {
    expect(mapAuthError('Username already exists')).toBe('Username already exists');
    expect(mapAuthError('Email already in use')).toBe('Email is already in use');
    expect(mapAuthError('Invalid username or password')).toBe('Incorrect username or password');
  });

  it('returns original error when it is unknown', () => {
    expect(mapAuthError('Something else')).toBe('Something else');
  });
});
