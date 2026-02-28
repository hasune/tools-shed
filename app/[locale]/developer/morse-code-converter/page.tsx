import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ToolLayout from "@/components/ToolLayout";
import MorseCodeConverter from "@/components/tools/MorseCodeConverter";

const BASE_URL = "https://tools-shed.com";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.morse-code-converter" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/developer/morse-code-converter`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${BASE_URL}/${l}/developer/morse-code-converter`])),
    },
    openGraph: { title: t("metaTitle"), description: t("metaDescription"), url: `${BASE_URL}/${locale}/developer/morse-code-converter` , images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolsShed - Free Online Tools" }] },
    twitter: { card: "summary", title: t("metaTitle"), description: t("metaDescription") , images: ["/opengraph-image"] },
  };
}

export default async function MorseCodeConverterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.morse-code-converter" });
  const tCat = await getTranslations({ locale, namespace: "Categories.developer" });
  return (
    <ToolLayout toolName={tTools("name")} toolSlug="morse-code-converter" categoryName={tCat("name")} categorySlug="developer" description={tTools("description")}>
      <MorseCodeConverter />
    </ToolLayout>
  );
}
