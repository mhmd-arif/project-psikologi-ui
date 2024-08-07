"use client";

import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "@/context/GlobalContext";

const montserrat = Montserrat({
  subsets: ["latin"],
  fallback: ["Arial", "sans-serif"],
  variable: "--font-montserrat",
});

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GlobalProvider>
        <body className={`${montserrat.variable} font-sans`}>{children}</body>
      </GlobalProvider>
    </html>
  );
}
