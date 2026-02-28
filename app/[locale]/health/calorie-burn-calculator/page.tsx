import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ToolLayout from "@/components/ToolLayout";
import CalorieBurnCalculator from "@/components/tools/CalorieBurnCalculator";

const BASE_URL = "https://tools-shed.com";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.calorie-burn-calculator" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/health/calorie-burn-calculator`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}/health/calorie-burn-calculator`])
      ),
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: `${BASE_URL}/${locale}/health/calorie-burn-calculator`,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolsShed - Free Online Tools" }],
    },
    twitter: { card: "summary", title: t("metaTitle"), description: t("metaDescription") , images: ["/opengraph-image"] },
  };
}

export default async function CalorieBurnCalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.calorie-burn-calculator" });
  const tCat = await getTranslations({ locale, namespace: "Categories.health" });

  return (
    <ToolLayout
      toolName={tTools("name")}
      toolSlug="calorie-burn-calculator"
      categoryName={tCat("name")}
      categorySlug="health"
      description={tTools("description")}
    >
      <CalorieBurnCalculator />
    </ToolLayout>
  );
}
