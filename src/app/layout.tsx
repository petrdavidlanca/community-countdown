import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Community Countdowns",
  description: "Create and share custom countdown timers",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className="dark">
      <body
        className={`\${geistSans.variable} \${geistMono.variable} min-h-screen bg-background antialiased`}
      >
        <header className="absolute top-0 w-full p-4 flex justify-between items-center z-50 pointer-events-none">
          <Link href="/" className="pointer-events-auto">
            <span className="font-bold text-xl drop-shadow-md">Countdowns</span>
          </Link>
          <div className="flex gap-2 pointer-events-auto items-center">
            <Link href="/dashboard">
              <Button variant="ghost" className="drop-shadow-md backdrop-blur-sm bg-black/20">Dashboard</Button>
            </Link>
            {session?.user ? (
              <Link href="/api/auth/signout">
                <Button variant="ghost" className="drop-shadow-md backdrop-blur-sm bg-black/20 text-zinc-300">Sign Out</Button>
              </Link>
            ) : (
              <>
                <Link href="/api/auth/signin">
                  <Button variant="ghost" className="drop-shadow-md backdrop-blur-sm bg-black/20 text-zinc-300">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button className="drop-shadow-md backdrop-blur-sm bg-white text-black hover:bg-zinc-200">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </header>
        {children}
        <Toaster theme="dark" />
      </body>
    </html>
  );
}
