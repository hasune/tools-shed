import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ToolLayout from "@/components/ToolLayout";
import InflationCalculator from "@/components/tools/InflationCalculator";

const BASE_URL = "https://tools-shed.com";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.inflation-calculator" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/finance/inflation-calculator`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${BASE_URL}/${l}/finance/inflation-calculator`])),
    },
    openGraph: { title: t("metaTitle"), description: t("metaDescription"), url: `${BASE_URL}/${locale}/finance/inflation-calculator` },
    twitter: { card: "summary", title: t("metaTitle"), description: t("metaDescription") },
  };
}

export default async function InflationCalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.inflation-calculator" });
  const tCat = await getTranslations({ locale, namespace: "Categories.finance" });
  return (
    <ToolLayout toolName={tTools("name")} toolSlug="inflation-calculator" categoryName={tCat("name")} categorySlug="finance" description={tTools("description")}>
      <InflationCalculator />
    </ToolLayout>
  );
}
