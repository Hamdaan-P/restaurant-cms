import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { prisma } from "@/lib/prisma";
import { PublicNav } from "@/components/PublicNav";
import { Status } from "@prisma/client";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await prisma.siteSettings.findFirst({
    where: { status: Status.PUBLISHED },
  });

  return {
    title: siteSettings?.restaurantName ?? "Our Restaurant",
    description:
      siteSettings?.tagline ??
      "Explore our menu, story, gallery, and get in touch.",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PublicNav />
        {children}
      </body>
    </html>
  );
}
