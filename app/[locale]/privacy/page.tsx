import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PrivacyPage.metadata" });
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: true, follow: true },
  };
}

const LAST_UPDATED = "February 21, 2026";

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PrivacyPage" });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">{t("title")}</h1>
      <p className="text-gray-500 text-sm mb-10">{t("lastUpdated", { date: LAST_UPDATED })}</p>

      <div className="prose prose-invert max-w-none space-y-8 text-gray-300 leading-relaxed">

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">{t("overviewTitle")}</h2>
          <p>
            {t("overviewText1").split("tools-shed.com")[0]}
            <a href="https://tools-shed.com" className="text-indigo-400 hover:underline">tools-shed.com</a>
            {t("overviewText1").split("tools-shed.com")[1]}
          </p>
          <p className="mt-3">
            <strong className="text-white">{t("shortVersionLabel")}</strong>{" "}
            {t("overviewText2").replace(t("shortVersionLabel") + " ", "")}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">{t("noCollectTitle")}</h2>
          <p>{t("noCollectText")}</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
            <li>{t("noCollectItem1")}</li>
            <li>{t("noCollectItem2")}</li>
            <li>{t("noCollectItem3")}</li>
            <li>{t("noCollectItem4")}</li>
            <li>{t("noCollectItem5")}</li>
          </ul>
          <p className="mt-3">{t("noCollectFooter")}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">{t("analyticsTitle")}</h2>
          <p>{t("analyticsText1")}</p>
          <p className="mt-3">{t("analyticsText2")}</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
            <li>{t("analyticsItem1")}</li>
            <li>{t("analyticsItem2")}</li>
            <li>{t("analyticsItem3")}</li>
            <li>{t("analyticsItem4")}</li>
          </ul>
          <p className="mt-3">
            {t("analyticsOptOut")}{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
              {t("analyticsOptOutLink")}
            </a>.
          </p>
          <p className="mt-3">
            {t("analyticsPrivacy")}{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
              {t("analyticsPrivacyLink")}
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">{t("adsenseTitle")}</h2>
          <p>{t("adsenseText1")}</p>
          <p className="mt-3">
            {t("adsenseText2")}{" "}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
              {t("adsenseOptOutLink")}
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">{t("commentsTitle")}</h2>
          <p>{t("commentsText1")}</p>
          <p className="mt-3">
            {t("commentsText2")}{" "}
            <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
              {t("commentsPrivacyLink")}
            </a>{" "}
            {t("commentsText3")}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">{t("cookiesTitle")}</h2>
          <p>{t("cookiesText")}</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm border border-gray-700 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-800">
                  <th className="text-left px-4 py-2 text-gray-300">{t("cookieColName")}</th>
                  <th className="text-left px-4 py-2 text-gray-300">{t("cookieColPurpose")}</th>
                  <th className="text-left px-4 py-2 text-gray-300">{t("cookieColProvider")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <tr className="bg-gray-900">
                  <td className="px-4 py-2 font-mono text-gray-400">{t("cookie1Name")}</td>
                  <td className="px-4 py-2 text-gray-400">{t("cookie1Purpose")}</td>
                  <td className="px-4 py-2 text-gray-400">{t("cookie1Provider")}</td>
                </tr>
                <tr className="bg-gray-900">
                  <td className="px-4 py-2 font-mono text-gray-400">{t("cookie2Name")}</td>
                  <td className="px-4 py-2 text-gray-400">{t("cookie2Purpose")}</td>
                  <td className="px-4 py-2 text-gray-400">{t("cookie2Provider")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">{t("thirdPartyTitle")}</h2>
          <p>{t("thirdPartyText")}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">{t("childrenTitle")}</h2>
          <p>{t("childrenText")}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">{t("changesTitle")}</h2>
          <p>{t("changesText")}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">{t("contactTitle")}</h2>
          <p>
            {t("contactText1")}{" "}
            <a href="https://github.com/hasune/tools-shed" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
              {t("contactLink")}
            </a>.
          </p>
        </section>

      </div>

      <div className="mt-12 pt-6 border-t border-gray-800">
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
          {t("backToTools")}
        </Link>
      </div>
    </div>
  );
}
