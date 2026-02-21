import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCategoryBySlug, categories } from "@/lib/tools";
import { routing } from "@/i18n/routing";

interface Props {
  params: Promise<{ locale: string; category: string }>;
}

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    categories.map((c) => ({ locale, category: c.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) return {};
  const t = await getTranslations({ locale, namespace: "Categories" });
  return {
    title: t(`${categorySlug}.name` as Parameters<typeof t>[0]),
    description: t(`${categorySlug}.description` as Parameters<typeof t>[0]),
    alternates: {
      canonical: `https://tools-shed.com/${locale}/${categorySlug}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `https://tools-shed.com/${l}/${categorySlug}`])
      ),
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { locale, category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const t = await getTranslations({ locale, namespace: "Categories" });
  const tTools = await getTranslations({ locale, namespace: "Tools" });
  const tLayout = await getTranslations({ locale, namespace: "ToolLayout" });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            {tLayout("home")}
          </Link>
          <span>/</span>
          <span className="text-gray-300">{t(`${categorySlug}.name` as Parameters<typeof t>[0])}</span>
        </nav>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{category.icon}</span>
          <div>
            <h1 className="text-3xl font-bold text-white">{t(`${categorySlug}.name` as Parameters<typeof t>[0])}</h1>
            <p className="text-gray-400 mt-1">{t(`${categorySlug}.description` as Parameters<typeof t>[0])}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {category.tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${tool.categorySlug}/${tool.slug}` as Parameters<typeof Link>[0]["href"]}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-indigo-500/60 hover:bg-gray-800/50 transition-all group"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl font-mono bg-gray-800 group-hover:bg-gray-700 rounded-lg w-10 h-10 flex items-center justify-center text-sm flex-shrink-0 transition-colors">
                {tool.icon}
              </span>
              <div>
                <h2 className="text-white font-semibold group-hover:text-indigo-400 transition-colors">
                  {tTools(`${tool.slug}.name` as Parameters<typeof tTools>[0])}
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  {tTools(`${tool.slug}.description` as Parameters<typeof tTools>[0])}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
