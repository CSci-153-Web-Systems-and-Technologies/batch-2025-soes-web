"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, Check } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AvatarCropModal from "./AvatarCropModal";

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
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  // Track if there are unsaved changes
  const hasChanges =
    fullName !== (initialProfile.full_name || "") ||
    avatarUrl !== (initialProfile.avatar_url || "");

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

    // Create a preview URL and open the crop modal
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setSelectedImageSrc(src);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropSave = async (croppedBlob: Blob) => {
    setIsUploadingAvatar(true);

    try {
      // Delete old avatar if it exists
      if (avatarUrl) {
        try {
          // Extract the filepath from the URL
          const urlParts = avatarUrl.split(
            "/storage/v1/object/public/avatars/"
          );
          if (urlParts.length > 1) {
            const oldFilepath = decodeURIComponent(urlParts[1]);
            await supabase.storage.from("avatars").remove([oldFilepath]);
          }
        } catch (deleteError) {
          console.warn("Failed to delete old avatar:", deleteError);
          // Continue with upload even if deletion fails
        }
      }

      // Generate a unique filename with user ID in path
      const timestamp = Date.now();
      const filename = `${timestamp}.png`;
      const filepath = `${userId}/${filename}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filepath, croppedBlob, { upsert: true });

      if (uploadError) {
        toast.error("Failed to upload image: " + uploadError.message);
        setIsUploadingAvatar(false);
        return;
      }

      // Get the public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(filepath);
      const publicUrl = data.publicUrl;

      setAvatarUrl(publicUrl);
      setCropModalOpen(false);
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

      // Broadcast profile update to sidebar
      try {
        const channel = new BroadcastChannel("profile-update");
        channel.postMessage({
          full_name: fullName.trim(),
          avatar_url: avatarUrl,
        });
        channel.close();
      } catch (error) {
        console.warn("BroadcastChannel not supported:", error);
      }

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
              <div className="h-24 w-24 flex-shrink-0 rounded-[16px] border-2 border-gray-300 group-hover:border-blue-500 transition-colors overflow-hidden bg-gray-100 flex items-center justify-center">
                {avatarUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatarUrl}
                      alt={fullName}
                      className="h-full w-full object-cover"
                    />
                  </>
                ) : (
                  <span className="text-2xl font-semibold text-gray-400">
                    {getInitials(fullName)}
                  </span>
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
          disabled={isLoading || isUploadingAvatar || (!hasChanges && !isSaved)}
          className="bg-green-700 hover:bg-green-900 gap-2"
        >
          {isSaved && !hasChanges ? (
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

      <AvatarCropModal
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        onSave={handleCropSave}
        imageSrc={selectedImageSrc}
        isLoading={isUploadingAvatar}
      />
    </form>
  );
}
