'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token || !email) {
        setError('Invalid verification link. Please try again.');
        setLoading(false);
        return;
      }

      try {
        // In a real app, you would call your auth service to verify the email
        // For now, we'll simulate a successful verification
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // If this were a real implementation, you would make an API call here:
        // const response = await fetch('/api/auth/verify-email', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ token, email }),
        // });
        // if (!response.ok) throw new Error('Verification failed');
        
        setVerified(true);
      } catch (err) {
        console.error('Email verification error:', err);
        setError('Failed to verify email. The link may have expired or is invalid.');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, email]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Verifying your email</CardTitle>
            <CardDescription>Please wait while we verify your email address.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-center">Verifying your email address...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Verification Failed</CardTitle>
            <CardDescription>We couldn't verify your email address.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <XCircle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-center text-destructive">{error}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/auth/login">
                <span>Back to Login</span>
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Email Verified</CardTitle>
          <CardDescription>Your email has been successfully verified!</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-8">
          <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
          <p className="text-center">
            Thank you for verifying your email address. You can now sign in to your account.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/auth/login">
              <span>Sign In</span>
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
