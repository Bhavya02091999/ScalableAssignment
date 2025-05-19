"use client";

import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { MockAuthProvider } from '@/context/MockAuthContext';
import { MainNav } from '@/components/layout/MainNav';
import { UserNav } from '@/components/layout/UserNav';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MockAuthProvider>
            <div className="flex min-h-screen flex-col">
              <header className="border-b">
                <div className="container flex h-16 items-center justify-between py-4">
                  <Link href="/" className="text-xl font-bold">
                    Feedback System
                  </Link>
                  <div className="flex items-center space-x-4">
                    <MainNav />
                    <div className="ml-4">
                      <UserNav />
                    </div>
                  </div>
                </div>
              </header>
              <main className="flex-1">{children}</main>
              <footer className="border-t py-6">
                <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
                  <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Student Feedback System. All rights reserved.
                  </p>
                </div>
              </footer>
              <Toaster />
            </div>
          </MockAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
