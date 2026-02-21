import type { Metadata } from "next";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tools-shed.com"),
  title: {
    default: "ToolsShed - Free Online Tools",
    template: "%s | ToolsShed",
  },
  description:
    "Free online tools for developers, students, and professionals. JSON Formatter, Base64, UUID Generator, Unit Converters, and more.",
  keywords: ["online tools", "free tools", "developer tools", "unit converter", "calculator"],
  verification: {
    google: "YKiR-JRznSp190FRPKxepdKt1G3Fs4IM1X_lH-n3ZHA",
  },
  alternates: {
    canonical: "https://tools-shed.com",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛠️</text></svg>",
    shortcut: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛠️</text></svg>",
  },
  authors: [{ name: "ToolsShed" }],
  creator: "ToolsShed",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tools-shed.com",
    siteName: "ToolsShed",
    title: "ToolsShed - Free Online Tools",
    description:
      "Free online tools for developers, students, and professionals. JSON Formatter, Base64, UUID Generator, Unit Converters, and more.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ToolsShed - Free Online Tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolsShed - Free Online Tools",
    description: "Free online tools for developers and professionals.",
    images: ["/og-image.png"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6229200956587599"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-3N423K0N2Q" />
    </html>
  );
}
