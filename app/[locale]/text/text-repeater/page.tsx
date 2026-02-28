import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ToolLayout from "@/components/ToolLayout";
import TextRepeater from "@/components/tools/TextRepeater";
import { routing } from "@/i18n/routing";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.text-repeater" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `https://tools-shed.com/${locale}/text/text-repeater`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `https://tools-shed.com/${l}/text/text-repeater`])
      ),
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: `https://tools-shed.com/${locale}/text/text-repeater`,
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolsShed - Free Online Tools" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
      images: ["/opengraph-image"],
    },
  };
}

export default async function TextRepeaterPage({ params }: Props) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.text-repeater" });
  const tCat = await getTranslations({ locale, namespace: "Categories.text" });

  return (
    <ToolLayout
      toolName={tTools("name")}
      toolSlug="text-repeater"
      categoryName={tCat("name")}
      categorySlug="text"
      description={tTools("description")}
    >
      <TextRepeater />
    </ToolLayout>
  );
}
