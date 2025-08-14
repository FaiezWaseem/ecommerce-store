import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "sonner";
import dynamic from "next/dynamic";

const PWAInstallPrompt = dynamic(
  () => import("@/components/pwa-install-prompt"),
  { ssr: false }
);

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Samreens",
  description: "Samreens Your Online Shopping Destination",
  manifest: "/manifest.json",
  icons: [
    { rel: "apple-touch-icon", sizes: "192x192", url: "/android-chrome-192x192.png" },
    { rel: "icon", sizes: "192x192", url: "/android-chrome-192x192.png" },
    { rel: "icon", sizes: "512x512", url: "/android-chrome-512x512.png" },
  ],
  themeColor: "#ffffff",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Samreens",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
        <Toaster richColors position="top-right" />
        {/* PWA Install Prompt will only show when conditions are met */}
        <div id="pwa-install-container">
          {/* @ts-ignore - Dynamic import for client component */}
          {process.env.NODE_ENV === 'production' && <PWAInstallPrompt />}
        </div>
      </body>
    </html>
  );
}