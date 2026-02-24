import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ToolLayout from "@/components/ToolLayout";
import FuelEfficiencyConverter from "@/components/tools/FuelEfficiencyConverter";
import { routing } from "@/i18n/routing";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.fuel-efficiency-converter" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `https://tools-shed.com/${locale}/converters/fuel-efficiency-converter`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `https://tools-shed.com/${l}/converters/fuel-efficiency-converter`])
      ),
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: `https://tools-shed.com/${locale}/converters/fuel-efficiency-converter`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
  };
}

export default async function FuelEfficiencyConverterPage({ params }: Props) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.fuel-efficiency-converter" });
  const tCat = await getTranslations({ locale, namespace: "Categories.converters" });

  return (
    <ToolLayout
      toolName={tTools("name")}
      toolSlug="fuel-efficiency-converter"
      categoryName={tCat("name")}
      categorySlug="converters"
      description={tTools("description")}
    >
      <FuelEfficiencyConverter />
    </ToolLayout>
  );
}
