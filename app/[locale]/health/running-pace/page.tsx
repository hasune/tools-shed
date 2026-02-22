import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ToolLayout from "@/components/ToolLayout";
import RunningPace from "@/components/tools/RunningPace";

const BASE_URL = "https://tools-shed.com";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.running-pace" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/health/running-pace`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}/health/running-pace`])
      ),
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: `${BASE_URL}/${locale}/health/running-pace`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
  };
}

export default async function RunningPacePage({ params }: Props) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.running-pace" });
  const tCat = await getTranslations({ locale, namespace: "Categories.health" });

  return (
    <ToolLayout
      toolName={tTools("name")}
      toolSlug="running-pace"
      categoryName={tCat("name")}
      categorySlug="health"
      description={tTools("description")}
    >
      <RunningPace />
    </ToolLayout>
  );
}
