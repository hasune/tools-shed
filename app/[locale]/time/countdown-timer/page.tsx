import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ToolLayout from "@/components/ToolLayout";
import CountdownTimer from "@/components/tools/CountdownTimer";

const BASE_URL = "https://tools-shed.com";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.countdown-timer" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/time/countdown-timer`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}/time/countdown-timer`])
      ),
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: `${BASE_URL}/${locale}/time/countdown-timer`,
    },
    twitter: { card: "summary", title: t("metaTitle"), description: t("metaDescription") },
  };
}

export default async function CountdownTimerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.countdown-timer" });
  const tCat = await getTranslations({ locale, namespace: "Categories.time" });

  return (
    <ToolLayout
      toolName={tTools("name")}
      toolSlug="countdown-timer"
      categoryName={tCat("name")}
      categorySlug="time"
      description={tTools("description")}
    >
      <CountdownTimer />
    </ToolLayout>
  );
}
