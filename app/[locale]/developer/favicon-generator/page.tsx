import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ToolLayout from "@/components/ToolLayout";
import FaviconGenerator from "@/components/tools/FaviconGenerator";

const BASE_URL = "https://tools-shed.com";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.favicon-generator" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/developer/favicon-generator`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${BASE_URL}/${l}/developer/favicon-generator`])),
    },
    openGraph: { title: t("metaTitle"), description: t("metaDescription"), url: `${BASE_URL}/${locale}/developer/favicon-generator` , images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolsShed - Free Online Tools" }] },
    twitter: { card: "summary", title: t("metaTitle"), description: t("metaDescription") , images: ["/opengraph-image"] },
  };
}

export default async function FaviconGeneratorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.favicon-generator" });
  const tCat = await getTranslations({ locale, namespace: "Categories.developer" });
  return (
    <ToolLayout toolName={tTools("name")} toolSlug="favicon-generator" categoryName={tCat("name")} categorySlug="developer" description={tTools("description")}>
      <FaviconGenerator />
    </ToolLayout>
  );
}
