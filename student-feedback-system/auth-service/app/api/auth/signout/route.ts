import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.signOut()
    
    return NextResponse.json({ message: 'Signed out successfully' })
  } catch (error: any) {
    console.error('Signout error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred during sign out' },
      { status: 500 }
    )
  }
}
