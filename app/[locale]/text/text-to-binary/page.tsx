import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ToolLayout from "@/components/ToolLayout";
import TextToBinary from "@/components/tools/TextToBinary";

const BASE_URL = "https://tools-shed.com";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.text-to-binary" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/text/text-to-binary`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}/text/text-to-binary`])
      ),
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: `${BASE_URL}/${locale}/text/text-to-binary`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
  };
}

export default async function TextToBinaryPage({ params }: Props) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.text-to-binary" });
  const tCat = await getTranslations({ locale, namespace: "Categories.text" });

  return (
    <ToolLayout
      toolName={tTools("name")}
      toolSlug="text-to-binary"
      categoryName={tCat("name")}
      categorySlug="text"
      description={tTools("description")}
    >
      <TextToBinary />
    </ToolLayout>
  );
}
