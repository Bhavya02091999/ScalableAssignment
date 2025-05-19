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
// Password strength meter component
function PasswordStrengthMeter({ password }: { password: string }) {
  // Simple password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength += 1;
    if (pwd.match(/[a-z]+/)) strength += 1;
    if (pwd.match(/[A-Z]+/)) strength += 1;
    if (pwd.match(/[0-9]+/)) strength += 1;
    if (pwd.match(/[!@#$%^&*(),.?":{}|<>]+/)) strength += 1;
    return strength;
  };

  const strength = getPasswordStrength(password);
  const strengthText = 
    strength <= 1 ? 'Weak' : 
    strength <= 3 ? 'Moderate' : 'Strong';
  const strengthColor = 
    strength <= 1 ? 'bg-red-500' : 
    strength <= 3 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="mt-2">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${strengthColor}`} 
          style={{ width: `${(strength / 5) * 100}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Password strength: {strengthText}
      </p>
    </div>
  );
}

const registerSchema = z
  .object({
    name: z.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be at most 50 characters'),
    email: z.string()
      .email('Please enter a valid email address')
      .max(100, 'Email must be at most 100 characters'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password must be at most 100 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).+$/, 
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    confirmPassword: z.string(),
    role: z.enum(['student', 'instructor']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    watch,
    setError: setFormError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'student',
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(callbackUrl);
    }
  }, [isAuthenticated, callbackUrl, router]);

  if (isAuthenticated) {
    return null;
  }

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await signUp(
        data.email,
        data.password,
        data.name,
        data.role
      );
      
      // Show success message
      toast({
        title: 'Account created successfully!',
        description: 'Please check your email to verify your account.',
      });

      // Redirect to verify email page
      router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An error occurred during registration. Please try again.';
      
      setError(errorMessage);
      
      // Set form error for better UX
      setFormError('root', {
        type: 'manual',
        message: errorMessage,
      });
      
      // Show error toast
      toast({
        title: 'Registration failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const password = watch('password', '');
  const email = watch('email', '');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details to create a new account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                disabled={isLoading}
                {...formRegister('name')}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                disabled={isLoading}
                {...formRegister('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <span className="text-xs text-muted-foreground">
                  Min. 8 characters
                </span>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                disabled={isLoading}
                {...formRegister('password')}
              />
              <PasswordStrengthMeter password={password} />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                disabled={isLoading}
                {...formRegister('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Account Type</Label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-2 p-3 border rounded-md hover:bg-accent/50 transition-colors cursor-pointer">
                  <input
                    type="radio"
                    value="student"
                    className="h-4 w-4 text-primary"
                    disabled={isLoading}
                    {...formRegister('role')}
                  />
                  <div>
                    <p className="font-medium">Student</p>
                    <p className="text-xs text-muted-foreground">
                      Enroll in courses and provide feedback
                    </p>
                  </div>
                </label>
                <label className="flex items-center space-x-2 p-3 border rounded-md hover:bg-accent/50 transition-colors cursor-pointer">
                  <input
                    type="radio"
                    value="instructor"
                    className="h-4 w-4 text-primary"
                    disabled={isLoading}
                    {...formRegister('role')}
                  />
                  <div>
                    <p className="font-medium">Instructor</p>
                    <p className="text-xs text-muted-foreground">
                      Create and manage courses
                    </p>
                  </div>
                </label>
              </div>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>.
              </p>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 pt-0">
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href={`/auth/login${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
