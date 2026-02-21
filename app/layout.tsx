import type { Metadata } from "next";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ToolsShed - Free Online Tools",
    template: "%s | ToolsShed",
  },
  description:
    "Free online tools for developers, students, and professionals. JSON Formatter, Base64, UUID Generator, Unit Converters, and more.",
  keywords: ["online tools", "free tools", "developer tools", "unit converter", "calculator"],
  authors: [{ name: "ToolsShed" }],
  creator: "ToolsShed",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ToolsShed",
    title: "ToolsShed - Free Online Tools",
    description:
      "Free online tools for developers, students, and professionals. JSON Formatter, Base64, UUID Generator, Unit Converters, and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolsShed - Free Online Tools",
    description: "Free online tools for developers and professionals.",
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
    </html>
  );
}
