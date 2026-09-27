import type { Metadata } from "next";
import "./globals.css";
import { PwaRegistration } from '@/nirmaan/client/components/PwaRegistration';

export const metadata: Metadata = {
  title: "Nirmaan Setu — Oil India Limited",
  description: "Intelligent Field Data Capture & Dynamic CPM Schedule-Linking Layer",
  manifest: '/manifest.webmanifest',
  themeColor: '#002244',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <PwaRegistration />
        {children}
      </body>
    </html>
  );
}
