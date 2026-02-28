import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ToolLayout from "@/components/ToolLayout";
import NetWorthCalculator from "@/components/tools/NetWorthCalculator";
import { routing } from "@/i18n/routing";

interface Props { params: Promise<{ locale: string }> }

const BASE_URL = "https://tools-shed.com";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.net-worth-calculator" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/finance/net-worth-calculator`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${BASE_URL}/${l}/finance/net-worth-calculator`])),
    },
    openGraph: { title: t("metaTitle"), description: t("metaDescription"), url: `${BASE_URL}/${locale}/finance/net-worth-calculator`, type: "website" , images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolsShed - Free Online Tools" }] },
    twitter: { card: "summary_large_image", title: t("metaTitle"), description: t("metaDescription") , images: ["/opengraph-image"] },
  };
}

export default async function NetWorthCalculatorPage({ params }: Props) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.net-worth-calculator" });
  const tCat = await getTranslations({ locale, namespace: "Categories.finance" });
  return (
    <ToolLayout toolName={tTools("name")} toolSlug="net-worth-calculator" categoryName={tCat("name")} categorySlug="finance" description={tTools("description")}>
      <NetWorthCalculator />
    </ToolLayout>
  );
}
