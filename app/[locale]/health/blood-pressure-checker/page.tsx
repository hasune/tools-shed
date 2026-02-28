import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ToolLayout from "@/components/ToolLayout";
import BloodPressureChecker from "@/components/tools/BloodPressureChecker";
import { routing } from "@/i18n/routing";

interface Props { params: Promise<{ locale: string }> }

const BASE_URL = "https://tools-shed.com";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.blood-pressure-checker" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/health/blood-pressure-checker`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${BASE_URL}/${l}/health/blood-pressure-checker`])),
    },
    openGraph: { title: t("metaTitle"), description: t("metaDescription"), url: `${BASE_URL}/${locale}/health/blood-pressure-checker`, type: "website" , images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolsShed - Free Online Tools" }] },
    twitter: { card: "summary_large_image", title: t("metaTitle"), description: t("metaDescription") , images: ["/opengraph-image"] },
  };
}

export default async function BloodPressureCheckerPage({ params }: Props) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.blood-pressure-checker" });
  const tCat = await getTranslations({ locale, namespace: "Categories.health" });
  return (
    <ToolLayout toolName={tTools("name")} toolSlug="blood-pressure-checker" categoryName={tCat("name")} categorySlug="health" description={tTools("description")}>
      <BloodPressureChecker />
    </ToolLayout>
  );
}
