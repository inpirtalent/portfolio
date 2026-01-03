import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://julianocoutinho.dev';
const siteName = "Juliano Coutinho - Full-Stack Developer & Marketing Specialist";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: "Full-stack developer specializing in Next.js, Node.js, Ruby on Rails, and marketing automation. Building modern web applications and optimizing business processes with cutting-edge technology.",
  keywords: [
    "Juliano Coutinho",
    "Full-Stack Developer",
    "Next.js Developer",
    "Node.js Developer",
    "Ruby on Rails Developer",
    "Angular Developer",
    "React Developer",
    "Marketing Automation",
    "Web Development",
    "TypeScript Developer",
    "Marketing Specialist",
    "Automation Engineer",
    "Make.com",
    "Airtable",
    "Portfolio",
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "PostgreSQL",
    "MongoDB",
    "JavaScript",
    "TypeScript",
    "Ruby",
    "Python",
    "Angular",
  ],
  authors: [{ name: "Juliano Coutinho", url: siteUrl }],
  creator: "Juliano Coutinho",
  publisher: "Juliano Coutinho",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteName,
    title: siteName,
    description: "Full-stack developer specializing in Next.js, Node.js, Ruby on Rails, and marketing automation. Building modern web applications and optimizing business processes.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: "Full-stack developer specializing in Next.js, Node.js, Ruby on Rails, and marketing automation.",
    creator: "@julianocoutinho",
    images: [`${siteUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "Portfolio",
  classification: "Personal Portfolio",
  other: {
    "theme-color": "#00ff00",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
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

