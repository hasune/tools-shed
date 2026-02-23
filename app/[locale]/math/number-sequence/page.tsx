import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ToolLayout from "@/components/ToolLayout";
import NumberSequence from "@/components/tools/NumberSequence";

const BASE_URL = "https://tools-shed.com";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.number-sequence" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/math/number-sequence`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${BASE_URL}/${l}/math/number-sequence`])),
    },
    openGraph: { title: t("metaTitle"), description: t("metaDescription"), url: `${BASE_URL}/${locale}/math/number-sequence` },
    twitter: { card: "summary", title: t("metaTitle"), description: t("metaDescription") },
  };
}

export default async function NumberSequencePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.number-sequence" });
  const tCat = await getTranslations({ locale, namespace: "Categories.math" });
  return (
    <ToolLayout toolName={tTools("name")} toolSlug="number-sequence" categoryName={tCat("name")} categorySlug="math" description={tTools("description")}>
      <NumberSequence />
    </ToolLayout>
  );
}
