import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ToolLayout from "@/components/ToolLayout";
import UnitPriceCalculator from "@/components/tools/UnitPriceCalculator";
import { routing } from "@/i18n/routing";

interface Props { params: Promise<{ locale: string }> }

const BASE_URL = "https://tools-shed.com";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.unit-price-calculator" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/math/unit-price-calculator`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${BASE_URL}/${l}/math/unit-price-calculator`])),
    },
    openGraph: { title: t("metaTitle"), description: t("metaDescription"), url: `${BASE_URL}/${locale}/math/unit-price-calculator`, type: "website" },
    twitter: { card: "summary_large_image", title: t("metaTitle"), description: t("metaDescription") },
  };
}

export default async function UnitPriceCalculatorPage({ params }: Props) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.unit-price-calculator" });
  const tCat = await getTranslations({ locale, namespace: "Categories.math" });
  return (
    <ToolLayout toolName={tTools("name")} toolSlug="unit-price-calculator" categoryName={tCat("name")} categorySlug="math" description={tTools("description")}>
      <UnitPriceCalculator />
    </ToolLayout>
  );
}
