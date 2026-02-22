import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ToolLayout from "@/components/ToolLayout";
import UnixTimestamp from "@/components/tools/UnixTimestamp";
import { routing } from "@/i18n/routing";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.unix-timestamp" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `https://tools-shed.com/${locale}/time/unix-timestamp`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `https://tools-shed.com/${l}/time/unix-timestamp`])
      ),
    },
  };
}

export default async function UnixTimestampPage({ params }: Props) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.unix-timestamp" });
  const tCat = await getTranslations({ locale, namespace: "Categories.time" });

  return (
    <ToolLayout
      toolName={tTools("name")}
      toolSlug="unix-timestamp"
      categoryName={tCat("name")}
      categorySlug="time"
      description={tTools("description")}
    >
      <UnixTimestamp />
    </ToolLayout>
  );
}
