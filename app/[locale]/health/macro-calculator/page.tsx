import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ToolLayout from "@/components/ToolLayout";
import MacroCalculator from "@/components/tools/MacroCalculator";
import { routing } from "@/i18n/routing";

interface Props { params: Promise<{ locale: string }>; }

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.macro-calculator" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `https://tools-shed.com/${locale}/health/macro-calculator`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `https://tools-shed.com/${l}/health/macro-calculator`])
      ),
    },
    openGraph: { title: t("metaTitle"), description: t("metaDescription"), url: `https://tools-shed.com/${locale}/health/macro-calculator`, type: "website" },
    twitter: { card: "summary_large_image", title: t("metaTitle"), description: t("metaDescription") },
  };
}

export default async function MacroCalculatorPage({ params }: Props) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.macro-calculator" });
  const tCat = await getTranslations({ locale, namespace: "Categories.health" });
  return (
    <ToolLayout toolName={tTools("name")} toolSlug="macro-calculator" categoryName={tCat("name")} categorySlug="health" description={tTools("description")}>
      <MacroCalculator />
    </ToolLayout>
  );
}
