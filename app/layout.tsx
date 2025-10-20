import type { Metadata } from "next";
import { Arimo, Space_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import LandingPageHeader from "./components/LandingPageHeader";

const arimo = Arimo({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});
export const metadata: Metadata = {
  title: "SOES",
  description: "Student Organization Election System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${arimo.variable} ${spaceMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LandingPageHeader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
