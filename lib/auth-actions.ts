"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  // Fix: Initialize client once at the top
  const supabase = await createClient();
  
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  // Fix: Initialize client once at the top
  const supabase = await createClient();

  // 1. Get Form Data
  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const setupMode = formData.get("setup_mode") as string; 
  const orgInput = formData.get("organization") as string; 

  let organizationId: string | null = null;
  const userRole = 'admin';

  // 2. Handle Organization (Create or Join)
  if (setupMode === 'join') {
    const { data: org, error } = await supabase
      .from('organizations')
      .select('id')
      .eq('invite_code', orgInput)
      .single();

    if (!org || error) {
      console.error("Invalid Organization Code");
      redirect("/error?message=Invalid Organization Code");
    }
    organizationId = org.id;

  } else {
    // Create new Organization
    const { data: newOrg, error } = await supabase
      .from('organizations')
      .insert({ 
        name: orgInput,
        invite_code: Math.random().toString(36).substring(7).toUpperCase()
      })
      .select('id')
      .single();

    if (error) {
      console.error("Failed to create organization", error);
      redirect("/error?message=Failed to create organization");
    }
    organizationId = newOrg.id;
  }

  // 3. Sign Up User
  // We use supabase.auth directly now since we awaited createClient at the top
  const { error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        organization_id: organizationId,
        role: userRole,
      },
    },
  });

  // 4. CRITICAL: Handle Errors & Rollback
  if (authError) {
    console.error("Auth Error:", authError.message);

    // IF we just created an organization but the user failed to sign up,
    // DELETE the organization so we don't leave a "Zombie" row.
    if (setupMode === 'create' && organizationId) {
      await supabase.from('organizations').delete().eq('id', organizationId);
    }

    // Redirect to error page with the specific message
    redirect(`/error?message=${encodeURIComponent(authError.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect("/logout");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.log(error);
    redirect("/error");
  }

  if (data.url) {
    redirect(data.url);
  }
}