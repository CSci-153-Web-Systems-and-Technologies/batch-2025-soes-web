import React from "react";
import LandingPageHeader from "@/app/(landing)/_components/LandingPageHeader";
import LandingPageFooter from "@/app/(landing)/_components/LandingPageFooter";


export default function LaningLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div>
          <LandingPageHeader />
          {children}
          <LandingPageFooter />
      </div>
  );
}
