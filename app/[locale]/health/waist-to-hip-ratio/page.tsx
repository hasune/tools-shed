import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ToolLayout from "@/components/ToolLayout";
import WaistToHipRatio from "@/components/tools/WaistToHipRatio";

const BASE_URL = "https://tools-shed.com";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.waist-to-hip-ratio" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/health/waist-to-hip-ratio`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}/health/waist-to-hip-ratio`])
      ),
    },
  };
}

export default async function WaistToHipRatioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.waist-to-hip-ratio" });
  const tCat = await getTranslations({ locale, namespace: "Categories.health" });
  return (
    <ToolLayout
      toolName={tTools("name")}
      toolSlug="waist-to-hip-ratio"
      categoryName={tCat("name")}
      categorySlug="health"
      description={tTools("description")}
    >
      <WaistToHipRatio />
    </ToolLayout>
  );
}
