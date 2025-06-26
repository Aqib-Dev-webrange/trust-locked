import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";

const fontPoppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TrustLockd Admin Panel",
  description: "Multi-vendor admin panel for TrustLockd platform",
  icons: {
    icon: "/images/logo.png", // <-- Correct path for favicon
  },
};

//change the favicon use image from public folder

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontPoppins.variable}>
      <head>
        <link rel="icon" href="/images/logo.png" type="image/png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${fontPoppins.variable} antialiased text-black`}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
