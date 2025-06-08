import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { Instagram } from "lucide-react";
import { cn } from "@/lib/utils";
import { NextAuthProvider } from "@/components/auth/next-auth-provider";
import { UserNav } from "@/components/auth/UserNav";
import { Toaster } from "sonner";
import Script from "next/script";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Moto Club",
  description: "Moto Club - Your Motorcycle Community",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/react-datepicker@4.8.0/dist/react-datepicker.css"
        />
        <style>{`
          @page {
            margin: 0;
            size: A4;
          }
          @media print {
            html, body {
              height: 100vh;
              margin: 0 !important;
              padding: 0 !important;
              overflow: hidden;
            }
          }
        `}</style>
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geist.variable
        )}
      >
        <NextAuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center px-4 sm:px-6">
                  <div className="md:hidden">
                    <MobileNav />
                  </div>
                  <MainNav />
                  <div className="flex items-center justify-end gap-2 sm:gap-4">
                    <div className="hidden md:block">
                      <ModeToggle />
                    </div>
                    <UserNav />
                  </div>
                </div>
              </header>
              <main className="flex-1">{children}</main>
              <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex flex-col sm:flex-row h-auto sm:h-16 items-center justify-between gap-4 sm:gap-0 py-4 sm:py-0 px-4 sm:px-6">
                  <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                    © {new Date().getFullYear()} Pan European Club Ticino. All
                    rights reserved.
                  </p>
                  <div className="flex items-center gap-4">
                    <a
                      href="https://www.instagram.com/pan_european_club_ticino/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Follow us on Instagram"
                    >
                      <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
                    </a>
                  </div>
                </div>
              </footer>
            </div>
            <Toaster />
          </ThemeProvider>
        </NextAuthProvider>
        <Script src="https://unpkg.com/react-datepicker@4.8.0/dist/react-datepicker.min.js" />
      </body>
    </html>
  );
}
