"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function TabNavigation({ electionId }: { electionId: string }) {
  const pathname = usePathname();

  const baseUrl = `/admin/elections/${electionId}`;

  const tabs = [
    { name: "Overview", href: baseUrl, exact: true },
    { name: "Positions", href: `${baseUrl}/positions` },
    { name: "Partylists", href: `${baseUrl}/partylists` },
    { name: "Candidates", href: `${baseUrl}/candidates` },
    { name: "Voters", href: `${baseUrl}/voters` },
    { name: "Results", href: `${baseUrl}/results` },
    { name: "Settings", href: `${baseUrl}/settings` },
  ];

  // Find the active tab
  const activeTab =
    tabs.find((tab) =>
      tab.exact ? pathname === tab.href : pathname.startsWith(tab.href)
    ) || tabs[0];

  return (
    <div className="border-b border-border bg-background">
      {/* Desktop Tab Navigation */}
      <div className="hidden md:flex h-10 items-center space-x-4 md:space-x-6 px-2">
        {tabs.map((tab) => {
          const isActive = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "flex items-center text-sm font-medium border-b-2 h-10 transition-colors whitespace-nowrap",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>

      {/* Mobile Tab Dropdown */}
      <div className="md:hidden p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between text-sm"
              size="sm"
            >
              {activeTab.name}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[calc(100vw-2rem)]">
            {tabs.map((tab) => {
              const isActive = tab.exact
                ? pathname === tab.href
                : pathname.startsWith(tab.href);

              return (
                <DropdownMenuItem key={tab.name} asChild>
                  <Link
                    href={tab.href}
                    className={cn(
                      "w-full",
                      isActive && "bg-accent text-accent-foreground font-medium"
                    )}
                  >
                    {tab.name}
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
