import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AuthContextType,
  AuthState,
  LoginCredentials,
  RegisterData,
  SimulatedRegisterResponse,
  User,
} from '../types/auth.types';
import { authApi } from '../services/authApi';
import { tokenStorage } from '../services/tokenStorage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Restore authenticated session from SecureStore on startup
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = await tokenStorage.getAuthToken();
        const storedUser = await tokenStorage.getStoredUser();

        if (storedToken && storedUser) {
          setState({
            user: storedUser,
            token: storedToken,
            isLoading: false,
            isAuthenticated: true,
          });
          return;
        }
      } catch (error) {
        console.warn('Session restoration failed:', error);
      }

      setState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    };

    restoreSession();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.login(credentials);
      const user: User = {
        id: response.id,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        gender: response.gender,
        image: response.image,
      };

      // Persist to SecureStore (never storing plain passwords)
      await tokenStorage.saveAuthSession(response.accessToken, response.refreshToken, user);

      setState({
        user,
        token: response.accessToken,
        isLoading: false,
        isAuthenticated: true,
      });

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Login failed. Please try again.',
      };
    }
  };

  const register = async (
    data: RegisterData
  ): Promise<{ success: boolean; data?: SimulatedRegisterResponse; error?: string }> => {
    try {
      const result = await authApi.register(data);
      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Registration simulation failed. Please try again.',
      };
    }
  };

  const logout = async (): Promise<void> => {
    await tokenStorage.clearAuthSession();
    setState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
