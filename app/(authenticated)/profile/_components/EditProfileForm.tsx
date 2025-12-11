"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Loader2, Check } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProfileData {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  created_at: string | null;
}

interface EditProfileFormProps {
  userId: string;
  userEmail: string;
  initialProfile: ProfileData;
}

export default function EditProfileForm({
  userId,
  userEmail,
  initialProfile,
}: EditProfileFormProps) {
  const [fullName, setFullName] = useState(initialProfile.full_name || "");
  const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatar_url || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const getInitials = (name: string) => {
    if (!name) return "CN";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // Generate a unique filename with user ID in path
      const timestamp = Date.now();
      const filename = `${timestamp}.${file.name.split(".").pop()}`;
      const filepath = `${userId}/${filename}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filepath, file, { upsert: true });

      if (uploadError) {
        toast.error("Failed to upload image: " + uploadError.message);
        setIsUploadingAvatar(false);
        return;
      }

      // Get the public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(filepath);
      const publicUrl = data.publicUrl;

      setAvatarUrl(publicUrl);
      toast.success("Avatar uploaded successfully");
    } catch (error) {
      toast.error("An error occurred while uploading the avatar");
      console.error("Upload error:", error);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!fullName.trim()) {
      toast.error("Full name is required");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          avatar_url: avatarUrl,
        })
        .eq("id", userId);

      if (error) {
        toast.error("Failed to update profile: " + error.message);
        setIsLoading(false);
        return;
      }

      toast.success("Profile updated successfully");
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
      router.refresh();
    } catch (error) {
      toast.error("An error occurred while updating the profile");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Avatar Section */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div>
          <Label className="text-sm font-medium text-gray-700 block mb-3">
            Profile Picture
          </Label>
          <div className="relative">
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={isUploadingAvatar}
              className="relative group"
            >
              <Avatar className="h-24 w-24 border-2 border-gray-300 group-hover:border-blue-500 transition-colors">
                <AvatarImage src={avatarUrl} alt={fullName} />
                <AvatarFallback className="text-xl font-semibold">
                  {getInitials(fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload size={20} className="text-white" />
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
              onChange={handleAvatarChange}
              disabled={isUploadingAvatar}
              className="hidden"
              aria-label="Upload avatar"
            />
          </div>
          {isUploadingAvatar && (
            <p className="text-xs text-gray-500 mt-2">Uploading...</p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Accepted formats: PNG, JPG, JPEG, GIF, WebP (Max 5MB)
          </p>
        </div>

        {/* Form Fields */}
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="full-name" className="text-sm font-medium">
              Full Name *
            </Label>
            <Input
              id="full-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              disabled={isLoading}
              required
              className="border-gray-300"
            />
            <p className="text-xs text-gray-500">
              Your name as it will appear in the system
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              value={userEmail}
              disabled
              className="border-gray-300 bg-gray-50 text-gray-600"
            />
            <p className="text-xs text-gray-500">
              Contact your administrator to change your email
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading || isUploadingAvatar}
          className="bg-green-700 hover:bg-green-900 gap-2"
        >
          {isSaved ? (
            <>
              <Check size={16} />
              Saved
            </>
          ) : isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
