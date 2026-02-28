import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ToolLayout from "@/components/ToolLayout";
import WordFrequencyCounter from "@/components/tools/WordFrequencyCounter";

const BASE_URL = "https://tools-shed.com";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.word-frequency-counter" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/text/word-frequency-counter`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${BASE_URL}/${l}/text/word-frequency-counter`])),
    },
    openGraph: { title: t("metaTitle"), description: t("metaDescription"), url: `${BASE_URL}/${locale}/text/word-frequency-counter` , images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolsShed - Free Online Tools" }] },
    twitter: { card: "summary", title: t("metaTitle"), description: t("metaDescription") , images: ["/opengraph-image"] },
  };
}

export default async function WordFrequencyCounterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.word-frequency-counter" });
  const tCat = await getTranslations({ locale, namespace: "Categories.text" });
  return (
    <ToolLayout toolName={tTools("name")} toolSlug="word-frequency-counter" categoryName={tCat("name")} categorySlug="text" description={tTools("description")}>
      <WordFrequencyCounter />
    </ToolLayout>
  );
}
