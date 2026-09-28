import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaRegistration } from '@/nirmaan/client/components/PwaRegistration';

export const metadata: Metadata = {
  title: "Nirman Setu — Daily site reports become live schedule truth",
  description: "Intelligent field data capture and dynamic CPM schedule-linking layer for Oil India Limited.",
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#171717',
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
