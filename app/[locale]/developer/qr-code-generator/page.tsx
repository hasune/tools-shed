import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ToolLayout from "@/components/ToolLayout";
import QrCodeGenerator from "@/components/tools/QrCodeGenerator";

const BASE_URL = "https://tools-shed.com";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.qr-code-generator" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/developer/qr-code-generator`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${BASE_URL}/${l}/developer/qr-code-generator`])),
    },
    openGraph: { title: t("metaTitle"), description: t("metaDescription"), url: `${BASE_URL}/${locale}/developer/qr-code-generator` },
    twitter: { card: "summary", title: t("metaTitle"), description: t("metaDescription") },
  };
}

export default async function QrCodeGeneratorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.qr-code-generator" });
  const tCat = await getTranslations({ locale, namespace: "Categories.developer" });
  return (
    <ToolLayout toolName={tTools("name")} toolSlug="qr-code-generator" categoryName={tCat("name")} categorySlug="developer" description={tTools("description")}>
      <QrCodeGenerator />
    </ToolLayout>
  );
}
