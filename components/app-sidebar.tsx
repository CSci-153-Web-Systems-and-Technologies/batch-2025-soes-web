import { LayoutDashboard, Vote, Users, Flag, ChartColumn, Settings } from "lucide-react";
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
  SidebarGroupLabel,
  SidebarFooter
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: LayoutDashboard,
  },
  {
    title: "Elections",
    url: "#",
    icon: Vote,
  },
  {
    title: "Candidates and Partylists",
    url: "#",
    icon: Users,
  },
  {
    title: "Position Templates",
    url: "#",
    icon: Flag,
  },
  {
    title: "Reports and Results",
    url: "#",
    icon: ChartColumn,
  },
];
const systemitem =   {
    title: "Settings",
    url: "#",
    icon: Settings,
  }; // Settings 

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader>
            <div className="pb-2 h-20 w-[16rem] inline-flex justify-start items-center gap-2 border-b-1 border-neutral-200">
              <Image src={logo} height={45} width={45} alt="logo" />
              <div className="inline-flex flex-col justify-start items-start">
                <div className="self-stretch h-6 relative">
                  <h1 className="absolute justify-start font-bold leading-6 text-2xl">
                    SOES
                  </h1>
                </div>
                <div className="self-stretch h-4 relative">
                  <h2 className="justify-start text-gray-600 text-[10px] leading-4 font-normal">
                    Student Organization Election System
                  </h2>
                </div>
              </div>
            </div>
          </SidebarHeader>
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
    </Sidebar>
  );
}
