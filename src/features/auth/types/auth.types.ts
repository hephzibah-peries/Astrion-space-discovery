export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
}

export interface AuthResponse extends User {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  identifier: string; // username or email
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SimulatedRegisterResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; data?: SimulatedRegisterResponse; error?: string }>;
  logout: () => Promise<void>;
}
