import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ToolLayout from "@/components/ToolLayout";
import OneRepMaxCalculator from "@/components/tools/OneRepMaxCalculator";
import { routing } from "@/i18n/routing";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.one-rep-max-calculator" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `https://tools-shed.com/${locale}/health/one-rep-max-calculator`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `https://tools-shed.com/${l}/health/one-rep-max-calculator`])
      ),
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: `https://tools-shed.com/${locale}/health/one-rep-max-calculator`,
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

export default async function OneRepMaxCalculatorPage({ params }: Props) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.one-rep-max-calculator" });
  const tCat = await getTranslations({ locale, namespace: "Categories.health" });

  return (
    <ToolLayout
      toolName={tTools("name")}
      toolSlug="one-rep-max-calculator"
      categoryName={tCat("name")}
      categorySlug="health"
      description={tTools("description")}
    >
      <OneRepMaxCalculator />
    </ToolLayout>
  );
}
