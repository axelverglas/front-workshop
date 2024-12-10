import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { QueryProviders } from "@/providers/query-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
  manifest: "/manifest.json",
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`flex min-h-screen flex-col bg-background ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProviders>
          <div className="flex min-h-screen flex-col">{children}</div>
        </QueryProviders>
      </body>
    </html>
  );
}
