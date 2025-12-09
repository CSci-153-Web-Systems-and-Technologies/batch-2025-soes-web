'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; 

export default function TabNavigation({ electionId }: { electionId: string }) {
  const pathname = usePathname();

  const baseUrl = `/elections/${electionId}`;

  const tabs = [
    { name: "Overview", href: baseUrl, exact: true },
    { name: "Positions", href: `${baseUrl}/positions` },
    { name: "Partylists", href: `${baseUrl}/partylists` },
    { name: "Candidates", href: `${baseUrl}/candidates` },
    { name: "Voters", href: `${baseUrl}/voters` },
    { name: "Settings", href: `${baseUrl}/settings` },
  ];

  return (
    <div className="border-b">
      <div className="flex h-10 items-center space-x-6 px-2">
        {tabs.map((tab) => {
          // Logic: If 'exact' is true, match perfectly.
          // Otherwise, check if the current path starts with the tab href.
          const isActive = tab.exact 
            ? pathname === tab.href 
            : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "flex items-center text-sm font-medium border-b-2 h-10 transition-colors hover:text-blue-600",
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300"
              )}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}