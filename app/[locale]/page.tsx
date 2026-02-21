import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { categories } from "@/lib/tools";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HomePage" });
  const tCat = await getTranslations({ locale, namespace: "Categories" });
  const tTools = await getTranslations({ locale, namespace: "Tools" });

  const popularTools = [
    { href: "/developer/json-formatter", slug: "json-formatter" },
    { href: "/developer/base64", slug: "base64" },
    { href: "/developer/uuid-generator", slug: "uuid-generator" },
    { href: "/developer/hash-generator", slug: "hash-generator" },
    { href: "/developer/jwt-decoder", slug: "jwt-decoder" },
    { href: "/text/password-generator", slug: "password-generator" },
    { href: "/health/bmi-calculator", slug: "bmi-calculator" },
    { href: "/converters/temperature-converter", slug: "temperature-converter" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-950 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {t("heroTitle")}{" "}
            <span className="text-indigo-400">{t("heroTitleHighlight")}</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            {t("heroSubtitle")}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-gray-500">
            <span className="bg-gray-800 px-3 py-1 rounded-full">{t("noRegistration")}</span>
            <span className="bg-gray-800 px-3 py-1 rounded-full">{t("noDataSent")}</span>
            <span className="bg-gray-800 px-3 py-1 rounded-full">{t("alwaysFree")}</span>
          </div>
        </div>
      </section>

      {/* Popular Tools Quick Access */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            {t("popularTools")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {popularTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href as Parameters<typeof Link>[0]["href"]}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-indigo-500 text-gray-300 hover:text-white text-sm px-4 py-2 rounded-lg transition-all"
              >
                {tTools(`${tool.slug}.name`)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.slug}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <Link
                      href={`/${category.slug}` as Parameters<typeof Link>[0]["href"]}
                      className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors"
                    >
                      {tCat(`${category.slug}.name`)}
                    </Link>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4">{tCat(`${category.slug}.description`)}</p>

                <ul className="space-y-2">
                  {category.tools.slice(0, 4).map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={`/${tool.categorySlug}/${tool.slug}` as Parameters<typeof Link>[0]["href"]}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-400 transition-colors py-1"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 flex-shrink-0" />
                        {tTools(`${tool.slug}.name`)}
                      </Link>
                    </li>
                  ))}
                  {category.tools.length > 4 && (
                    <li>
                      <Link
                        href={`/${category.slug}` as Parameters<typeof Link>[0]["href"]}
                        className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        +{category.tools.length - 4} more →
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why ToolsShed */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-8">{t("whyTitle")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: "🔒", titleKey: "privacyFirstTitle", descKey: "privacyFirstDesc" },
              { icon: "⚡", titleKey: "instantResultsTitle", descKey: "instantResultsDesc" },
              { icon: "🌍", titleKey: "worksEverywhereTitle", descKey: "worksEverywhereDesc" },
            ].map((item) => (
              <div key={item.titleKey} className="p-6 bg-gray-800 rounded-xl">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-white font-semibold mb-2">{t(item.titleKey as Parameters<typeof t>[0])}</h3>
                <p className="text-gray-400 text-sm">{t(item.descKey as Parameters<typeof t>[0])}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
