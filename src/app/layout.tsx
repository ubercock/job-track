import type { Metadata } from "next";
import "./globals.css";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "JobTrack",
    template: "%s • JobTrack",
  },
  description:
    "A recruiter-friendly job application tracker with pipeline, filters, insights, and local persistence.",
  metadataBase: new URL("https://example.com"), // replace after Vercel deploy
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">{children}</main>
        <SiteFooter />
        <Toaster richColors />
      </body>
    </html>
  );
}
