import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Get the auth token from cookies
  const authToken = request.cookies.get('auth_token')?.value;
  
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth/');
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/');
  const isPublicAsset = request.nextUrl.pathname.startsWith('/_next/') || 
                      request.nextUrl.pathname.startsWith('/favicon.ico') ||
                      request.nextUrl.pathname.startsWith('/images/');
  const isVerifyPage = request.nextUrl.pathname.startsWith('/auth/verify-email');
  const isPasswordReset = request.nextUrl.pathname.startsWith('/auth/reset-password');

  // Allow public assets, API routes, and verification pages
  if (isPublicAsset || isApiRoute || isVerifyPage || isPasswordReset) {
    return response;
  }

  // If it's an auth page and user is already logged in, redirect to dashboard
  if (isAuthPage) {
    if (authToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return response;
  }

  // Protect all other routes
  if (!authToken) {
    // Store the current URL for redirecting back after login
    const callbackUrl = request.nextUrl.pathname !== '/' ? `?callbackUrl=${encodeURIComponent(request.nextUrl.pathname)}` : '';
    return NextResponse.redirect(
      new URL(`/auth/login${callbackUrl}`, request.url)
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (public images)
     * - auth/reset-password (password reset page)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|images/|auth/reset-password).*)',
  ],
};
