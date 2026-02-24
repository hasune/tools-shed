import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ToolLayout from "@/components/ToolLayout";
import AsciiArt from "@/components/tools/AsciiArt";
import { routing } from "@/i18n/routing";

interface Props { params: Promise<{ locale: string }> }

const BASE_URL = "https://tools-shed.com";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.ascii-art" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/developer/ascii-art`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${BASE_URL}/${l}/developer/ascii-art`])),
    },
    openGraph: { title: t("metaTitle"), description: t("metaDescription"), url: `${BASE_URL}/${locale}/developer/ascii-art`, type: "website" },
    twitter: { card: "summary_large_image", title: t("metaTitle"), description: t("metaDescription") },
  };
}

export default async function AsciiArtPage({ params }: Props) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.ascii-art" });
  const tCat = await getTranslations({ locale, namespace: "Categories.developer" });
  return (
    <ToolLayout toolName={tTools("name")} toolSlug="ascii-art" categoryName={tCat("name")} categorySlug="developer" description={tTools("description")}>
      <AsciiArt />
    </ToolLayout>
  );
}
