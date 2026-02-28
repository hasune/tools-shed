import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ToolLayout from "@/components/ToolLayout";
import PaceConverter from "@/components/tools/PaceConverter";

const BASE_URL = "https://tools-shed.com";
const SLUG = "pace-converter";
const CATEGORY_SLUG = "converters";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: `Tools.${SLUG}` });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/${CATEGORY_SLUG}/${SLUG}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}/${CATEGORY_SLUG}/${SLUG}`])
      ),
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: `${BASE_URL}/${locale}/${CATEGORY_SLUG}/${SLUG}`,
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

export default async function PaceConverterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: `Tools.${SLUG}` });
  const tCat = await getTranslations({ locale, namespace: `Categories.${CATEGORY_SLUG}` });

  return (
    <ToolLayout
      toolName={tTools("name")}
      toolSlug={SLUG}
      categoryName={tCat("name")}
      categorySlug={CATEGORY_SLUG}
      description={tTools("description")}
    >
      <PaceConverter />
    </ToolLayout>
  );
}
