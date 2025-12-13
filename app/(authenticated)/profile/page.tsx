import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import EditProfileForm from "./_components/EditProfileForm";
import { ProfileData } from "@/types/types";

export default async function ProfilePage() {
  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the user's profile data
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profileData = (profile as unknown as ProfileData) || {
    id: user.id,
    full_name: null,
    avatar_url: null,
    role: "student",
    created_at: null,
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background">
      {/* Header with Back Button */}
      <div className="border-b bg-card px-6 md:px-8 py-4 sticky top-0 z-10">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>

      {/* Main Content - Fills remaining space */}
      <div className="flex-1 overflow-auto w-full">
        <div className="w-full px-6 md:px-8 py-6 space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              My Profile
            </h1>
            <p className="text-muted-foreground text-base mt-2">
              Manage your personal information and account settings
            </p>
          </div>

          {/* Profile Information Card */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your name, avatar, and other details
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <EditProfileForm
                userId={user.id}
                userEmail={user.email || ""}
                initialProfile={profileData}
              />
            </CardContent>
          </Card>

          {/* Account Details Card */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-base">Account Details</CardTitle>
              <CardDescription>Read-only account information</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Email Address
                </label>
                <div className="p-4 bg-muted rounded-lg border">
                  <p className="text-foreground text-sm font-mono break-all">
                    {user.email}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Role
                </label>
                <div className="p-4 bg-muted rounded-lg border">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700">
                    {profileData?.role?.toUpperCase() || "STUDENT"}
                  </span>
                </div>
              </div>

              {profileData?.created_at && (
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Account Created
                  </label>
                  <div className="p-4 bg-muted rounded-lg border">
                    <p className="text-foreground text-sm">
                      {new Date(profileData.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
