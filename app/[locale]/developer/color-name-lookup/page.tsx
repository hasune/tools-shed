import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ToolLayout from "@/components/ToolLayout";
import ColorNameLookup from "@/components/tools/ColorNameLookup";

const BASE_URL = "https://tools-shed.com";
const SLUG = "color-name-lookup";
const CATEGORY_SLUG = "developer";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: `Tools.${SLUG}` });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/${CATEGORY_SLUG}/${SLUG}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${BASE_URL}/${l}/${CATEGORY_SLUG}/${SLUG}`])),
    },
  };
}

export default async function ColorNameLookupPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: `Tools.${SLUG}` });
  const tCat = await getTranslations({ locale, namespace: `Categories.${CATEGORY_SLUG}` });
  return (
    <ToolLayout toolName={tTools("name")} toolSlug={SLUG} categoryName={tCat("name")} categorySlug={CATEGORY_SLUG} description={tTools("description")}>
      <ColorNameLookup />
    </ToolLayout>
  );
}
