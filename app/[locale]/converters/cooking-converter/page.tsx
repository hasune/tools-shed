import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ToolLayout from "@/components/ToolLayout";
import CookingConverter from "@/components/tools/CookingConverter";
import { routing } from "@/i18n/routing";

interface Props { params: Promise<{ locale: string }> }

const BASE_URL = "https://tools-shed.com";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.cooking-converter" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/converters/cooking-converter`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${BASE_URL}/${l}/converters/cooking-converter`])),
    },
    openGraph: { title: t("metaTitle"), description: t("metaDescription"), url: `${BASE_URL}/${locale}/converters/cooking-converter`, type: "website" },
    twitter: { card: "summary_large_image", title: t("metaTitle"), description: t("metaDescription") },
  };
}

export default async function CookingConverterPage({ params }: Props) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.cooking-converter" });
  const tCat = await getTranslations({ locale, namespace: "Categories.converters" });
  return (
    <ToolLayout toolName={tTools("name")} toolSlug="cooking-converter" categoryName={tCat("name")} categorySlug="converters" description={tTools("description")}>
      <CookingConverter />
    </ToolLayout>
  );
}
