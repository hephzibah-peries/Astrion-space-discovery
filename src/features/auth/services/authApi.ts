import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  SimulatedRegisterResponse,
} from '../types/auth.types';

const DUMMYJSON_BASE_URL = 'https://dummyjson.com';

export const authApi = {
  /**
   * Performs authentication against DummyJSON login endpoint.
   * If an email address is provided, it resolves the corresponding username first.
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const rawIdentifier = credentials.identifier.trim();
    let loginUsername = rawIdentifier;

    // If an email format was entered, look up the corresponding DummyJSON username
    if (rawIdentifier.includes('@')) {
      try {
        const filterRes = await fetch(
          `${DUMMYJSON_BASE_URL}/users/filter?key=email&value=${encodeURIComponent(rawIdentifier)}`
        );
        if (filterRes.ok) {
          const filterData = await filterRes.json();
          if (filterData.users && filterData.users.length > 0) {
            loginUsername = filterData.users[0].username;
          }
        }
      } catch {
        // Fall back to direct username attempt
      }
    }

    const response = await fetch(`${DUMMYJSON_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: loginUsername,
        password: credentials.password,
        expiresInMins: 60,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data?.message ||
        (response.status === 400
          ? 'Invalid credentials. Please verify your username/email and password.'
          : 'Unable to connect to authentication server. Please check your network.');
      throw new Error(errorMessage);
    }

    return data as AuthResponse;
  },

  /**
   * Simulates user registration using DummyJSON's /users/add endpoint.
   * Note: This endpoint creates a mock user with a new ID (e.g. 209+),
   * but DummyJSON's mock database does not retain it for subsequent /auth/login calls.
   */
  async register(data: RegisterData): Promise<SimulatedRegisterResponse> {
    const nameParts = data.fullName.trim().split(' ');
    const firstName = nameParts[0] || 'Astrion';
    const lastName = nameParts.slice(1).join(' ') || 'Explorer';

    const response = await fetch(`${DUMMYJSON_BASE_URL}/users/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email: data.email.trim(),
        password: data.password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || 'Registration simulation failed. Please try again.');
    }

    return result as SimulatedRegisterResponse;
  },
};
