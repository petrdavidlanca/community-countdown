import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={\`\${geistSans.variable} \${geistMono.variable} min-h-screen bg-background antialiased\`}
      >
        <header className="absolute top-0 w-full p-4 flex justify-between items-center z-50 pointer-events-none">
          <Link href="/" className="pointer-events-auto">
            <span className="font-bold text-xl drop-shadow-md">Countdowns</span>
          </Link>
          <div className="flex gap-2 pointer-events-auto">
            <Link href="/dashboard">
              <Button variant="ghost" className="drop-shadow-md backdrop-blur-sm bg-black/20">Dashboard</Button>
            </Link>
          </div>
        </header>
        {children}
        <Toaster theme="dark" />
      </body>
    </html>
  );
}
