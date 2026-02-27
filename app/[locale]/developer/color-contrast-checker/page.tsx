import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ToolLayout from "@/components/ToolLayout";
import ColorContrastChecker from "@/components/tools/ColorContrastChecker";

const BASE_URL = "https://tools-shed.com";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.color-contrast-checker" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/developer/color-contrast-checker`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}/developer/color-contrast-checker`])
      ),
    },
  };
}

export default async function ColorContrastCheckerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.color-contrast-checker" });
  const tCat = await getTranslations({ locale, namespace: "Categories.developer" });
  return (
    <ToolLayout
      toolName={tTools("name")}
      toolSlug="color-contrast-checker"
      categoryName={tCat("name")}
      categorySlug="developer"
      description={tTools("description")}
    >
      <ColorContrastChecker />
    </ToolLayout>
  );
}
