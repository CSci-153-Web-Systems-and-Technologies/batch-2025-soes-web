import {
  LayoutDashboard,
  Vote,
  Users,
  Flag,
  ChartColumn,
  Settings,
  ChevronsUpDown,
} from "lucide-react";
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
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
    title: "Candidates and Partylists",
    url: "/admin/candidates",
    icon: Users,
  },
  {
    title: "Position Templates",
    url: "/admin/position",
    icon: Flag,
  },
  {
    title: "Reports and Results",
    url: "/admin/reports",
    icon: ChartColumn,
  },
];
const systemitem = {
  title: "Settings",
  url: "/admin/settings",
  icon: Settings,
}; 

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="pb-2 h-20 w-full inline-flex justify-start items-center gap-2 border-b-1 border-primary/20">
          <Image src={logo} height={45} width={45} alt="logo" />
          <div className="inline-flex flex-col justify-start items-start">
            <div className="self-stretch h-6 relative">
              <h1 className="absolute justify-start font-bold leading-6 text-2xl">
                SOES
              </h1>
            </div>
            <div className="self-stretch h-4 relative">
              <h2 className="justify-start text-primary/60 text-[10px] leading-4 font-normal">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    {/* <AvatarImage src={data.user.avatar} alt={data.user.name} /> */}
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                     <span className="truncate font-semibold">Username PlaceHolder</span>
                     <span className="truncate text-xs text-primary/60">email placeholder</span>
                    {/* <span className="truncate font-semibold">{data.user.name}</span> change later
                    <span className="truncate text-xs">{data.user.email}</span> change later*/}
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="start"
                sideOffset={10}
              >
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
