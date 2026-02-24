import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ToolLayout from "@/components/ToolLayout";
import PalindromeChecker from "@/components/tools/PalindromeChecker";
import { routing } from "@/i18n/routing";

interface Props { params: Promise<{ locale: string }> }

const BASE_URL = "https://tools-shed.com";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.palindrome-checker" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/text/palindrome-checker`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${BASE_URL}/${l}/text/palindrome-checker`])),
    },
    openGraph: { title: t("metaTitle"), description: t("metaDescription"), url: `${BASE_URL}/${locale}/text/palindrome-checker`, type: "website" },
    twitter: { card: "summary_large_image", title: t("metaTitle"), description: t("metaDescription") },
  };
}

export default async function PalindromeCheckerPage({ params }: Props) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.palindrome-checker" });
  const tCat = await getTranslations({ locale, namespace: "Categories.text" });
  return (
    <ToolLayout toolName={tTools("name")} toolSlug="palindrome-checker" categoryName={tCat("name")} categorySlug="text" description={tTools("description")}>
      <PalindromeChecker />
    </ToolLayout>
  );
}
