import * as SecureStore from 'expo-secure-store';
import { User } from '../types/auth.types';

const TOKEN_KEY = 'astrion_auth_token';
const REFRESH_TOKEN_KEY = 'astrion_refresh_token';
const USER_KEY = 'astrion_auth_user';

export const tokenStorage = {
  /**
   * Securely saves JWT tokens and user session data in encrypted storage.
   * Passwords are never stored.
   */
  async saveAuthSession(token: string, refreshToken: string, user: User): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.warn('SecureStore: Failed to save authentication session', error);
    }
  },

  /**
   * Retrieves the stored JWT authentication token.
   */
  async getAuthToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.warn('SecureStore: Failed to retrieve auth token', error);
      return null;
    }
  },

  /**
   * Retrieves the stored user metadata.
   */
  async getStoredUser(): Promise<User | null> {
    try {
      const rawUser = await SecureStore.getItemAsync(USER_KEY);
      if (rawUser) {
        return JSON.parse(rawUser) as User;
      }
      return null;
    } catch (error) {
      console.warn('SecureStore: Failed to retrieve user session', error);
      return null;
    }
  },

  /**
   * Clears all stored tokens and session data on logout.
   */
  async clearAuthSession(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (error) {
      console.warn('SecureStore: Failed to clear auth session', error);
    }
  },
};
