import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    // Create a Supabase client configured to use cookies
    const supabase = createRouteHandlerClient({ cookies })

    // Sign in the user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    return NextResponse.json({
      user: {
        ...data.user,
        user_metadata: {
          ...data.user?.user_metadata,
          name: profile ? `${profile.first_name} ${profile.last_name}`.trim() : data.user?.email?.split('@')[0],
          role: profile?.role || 'student',
        },
      },
      session: data.session,
    })
  } catch (error: any) {
    console.error('Signin error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred during sign in' },
      { status: 500 }
    )
  }
}
