import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { categories, tools } from "@/lib/tools";
import { routing } from "@/i18n/routing";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage.metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });

  const languages: Record<string, string> = {};
  routing.locales.forEach((l) => {
    languages[l] = `https://tools-shed.com/${l}/about`;
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-white mb-4">{t("title")}</h1>
      <p className="text-gray-400 text-lg mb-10">{t("subtitle")}</p>

      <div className="space-y-10 text-gray-300 leading-relaxed">

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">{t("whatIsTitle")}</h2>
          <p>{t("whatIsText")}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">{t("philosophyTitle")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: "🔒", titleKey: "privacyFirstTitle", descKey: "privacyFirstDesc" },
              { icon: "⚡", titleKey: "noFrictionTitle", descKey: "noFrictionDesc" },
              { icon: "🌍", titleKey: "builtForEveryoneTitle", descKey: "builtForEveryoneDesc" },
            ].map((item) => (
              <div key={item.titleKey} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="text-white font-semibold mb-1">{t(item.titleKey as Parameters<typeof t>[0])}</h3>
                <p className="text-gray-400 text-sm">{t(item.descKey as Parameters<typeof t>[0])}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">{t("byTheNumbersTitle")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { value: tools.length.toString(), labelKey: "freeToolsLabel" },
              { value: categories.length.toString(), labelKey: "categoriesLabel" },
              { value: "0", labelKey: "signUpsLabel" },
            ].map((stat) => (
              <div key={stat.labelKey} className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-indigo-400">{stat.value}</div>
                <div className="text-gray-500 text-sm mt-1">{t(stat.labelKey as Parameters<typeof t>[0])}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">{t("techStackTitle")}</h2>
          <p>{t("techStackText")}</p>
          <ul className="mt-3 space-y-2 text-gray-400">
            <li><span className="text-white">Next.js 16</span> — {t("techNext").replace("Next.js 16 — ", "")}</li>
            <li><span className="text-white">TypeScript</span> — {t("techTs").replace("TypeScript — ", "")}</li>
            <li><span className="text-white">Tailwind CSS</span> — {t("techTailwind").replace("Tailwind CSS — ", "")}</li>
            <li><span className="text-white">Vercel</span> — {t("techVercel").replace("Vercel — ", "")}</li>
            <li><span className="text-white">Giscus</span> — {t("techGiscus").replace("Giscus — ", "")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">{t("openSourceTitle")}</h2>
          <p>{t("openSourceText")}</p>
          <a
            href="https://github.com/hasune/tools-shed"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-sm rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            {t("viewOnGitHub")}
          </a>
        </section>

      </div>

      <div className="mt-12 pt-6 border-t border-gray-800 flex gap-6">
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
          {t("browseTools")}
        </Link>
        <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
          {t("privacyPolicy")}
        </Link>
      </div>
    </div>
  );
}
