import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "@/libs/contexts/GlobalContext";
import ModalContainer from "@/components/modals/modal-container";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/libs/tanstack-query/query-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";
import env from "@/constants/env";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IC World",
  description: "Shop bán hàng điện tử",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
        <link rel="shortcut icon" type="image/x-icon" href="vercel.svg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleOAuthProvider clientId={env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
          <QueryProvider>
            <Toaster richColors />
            <GlobalProvider>
              <NuqsAdapter>{children}</NuqsAdapter>
            </GlobalProvider>
            <ModalContainer />
          </QueryProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
