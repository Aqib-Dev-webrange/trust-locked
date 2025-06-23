import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";

const fontPoppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "TrustLockd Admin Panel",
  description: "Multi-vendor admin panel for TrustLockd platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontPoppins.variable}>
      <body className={`${fontPoppins.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
