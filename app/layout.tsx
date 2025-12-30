import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Juliano Coutinho - Portfolio",
  description: "Full-stack developer, marketer, and automation specialist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

