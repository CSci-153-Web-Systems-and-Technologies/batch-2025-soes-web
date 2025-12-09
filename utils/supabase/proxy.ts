import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils"; // Assuming this path is correct for your project

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (!hasEnvVars) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Use getUser() instead of getClaims() for better security 
  // as it re-validates the user with the database.
  const { data: { user } } = await supabase.auth.getUser();
  
  // 1. Define the routes you want to protect
  // This will protect /admin, /admin/dashboard, /admin/settings, etc.
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  // 2. Check if the user is trying to access a protected route AND is not logged in
  if (isAdminRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login"; // Redirect them to your login page
    // Optional: Add a 'next' param so you can redirect them back after login
    // url.searchParams.set("next", request.nextUrl.pathname); 
    return NextResponse.redirect(url);
  }

  // OPTIONAL: If they ARE logged in and try to visit login, throw them to dashboard
  if (user && request.nextUrl.pathname.startsWith('/auth/login')) {
     const url = request.nextUrl.clone();
     url.pathname = "/admin/dashboard";
     return NextResponse.redirect(url);
  }

  return supabaseResponse;
}