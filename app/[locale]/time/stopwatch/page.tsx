import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ToolLayout from "@/components/ToolLayout";
import Stopwatch from "@/components/tools/Stopwatch";

const BASE_URL = "https://tools-shed.com";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.stopwatch" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/time/stopwatch`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}/time/stopwatch`])
      ),
    },
  };
}

export default async function StopwatchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.stopwatch" });
  const tCat = await getTranslations({ locale, namespace: "Categories.time" });
  return (
    <ToolLayout
      toolName={tTools("name")}
      toolSlug="stopwatch"
      categoryName={tCat("name")}
      categorySlug="time"
      description={tTools("description")}
    >
      <Stopwatch />
    </ToolLayout>
  );
}
