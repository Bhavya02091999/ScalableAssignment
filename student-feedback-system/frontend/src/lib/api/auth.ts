import { fetchWithAuth } from './utils';

const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:3001';

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    const error = data.error || data.message || 'An error occurred';
    throw new Error(error);
  }
  
  return data as T;
}

type SignUpData = {
  email: string;
  password: string;
  name: string;
  role?: 'student' | 'instructor';
};

type SignInData = {
  email: string;
  password: string;
};

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'instructor' | 'admin';
  email_verified?: boolean;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  user: UserProfile;
  token?: string;
}

type SessionResponse = {
  user: UserProfile;
  session: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
};

export const authService = {
  async signUp({ email, password, name, role = 'student' }: SignUpData): Promise<AuthResponse> {
    const response = await fetchWithAuth(`${AUTH_SERVICE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role }),
    });
    return handleResponse<AuthResponse>(response);
  },

  async signIn({ email, password }: SignInData): Promise<AuthResponse> {
    const response = await fetchWithAuth(`${AUTH_SERVICE_URL}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<AuthResponse>(response);
  },

  async signOut(): Promise<void> {
    const response = await fetchWithAuth(`${AUTH_SERVICE_URL}/api/auth/signout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to sign out');
    }
  },

  async getSession(): Promise<SessionResponse> {
    const response = await fetchWithAuth(`${AUTH_SERVICE_URL}/api/auth/session`, {
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' },
      credentials: 'include'
    });
    return handleResponse<SessionResponse>(response);
  },

  async refreshToken(): Promise<{ access_token: string }> {
    const response = await fetchWithAuth(`${AUTH_SERVICE_URL}/api/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include'
    });
    return handleResponse<{ access_token: string }>(response);
  },

  async updateProfile(updates: { name?: string; avatar_url?: string }): Promise<AuthResponse> {
    const response = await fetchWithAuth(`${AUTH_SERVICE_URL}/api/auth/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
      credentials: 'include'
    });
    return handleResponse<AuthResponse>(response);
  },

  async requestPasswordReset(email: string): Promise<void> {
    const response = await fetchWithAuth(`${AUTH_SERVICE_URL}/api/auth/request-password-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to request password reset');
    }
  },

  async resetPassword(token: string, password: string): Promise<void> {
    const response = await fetchWithAuth(`${AUTH_SERVICE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to reset password');
    }
  },

  async verifyEmail(token: string): Promise<void> {
    const response = await fetchWithAuth(`${AUTH_SERVICE_URL}/api/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to verify email');
    }
  }
};
