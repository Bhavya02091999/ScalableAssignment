'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { QueryClient } from '@tanstack/react-query';
import { 
  useUser, 
  useLogin, 
  useRegister, 
  useLogout, 
  useUpdateProfile,
  useResendVerification,
  useForgotPassword,
  useResetPassword,
  type User,
  type LoginCredentials,
  type RegisterData,
  type UpdateProfileData,
  type ForgotPasswordData,
  type ResetPasswordData,
  type AuthResponse
} from '@/hooks/use-auth';

type AuthContextType = {
  // User state
  user: User | null;
  loading: boolean;
  
  // Auth methods
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: Omit<RegisterData, 'role'> & { role?: 'student' | 'instructor' }) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: UpdateProfileData) => Promise<AuthResponse>;
  resendVerification: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: Omit<ResetPasswordData, 'token'> & { token?: string }) => Promise<void>;
  
  // Helper methods
  isAuthenticated: boolean;
  hasRole: (role: User['role']) => boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading: userLoading, refetch: refetchUser } = useUser();
  const [loading, setLoading] = useState(true);
  
  // Ensure user is null when not authenticated
  const currentUser = user || null;
  
  // Auth mutations
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  const updateProfileMutation = useUpdateProfile();
  const resendVerificationMutation = useResendVerification();
  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();

  // Set initial loading state
  useEffect(() => {
    if (!userLoading) {
      setLoading(false);
    }
  }, [userLoading]);

  // Auth methods
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      await loginMutation.mutateAsync({ email, password });
      // Refresh the user data after successful login
      await refetchUser();
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }, [loginMutation, refetchUser]);

  const signUp = useCallback(async (data: Omit<RegisterData, 'role'> & { role?: 'student' | 'instructor' }) => {
    try {
      await registerMutation.mutateAsync({
        ...data,
        role: data.role || 'student',
      });
      // Refresh the user data after successful registration
      await refetchUser();
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }, [registerMutation, refetchUser]);

  const signOut = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
      // Clear all queries and reset the user data
      const queryClient = new QueryClient();
      queryClient.clear();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }, [logoutMutation]);

  const updateProfile = useCallback(async (updates: UpdateProfileData) => {
    try {
      const response = await updateProfileMutation.mutateAsync(updates);
      // Update the user data with the response
      await refetchUser();
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }, [updateProfileMutation, refetchUser]);

  const resendVerification = useCallback(async () => {
    try {
      if (!user?.email) {
        throw new Error('No user email available');
      }
      await resendVerificationMutation.mutateAsync(user.email);
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  }, [resendVerificationMutation, user?.email]);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      await forgotPasswordMutation.mutateAsync(email);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }, [forgotPasswordMutation]);

  const resetPassword = useCallback(async (data: Omit<ResetPasswordData, 'token'> & { token?: string }) => {
    try {
      const token = data.token || new URLSearchParams(window.location.search).get('token');
      if (!token) {
        throw new Error('No reset token provided');
      }
      await resetPasswordMutation.mutateAsync({
        token,
        password: data.password,
      });
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }, [resetPasswordMutation]);

  // Helper methods
  const isAuthenticated = !!currentUser;
  
  const hasRole = useCallback((role: User['role']) => {
    return currentUser?.role === role;
  }, [currentUser]);

  const refreshUser = useCallback(async () => {
    await refetchUser();
  }, [refetchUser]);

  const value = {
    user: currentUser,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resendVerification,
    forgotPassword,
    resetPassword,
    isAuthenticated,
    hasRole,
    refreshUser,
  } as const;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
