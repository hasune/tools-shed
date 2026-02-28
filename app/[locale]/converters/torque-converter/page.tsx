import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ToolLayout from "@/components/ToolLayout";
import TorqueConverter from "@/components/tools/TorqueConverter";
import { routing } from "@/i18n/routing";

interface Props { params: Promise<{ locale: string }>; }

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.torque-converter" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `https://tools-shed.com/${locale}/converters/torque-converter`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `https://tools-shed.com/${l}/converters/torque-converter`])
      ),
    },
    openGraph: { title: t("metaTitle"), description: t("metaDescription"), url: `https://tools-shed.com/${locale}/converters/torque-converter`, type: "website" , images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolsShed - Free Online Tools" }] },
    twitter: { card: "summary_large_image", title: t("metaTitle"), description: t("metaDescription") , images: ["/opengraph-image"] },
  };
}

export default async function TorqueConverterPage({ params }: Props) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.torque-converter" });
  const tCat = await getTranslations({ locale, namespace: "Categories.converters" });
  return (
    <ToolLayout toolName={tTools("name")} toolSlug="torque-converter" categoryName={tCat("name")} categorySlug="converters" description={tTools("description")}>
      <TorqueConverter />
    </ToolLayout>
  );
}
