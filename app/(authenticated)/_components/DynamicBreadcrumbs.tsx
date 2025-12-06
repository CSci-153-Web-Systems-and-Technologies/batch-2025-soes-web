"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

export function DynamicBreadcrumbs() {
  const pathname = usePathname();

  // 1. Split path into segments (e.g. "/admin/elections" -> ["admin", "elections"])
  const segments = pathname.split("/").filter(Boolean);

  // 2. Get the last segment to use as the "Page Name"
  const lastSegment = segments[segments.length - 1];

  // 3. Format the name (Capitalize first letter, remove hyphens)"
  const pageName = lastSegment
    ? lastSegment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : "Dashboard";

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/admin/dashboard">Admin</BreadcrumbLink>
        </BreadcrumbItem>

        {segments.length > 0 && (
          <BreadcrumbSeparator className="hidden md:block" />
        )}

        <BreadcrumbItem>
          <BreadcrumbPage>{pageName}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
