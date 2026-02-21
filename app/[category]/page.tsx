import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCategoryBySlug, categories } from "@/lib/tools";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-300">{category.name}</span>
        </nav>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{category.icon}</span>
          <div>
            <h1 className="text-3xl font-bold text-white">{category.name}</h1>
            <p className="text-gray-400 mt-1">{category.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {category.tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${tool.categorySlug}/${tool.slug}`}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-indigo-500/60 hover:bg-gray-800/50 transition-all group"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl font-mono bg-gray-800 group-hover:bg-gray-700 rounded-lg w-10 h-10 flex items-center justify-center text-sm flex-shrink-0 transition-colors">
                {tool.icon}
              </span>
              <div>
                <h2 className="text-white font-semibold group-hover:text-indigo-400 transition-colors">
                  {tool.name}
                </h2>
                <p className="text-gray-400 text-sm mt-1">{tool.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
