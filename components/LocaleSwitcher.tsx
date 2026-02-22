"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useTransition } from "react";

const LOCALE_LABELS: Record<string, string> = {
  en: "English",
  ja: "日本語",
  ko: "한국어",
  "zh-CN": "中文",
  es: "Español",
  "pt-BR": "Português",
  fr: "Français",
  de: "Deutsch",
  ru: "Русский",
  it: "Italiano",
  tr: "Türkçe",
  id: "Indonesia",
};

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const currentLocale = (params.locale as string) || routing.defaultLocale;

  const handleChange = (nextLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="relative">
      <select
        value={currentLocale}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isPending}
        aria-label={t("label")}
        className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500 cursor-pointer hover:border-gray-600 transition-colors disabled:opacity-50"
      >
        {routing.locales.map((locale) => (
          <option key={locale} value={locale}>
            {LOCALE_LABELS[locale] ?? locale}
          </option>
        ))}
      </select>
    </div>
  );
}
