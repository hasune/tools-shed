import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ToolLayout from "@/components/ToolLayout";
import JsonToTypescript from "@/components/tools/JsonToTypescript";

const BASE_URL = "https://tools-shed.com";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.json-to-typescript" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/developer/json-to-typescript`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}/developer/json-to-typescript`])
      ),
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: `${BASE_URL}/${locale}/developer/json-to-typescript`,
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

export default async function JsonToTypescriptPage({ params }: Props) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.json-to-typescript" });
  const tCat = await getTranslations({ locale, namespace: "Categories.developer" });

  return (
    <ToolLayout
      toolName={tTools("name")}
      toolSlug="json-to-typescript"
      categoryName={tCat("name")}
      categorySlug="developer"
      description={tTools("description")}
    >
      <JsonToTypescript />
    </ToolLayout>
  );
}
