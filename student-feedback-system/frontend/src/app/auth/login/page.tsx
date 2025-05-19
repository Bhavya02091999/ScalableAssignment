'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/MockAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { signIn, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const emailVerified = searchParams.get('verified') === 'true';
  const resetSuccess = searchParams.get('reset') === 'success';
  const registered = searchParams.get('registered') === 'true';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: searchParams.get('email') || '',
    },
  });

  // Handle redirects and messages
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to:', callbackUrl);
      router.push(callbackUrl);
      return;
    }

    if (emailVerified) {
      toast({
        title: 'Email verified',
        description: 'Your email has been successfully verified. You can now sign in.',
        variant: 'default',
      });
    }
    
    if (registered) {
      toast({
        title: 'Registration successful',
        description: 'Please check your email to verify your account before signing in.',
        variant: 'default',
      });
    }

    if (resetSuccess) {
      toast({
        title: 'Password reset successful',
        description: 'Your password has been reset successfully. You can now sign in with your new password.',
        variant: 'default',
      });
    }
  }, [isAuthenticated, callbackUrl, router, emailVerified, registered, resetSuccess, toast]);
  
  // Add a debug effect to log auth state changes
  useEffect(() => {
    console.log('Auth state changed - isAuthenticated:', isAuthenticated, 'User:', user);
  }, [isAuthenticated, user]);

  // Handle form submission
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn(data.email, data.password);
      
      toast({
        title: 'Successfully signed in',
        description: 'You have been successfully logged in.',
      });
      
      router.push(callbackUrl);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An error occurred during sign in. Please try again.';
      
      setError(errorMessage);
      
      // Set form-level error for better UX
      setFormError('root', { 
        type: 'manual',
        message: errorMessage 
      });
      
      toast({
        title: 'Sign in failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Sign in to your account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to log in
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Success messages */}
          {emailVerified && (
            <div className="p-3 mb-4 bg-green-50 text-green-700 text-sm rounded-md">
              Your email has been verified successfully. You can now sign in.
            </div>
          )}
          
          {resetSuccess && (
            <div className="p-3 mb-4 bg-green-50 text-green-700 text-sm rounded-md">
              Your password has been reset successfully. You can now sign in with your new password.
            </div>
          )}
          
          {registered && (
            <div className="p-3 mb-4 bg-green-50 text-green-700 text-sm rounded-md">
              Registration successful! Please check your email to verify your account.
            </div>
          )}
          
          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                disabled={isLoading}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                disabled={isLoading}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 pt-0">
          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/register"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
