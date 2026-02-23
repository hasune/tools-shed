import type { Metadata } from "next";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { routing } from "@/i18n/routing";
import "../globals.css";

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HomePage.metadata" });

  const languages: Record<string, string> = {};
  routing.locales.forEach((l) => {
    languages[l] = `https://tools-shed.com/${l}`;
  });
  languages["x-default"] = "https://tools-shed.com/en";

  return {
    metadataBase: new URL("https://tools-shed.com"),
    title: {
      default: t("title"),
      template: "%s | ToolsShed",
    },
    description: t("description"),
    keywords: ["online tools", "free tools", "developer tools", "unit converter", "calculator"],
    verification: {
      google: "YKiR-JRznSp190FRPKxepdKt1G3Fs4IM1X_lH-n3ZHA",
    },
    alternates: {
      canonical: `https://tools-shed.com/${locale}`,
      languages,
    },
    icons: {
      icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛠️</text></svg>",
      shortcut: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛠️</text></svg>",
    },
    authors: [{ name: "ToolsShed" }],
    creator: "ToolsShed",
    openGraph: {
      type: "website",
      url: `https://tools-shed.com/${locale}`,
      siteName: "ToolsShed",
      title: t("title"),
      description: t("description"),
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ToolsShed - Free Online Tools" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
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
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        {/* Google AdSense */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6229200956587599"
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics gaId="G-3N423K0N2Q" />
    </html>
  );
}
