import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ToolLayout from "@/components/ToolLayout";
import BusinessDaysCalculator from "@/components/tools/BusinessDaysCalculator";

const BASE_URL = "https://tools-shed.com";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.business-days-calculator" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/time/business-days-calculator`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}/time/business-days-calculator`])
      ),
    },
  };
}

export default async function BusinessDaysCalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.business-days-calculator" });
  const tCat = await getTranslations({ locale, namespace: "Categories.time" });
  return (
    <ToolLayout
      toolName={tTools("name")}
      toolSlug="business-days-calculator"
      categoryName={tCat("name")}
      categorySlug="time"
      description={tTools("description")}
    >
      <BusinessDaysCalculator />
    </ToolLayout>
  );
}
