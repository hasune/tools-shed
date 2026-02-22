import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ToolLayout from "@/components/ToolLayout";
import ColorConverter from "@/components/tools/ColorConverter";
import { routing } from "@/i18n/routing";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.color-converter" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `https://tools-shed.com/${locale}/developer/color-converter`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `https://tools-shed.com/${l}/developer/color-converter`])
      ),
    },
  };
}

export default async function ColorConverterPage({ params }: Props) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.color-converter" });
  const tCat = await getTranslations({ locale, namespace: "Categories.developer" });

  return (
    <ToolLayout
      toolName={tTools("name")}
      toolSlug="color-converter"
      categoryName={tCat("name")}
      categorySlug="developer"
      description={tTools("description")}
    >
      <ColorConverter />
    </ToolLayout>
  );
}
