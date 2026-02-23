import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ToolLayout from "@/components/ToolLayout";
import PomodoroTimer from "@/components/tools/PomodoroTimer";

const BASE_URL = "https://tools-shed.com";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.pomodoro-timer" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/time/pomodoro-timer`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}/time/pomodoro-timer`])
      ),
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: `${BASE_URL}/${locale}/time/pomodoro-timer`,
    },
    twitter: { card: "summary", title: t("metaTitle"), description: t("metaDescription") },
  };
}

export default async function PomodoroTimerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.pomodoro-timer" });
  const tCat = await getTranslations({ locale, namespace: "Categories.time" });

  return (
    <ToolLayout
      toolName={tTools("name")}
      toolSlug="pomodoro-timer"
      categoryName={tCat("name")}
      categorySlug="time"
      description={tTools("description")}
    >
      <PomodoroTimer />
    </ToolLayout>
  );
}
