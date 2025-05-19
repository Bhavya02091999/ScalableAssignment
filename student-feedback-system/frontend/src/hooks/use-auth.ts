import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { authService, type AuthResponse as AuthServiceResponse, type UserProfile } from "@/lib/api/auth";

export type User = UserProfile;

export type AuthResponse = AuthServiceResponse;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'student' | 'instructor';
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateProfileData {
  name?: string;
  avatar_url?: string;
}

export function useUser() {
  const { data: user, isLoading, refetch } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const { user } = await authService.getSession();
        return user || null;
      } catch (error) {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });

  const refetchUser = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return { 
    user, 
    isLoading,
    refetch: refetchUser
  };
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: (credentials) => authService.signIn(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
      router.push("/dashboard");
      router.refresh();
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<AuthResponse, Error, RegisterData>({
    mutationFn: (data) => authService.signUp(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
      router.push("/auth/verify-email");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
      queryClient.clear();
      router.push("/auth/login");
      router.refresh();
    },
  });
}

export function useForgotPassword() {
  return useMutation<void, Error, string>({
    mutationFn: (email) => authService.requestPasswordReset(email),
  });
}

export function useResetPassword() {
  return useMutation<void, Error, { token: string; password: string }>({
    mutationFn: ({ token, password }) => authService.resetPassword(token, password),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, UpdateProfileData>({
    mutationFn: (updates) => authService.updateProfile(updates),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["user"], updatedUser);
    },
  });
}

export function useResendVerification() {
  return useMutation<void, Error, string>({
    mutationFn: (email) => authService.verifyEmail(email),
  });
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: () => authService.refreshToken(),
  });
}
