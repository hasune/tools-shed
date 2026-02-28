import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ToolLayout from "@/components/ToolLayout";
import YearProgress from "@/components/tools/YearProgress";

const BASE_URL = "https://tools-shed.com";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.year-progress" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/time/year-progress`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${BASE_URL}/${l}/time/year-progress`])),
    },
    openGraph: { title: t("metaTitle"), description: t("metaDescription"), url: `${BASE_URL}/${locale}/time/year-progress` , images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolsShed - Free Online Tools" }] },
    twitter: { card: "summary", title: t("metaTitle"), description: t("metaDescription") , images: ["/opengraph-image"] },
  };
}

export default async function YearProgressPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.year-progress" });
  const tCat = await getTranslations({ locale, namespace: "Categories.time" });
  return (
    <ToolLayout toolName={tTools("name")} toolSlug="year-progress" categoryName={tCat("name")} categorySlug="time" description={tTools("description")}>
      <YearProgress />
    </ToolLayout>
  );
}
