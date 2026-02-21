import Link from "next/link";
import { categories } from "@/lib/tools";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-950 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Free Online Tools for{" "}
            <span className="text-indigo-400">Everyone</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            A collection of useful, privacy-friendly tools. No sign-up required.
            Works in your browser, instantly.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-gray-500">
            <span className="bg-gray-800 px-3 py-1 rounded-full">No registration</span>
            <span className="bg-gray-800 px-3 py-1 rounded-full">No data sent to server</span>
            <span className="bg-gray-800 px-3 py-1 rounded-full">Always free</span>
          </div>
        </div>
      </section>

      {/* Popular Tools Quick Access */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Popular Tools
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              { href: "/developer/json-formatter", label: "JSON Formatter" },
              { href: "/developer/base64", label: "Base64" },
              { href: "/developer/uuid-generator", label: "UUID Generator" },
              { href: "/developer/hash-generator", label: "Hash Generator" },
              { href: "/developer/jwt-decoder", label: "JWT Decoder" },
              { href: "/text/password-generator", label: "Password Generator" },
              { href: "/health/bmi-calculator", label: "BMI Calculator" },
              { href: "/converters/temperature-converter", label: "Temperature" },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-indigo-500 text-gray-300 hover:text-white text-sm px-4 py-2 rounded-lg transition-all"
              >
                {tool.label}
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
                      href={`/${category.slug}`}
                      className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors"
                    >
                      {category.name}
                    </Link>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4">{category.description}</p>

                <ul className="space-y-2">
                  {category.tools.slice(0, 4).map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={`/${tool.categorySlug}/${tool.slug}`}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-400 transition-colors py-1"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 flex-shrink-0" />
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                  {category.tools.length > 4 && (
                    <li>
                      <Link
                        href={`/${category.slug}`}
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
          <h2 className="text-2xl font-bold text-white mb-8">Why ToolsShed?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: "🔒",
                title: "Privacy First",
                desc: "All calculations run in your browser. No data is ever sent to our servers.",
              },
              {
                icon: "⚡",
                title: "Instant Results",
                desc: "No loading spinners. Results appear as you type with zero server roundtrips.",
              },
              {
                icon: "🌍",
                title: "Works Everywhere",
                desc: "Mobile-friendly, no installation required. Just open and use.",
              },
            ].map((item) => (
              <div key={item.title} className="p-6 bg-gray-800 rounded-xl">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
