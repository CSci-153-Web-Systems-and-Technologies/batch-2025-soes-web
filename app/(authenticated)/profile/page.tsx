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

interface ProfileData {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  created_at: string | null;
}

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
    <div className="flex flex-col h-screen w-full bg-gray-50">
      {/* Header with Back Button */}
      <div className="border-b border-gray-200 bg-white px-6 md:px-8 py-4 sticky top-0 z-10">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
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
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              My Profile
            </h1>
            <p className="text-gray-600 text-base mt-2">
              Manage your personal information and account settings
            </p>
          </div>

          {/* Profile Information Card */}
          <Card className="bg-white border border-gray-200">
            <CardHeader className="border-b border-gray-100">
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
          <Card className="bg-white border border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-base">Account Details</CardTitle>
              <CardDescription>Read-only account information</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Email Address
                </label>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900 text-sm font-mono break-all">
                    {user.email}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Role
                </label>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                    {profileData?.role?.toUpperCase() || "STUDENT"}
                  </span>
                </div>
              </div>

              {profileData?.created_at && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Account Created
                  </label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900 text-sm">
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
