import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ToolLayout from "@/components/ToolLayout";
import UnitConverter from "@/components/tools/UnitConverter";
import { routing } from "@/i18n/routing";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.pressure-converter" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `https://tools-shed.com/${locale}/converters/pressure-converter`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `https://tools-shed.com/${l}/converters/pressure-converter`])
      ),
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: `https://tools-shed.com/${locale}/converters/pressure-converter`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
  };
}

export default async function PressureConverterPage({ params }: Props) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.pressure-converter" });
  const tCat = await getTranslations({ locale, namespace: "Categories.converters" });

  return (
    <ToolLayout
      toolName={tTools("name")}
      toolSlug="pressure-converter"
      categoryName={tCat("name")}
      categorySlug="converters"
      description={tTools("description")}
    >
      <UnitConverter type="pressure" />
    </ToolLayout>
  );
}
