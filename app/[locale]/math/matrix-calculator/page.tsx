import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ToolLayout from "@/components/ToolLayout";
import MatrixCalculator from "@/components/tools/MatrixCalculator";

const BASE_URL = "https://tools-shed.com";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.matrix-calculator" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/math/matrix-calculator`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${BASE_URL}/${l}/math/matrix-calculator`])),
    },
    openGraph: { title: t("metaTitle"), description: t("metaDescription"), url: `${BASE_URL}/${locale}/math/matrix-calculator` },
    twitter: { card: "summary", title: t("metaTitle"), description: t("metaDescription") },
  };
}

export default async function MatrixCalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.matrix-calculator" });
  const tCat = await getTranslations({ locale, namespace: "Categories.math" });
  return (
    <ToolLayout toolName={tTools("name")} toolSlug="matrix-calculator" categoryName={tCat("name")} categorySlug="math" description={tTools("description")}>
      <MatrixCalculator />
    </ToolLayout>
  );
}
