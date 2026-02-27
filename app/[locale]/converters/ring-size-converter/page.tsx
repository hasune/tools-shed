import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ToolLayout from "@/components/ToolLayout";
import RingSizeConverter from "@/components/tools/RingSizeConverter";

const BASE_URL = "https://tools-shed.com";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.ring-size-converter" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/converters/ring-size-converter`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}/converters/ring-size-converter`])
      ),
    },
  };
}

export default async function RingSizeConverterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.ring-size-converter" });
  const tCat = await getTranslations({ locale, namespace: "Categories.converters" });
  return (
    <ToolLayout
      toolName={tTools("name")}
      toolSlug="ring-size-converter"
      categoryName={tCat("name")}
      categorySlug="converters"
      description={tTools("description")}
    >
      <RingSizeConverter />
    </ToolLayout>
  );
}
