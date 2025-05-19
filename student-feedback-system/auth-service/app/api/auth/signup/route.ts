import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// CORS headers are now handled by the middleware

export async function POST(request: Request) {
  
  try {
    const { email, password, name, role = 'student' } = await request.json()
    
    // Create a Supabase client configured to use cookies
    const supabase = createRouteHandlerClient({ cookies })

    // Let Supabase handle duplicate email checks during signup
    // This simplifies the code and reduces the chance of race conditions

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          name,
          role,
          email_redirect_to: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
      },
    });

    if (error) {
      console.error('Signup error:', error);
      
      // Handle specific error cases
      if (error.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'A user with this email already exists. Please sign in instead.' },
          { status: 400 }
        );
      }
      
      // Handle other potential errors
      return NextResponse.json(
        { 
          error: error.message || 'An error occurred during signup',
          code: error.status || 400
        },
        { status: 400 }
      );
    }

    // Prepare user data for profile
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || ' ';

    // Create user profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          email: email.toLowerCase(),
          first_name: firstName,
          last_name: lastName,
          role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't fail the entire signup if profile creation fails
        // The user can update their profile later
      }
    }

    return NextResponse.json(
      { 
        message: 'Signup successful! Please check your email to confirm your account.'
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during signup' },
      { status: 500 }
    );
  }
}
