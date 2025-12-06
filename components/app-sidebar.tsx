import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import Image from "next/image";
import logo from "@/public/logo.svg";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader>
            <div className="w-64 h-20 inline-flex justify-start items-center gap-2 border-b-1 border-neutral-200">
              <Image src={logo} height={45} width={45} alt="logo" />
              <div className="inline-flex flex-col justify-start items-start">
                <div className="self-stretch h-6 relative">
                    <h1 className="absolute justify-start font-bold leading-6 text-2xl">SOES</h1>
                </div>
                <div className="self-stretch h-4 relative">
                    <h2 className="justify-start text-gray-600 text-[10px] leading-4 font-normal">Student Organization Election System</h2>
                </div>
              </div>
            </div>
          </SidebarHeader>
          <SidebarGroupContent>
            <SidebarMenu>
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
