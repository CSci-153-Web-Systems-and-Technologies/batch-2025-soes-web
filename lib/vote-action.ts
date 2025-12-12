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
  cookieStore.set('voter_session', JSON.stringify({ voterId: voter.id }), { 
    httpOnly: true, 
    secure: true, 
    maxAge: 60 * 30 // 30 minutes to vote
  })

  return { success: true, electionId: voter.election_id }
}

interface Vote {
  electionId: string;
  positionId: string;
  candidateId: string | null;
  voterId: string;
}

export async function submitVote(votes: Vote[]) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Verify voter hasn't already voted
    const { data: voter } = await supabaseAdmin
      .from('eligible_voters')
      .select('has_voted')
      .eq('id', votes[0].voterId)
      .single();

    if (!voter) {
      return { success: false, message: 'Voter not found' };
    }

    if (voter.has_voted) {
      return { success: false, message: 'You have already voted' };
    }

    // Insert all votes
    const votesToInsert = votes.map(vote => ({
      election_id: vote.electionId,
      position_id: vote.positionId,
      candidate_id: vote.candidateId,
      user_id: null, // No authenticated user for ballot voting
    }));

    const { error: voteError } = await supabaseAdmin
      .from('votes')
      .insert(votesToInsert);

    if (voteError) {
      console.error('Vote insertion error:', voteError);
      return { success: false, message: 'Failed to submit vote' };
    }

    // Mark voter as having voted
    const { error: updateError } = await supabaseAdmin
      .from('eligible_voters')
      .update({ has_voted: true })
      .eq('id', votes[0].voterId);

    if (updateError) {
      console.error('Voter update error:', updateError);
      return { success: false, message: 'Failed to update voter status' };
    }

    // Clear voter session cookie
    const cookieStore = await cookies();
    cookieStore.delete('voter_session');

    return { success: true };
  } catch (error) {
    console.error('Submit vote error:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
}