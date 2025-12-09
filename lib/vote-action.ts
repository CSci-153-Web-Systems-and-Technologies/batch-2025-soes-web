'use server'

import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js' // Use standard JS client for Admin access

export async function verifyVoter(schoolId: string, accessCode: string) {
  // 1. Create a SUPABASE ADMIN Client (Bypasses RLS)
  // We cannot use the standard createServerClient here because the student isn't "logged in"
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // You need to add this to your .env.local
  )

  // 2. Find the voter
  const { data: voter } = await supabaseAdmin
    .from('eligible_voters')
    .select('*')
    .eq('school_id', schoolId)
    .eq('access_code', accessCode)
    .single()

  // 3. Validation Checks
  if (!voter) return { success: false, message: 'Invalid Student ID or Access Code' }
  if (voter.has_voted) return { success: false, message: 'You have already voted in this election.' }

  // 4. Create a temporary "Session" for the voter
  // We store their ID in a secure HTTP-only cookie so we know who they are on the next page
  const cookieStore = await cookies()
  cookieStore.set('voter_session', voter.id, { 
    httpOnly: true, 
    secure: true, 
    maxAge: 60 * 30 // 30 minutes to vote
  })

  return { success: true, electionId: voter.election_id }
}