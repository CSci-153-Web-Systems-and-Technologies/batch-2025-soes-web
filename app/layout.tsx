import type { Metadata } from "next";
import { Arimo, Space_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import LandingPageHeader from "../components/LandingPageHeader";
import LandingPageFooter from "../components/LandingPageFooter";

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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${arimo.variable} ${spaceMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LandingPageHeader />
          {children}
          <LandingPageFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
