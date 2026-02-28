import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ToolLayout from "@/components/ToolLayout";
import TextToSpeech from "@/components/tools/TextToSpeech";

const BASE_URL = "https://tools-shed.com";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.text-to-speech" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/text/text-to-speech`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${BASE_URL}/${l}/text/text-to-speech`])),
    },
    openGraph: { title: t("metaTitle"), description: t("metaDescription"), url: `${BASE_URL}/${locale}/text/text-to-speech` , images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolsShed - Free Online Tools" }] },
    twitter: { card: "summary", title: t("metaTitle"), description: t("metaDescription") , images: ["/opengraph-image"] },
  };
}

export default async function TextToSpeechPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.text-to-speech" });
  const tCat = await getTranslations({ locale, namespace: "Categories.text" });
  return (
    <ToolLayout toolName={tTools("name")} toolSlug="text-to-speech" categoryName={tCat("name")} categorySlug="text" description={tTools("description")}>
      <TextToSpeech />
    </ToolLayout>
  );
}
