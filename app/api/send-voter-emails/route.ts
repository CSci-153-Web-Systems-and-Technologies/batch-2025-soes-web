import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendVoterCredentials } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { electionId, voterIds } = await request.json();

    if (!electionId) {
      return NextResponse.json(
        { error: 'Election ID is required' },
        { status: 400 }
      );
    }

    // Create admin client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Fetch election details
    const { data: election, error: electionError } = await supabaseAdmin
      .from('election_sessions')
      .select('title, description, status')
      .eq('id', electionId)
      .single();

    if (electionError || !election) {
      return NextResponse.json(
        { error: 'Election not found' },
        { status: 404 }
      );
    }

    // Build ballot and results URLs
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const ballotUrl = `${baseUrl}/vote?election=${electionId}`;
    const resultsUrl = `${baseUrl}/results/${electionId}`;

    // Fetch voters
    let votersQuery = supabaseAdmin
      .from('eligible_voters')
      .select('id, school_id, email, access_code')
      .eq('election_id', electionId);

    // If specific voter IDs provided, filter by them
    if (voterIds && voterIds.length > 0) {
      votersQuery = votersQuery.in('id', voterIds);
    }

    const { data: voters, error: votersError } = await votersQuery;

    if (votersError) {
      return NextResponse.json(
        { error: 'Failed to fetch voters' },
        { status: 500 }
      );
    }

    if (!voters || voters.length === 0) {
      return NextResponse.json(
        { error: 'No voters found' },
        { status: 404 }
      );
    }

    // Send emails to all voters
    const results = await Promise.allSettled(
      voters.map(async (voter) => {
        if (!voter.email) {
          return {
            voterId: voter.id,
            voterName: voter.school_id,
            email: voter.email || '',
            success: false,
            error: 'No email address',
          };
        }

        const result = await sendVoterCredentials({
          email: voter.email,
          voterName: voter.school_id,
          accessCode: voter.access_code,
          electionTitle: election.title,
          electionDescription: election.description || undefined,
          ballotUrl,
          resultsUrl,
          electionStatus: election.status,
        });

        return {
          voterId: voter.id,
          voterName: voter.school_id,
          email: voter.email,
          ...result,
        };
      })
    );

    // Process results
    const successful = results.filter((r) => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;

    const failedVoters = results
      .filter((r) => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success))
      .map((r) => {
        if (r.status === 'fulfilled') {
          const value = r.value;
          return {
            voterName: value.voterName,
            email: value.email || 'No email',
            error: value.error || 'Unknown error',
          };
        }
        return { error: String(r.reason) };
      });

    return NextResponse.json({
      success: true,
      sent: successful,
      failed: failed,
      total: results.length,
      failedVoters: failedVoters.length > 0 ? failedVoters : undefined,
    });
  } catch (error) {
    console.error('Send emails error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
