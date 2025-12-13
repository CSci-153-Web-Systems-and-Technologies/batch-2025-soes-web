"use client";

import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Vote,
  Users,
  Flag,
  ChartColumn,
  Settings,
  ChevronsUpDown,
  LogOut,
  UserCircle,
} from "lucide-react";
import Image from "next/image";
import logo from "@/public/logo.svg";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Elections",
    url: "/admin/elections",
    icon: Vote,
  },
  {
    title: "Partylists",
    url: "/admin/partylists",
    icon: Users,
  },
  {
    title: "Position Templates",
    url: "/admin/positions",
    icon: Flag,
  },
  {
    title: "Reports and Results",
    url: "/admin/reports",
    icon: ChartColumn,
  },
];

interface Profile {
  full_name: string | null;
  avatar_url: string | null;
}

const systemitem = {
  title: "Settings",
  url: "/admin/settings",
  icon: Settings,
};

export function AppSidebar() {
  // Initialize loading to true to prevent hydration mismatch
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (authUser) {
          setUser(authUser);
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", authUser.id)
            .single();

          if (profileData) {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        // Only set loading to false after fetch attempts are done
        setIsLoading(false);
      }
    };

    getUserData();

    // Listen for profile updates from BroadcastChannel
    try {
      const channel = new BroadcastChannel("profile-update");
      const handleMessage = (event: MessageEvent) => {
        if (event.data.full_name || event.data.avatar_url) {
          setProfile((prevProfile) => ({
            ...prevProfile,
            full_name: event.data.full_name || prevProfile?.full_name || null,
            avatar_url:
              event.data.avatar_url || prevProfile?.avatar_url || null,
          }));
        }
      };
      channel.addEventListener("message", handleMessage);
      return () => {
        channel.removeEventListener("message", handleMessage);
        channel.close();
      };
    } catch (error) {
      console.warn("BroadcastChannel not supported:", error);
    }
  }, [supabase]);

  const getInitials = (name: string) => {
    if (!name) return "CN";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="pb-2 h-20 w-full inline-flex justify-start items-center gap-2 border-b">
          <Image src={logo} height={45} width={45} alt="logo" />
          <div className="inline-flex flex-col justify-start items-start">
            <div className="self-stretch h-6 relative">
              <h1 className="absolute justify-start font-bold leading-6 text-2xl text-foreground">
                SOES
              </h1>
            </div>
            <div className="self-stretch h-4 relative">
              <h2 className="justify-start text-muted-foreground text-[10px] leading-4 font-normal">
                Student Organization Election System
              </h2>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex gap-1">
              <div className="mb-10">
                <SidebarGroupLabel>Management</SidebarGroupLabel>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </div>
              <SidebarGroupLabel>System</SidebarGroupLabel>
              <SidebarMenuItem key={systemitem.title}>
                <SidebarMenuButton asChild>
                  <a href={systemitem.url}>
                    <systemitem.icon />
                    <span>{systemitem.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* CONDITIONAL RENDERING TO FIX HYDRATION ERROR */}
            {isLoading ? (
              <div className="flex items-center gap-2 p-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-[80px]" />
                  <Skeleton className="h-2 w-[100px]" />
                </div>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={profile?.avatar_url || undefined}
                        alt={profile?.full_name || "User"}
                      />
                      <AvatarFallback className="rounded-lg">
                        {getInitials(profile?.full_name || "User")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {profile?.full_name || "Unknown User"}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user?.email || "No Email"}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 rounded-lg shadow-lg border"
                  side="top"
                  align="start"
                  sideOffset={10}
                >
                  {/* User Info Section */}
                  <div className="px-2 py-3 border-b">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-10 w-10 rounded-lg">
                        <AvatarImage
                          src={profile?.avatar_url || undefined}
                          alt={profile?.full_name || "User"}
                        />
                        <AvatarFallback className="rounded-lg">
                          {getInitials(profile?.full_name || "User")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left text-sm">
                        <p className="font-semibold text-foreground">
                          {profile?.full_name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email || "No Email"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <a href="/profile" className="flex items-center gap-2">
                      <UserCircle size={16} />
                      <span>My Profile</span>
                    </a>
                  </DropdownMenuItem>

                  <div className="my-1 border-t" />

                  <DropdownMenuItem
                    onClick={async () => {
                      await supabase.auth.signOut();
                      window.location.href = "/";
                    }}
                    className="cursor-pointer text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950 focus:text-red-600 dark:focus:text-red-400"
                  >
                    <LogOut size={16} />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
