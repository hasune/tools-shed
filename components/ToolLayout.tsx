import Link from "next/link";
import AdSlot from "./AdSlot";
import GiscusComments from "./GiscusComments";

interface ToolLayoutProps {
  toolName: string;
  toolSlug: string;
  categoryName: string;
  categorySlug: string;
  description: string;
  children: React.ReactNode;
}

export default function ToolLayout({
  toolName,
  toolSlug,
  categoryName,
  categorySlug,
  description,
  children,
}: ToolLayoutProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: toolName,
    description: description,
    url: `https://tools-shed.com/${categorySlug}/${toolSlug}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    provider: {
      "@type": "Organization",
      name: "ToolsShed",
      url: "https://tools-shed.com",
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-300 transition-colors">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href={`/${categorySlug}`} className="hover:text-gray-300 transition-colors">
          {categoryName}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-gray-300" aria-current="page">{toolName}</span>
      </nav>

      {/* Tool Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-3">{toolName}</h1>
        <p className="text-gray-400 text-lg">{description}</p>
      </div>

      {/* Top Ad */}
      <div className="mb-8">
        <AdSlot slot="1234567890" format="leaderboard" />
      </div>

      {/* Tool Content */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
        {children}
      </div>

      {/* Bottom Ad */}
      <div className="mb-8">
        <AdSlot slot="0987654321" format="rectangle" />
      </div>

      {/* Giscus Comments */}
      <GiscusComments term={toolSlug} />
    </div>
  );
}
