import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json(
        { user: null, session: null },
        { status: 200 }
      )
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    return NextResponse.json({
      user: {
        ...session.user,
        user_metadata: {
          ...session.user.user_metadata,
          name: profile ? `${profile.first_name} ${profile.last_name}`.trim() : session.user.email?.split('@')[0],
          role: profile?.role || 'student',
        },
      },
      session,
    })
  } catch (error: any) {
    console.error('Session error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching the session' },
      { status: 500 }
    )
  }
}
