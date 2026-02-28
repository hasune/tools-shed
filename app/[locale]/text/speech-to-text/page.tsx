import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ToolLayout from "@/components/ToolLayout";
import SpeechToText from "@/components/tools/SpeechToText";
import { routing } from "@/i18n/routing";

interface Props { params: Promise<{ locale: string }>; }

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.speech-to-text" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `https://tools-shed.com/${locale}/text/speech-to-text`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `https://tools-shed.com/${l}/text/speech-to-text`])
      ),
    },
    openGraph: { title: t("metaTitle"), description: t("metaDescription"), url: `https://tools-shed.com/${locale}/text/speech-to-text`, type: "website" , images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolsShed - Free Online Tools" }] },
    twitter: { card: "summary_large_image", title: t("metaTitle"), description: t("metaDescription") , images: ["/opengraph-image"] },
  };
}

export default async function SpeechToTextPage({ params }: Props) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.speech-to-text" });
  const tCat = await getTranslations({ locale, namespace: "Categories.text" });
  return (
    <ToolLayout toolName={tTools("name")} toolSlug="speech-to-text" categoryName={tCat("name")} categorySlug="text" description={tTools("description")}>
      <SpeechToText />
    </ToolLayout>
  );
}
