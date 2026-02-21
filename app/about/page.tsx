import type { Metadata } from "next";
import Link from "next/link";
import { categories, tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about ToolsShed — a collection of free, privacy-friendly online tools for developers and professionals.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-white mb-4">About ToolsShed</h1>
      <p className="text-gray-400 text-lg mb-10">
        Free, fast, and privacy-friendly tools — no sign-up, no data collection.
      </p>

      <div className="space-y-10 text-gray-300 leading-relaxed">

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">What is ToolsShed?</h2>
          <p>
            ToolsShed is a growing collection of free online tools for developers, students,
            and professionals. Whether you need to format JSON, convert units, generate a
            password, or calculate compound interest — it&apos;s all here, free, and instant.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">Our Philosophy</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: "🔒",
                title: "Privacy First",
                desc: "Every tool runs entirely in your browser. Nothing you type is ever sent to a server.",
              },
              {
                icon: "⚡",
                title: "No Friction",
                desc: "No sign-up, no account, no paywall. Open the tool and use it instantly.",
              },
              {
                icon: "🌍",
                title: "Built for Everyone",
                desc: "Country-neutral tools that work the same whether you're in New York, London, or Tokyo.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">By the Numbers</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { value: tools.length.toString(), label: "Free tools" },
              { value: categories.length.toString(), label: "Categories" },
              { value: "0", label: "Sign-ups required" },
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-indigo-400">{stat.value}</div>
                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">Tech Stack</h2>
          <p>ToolsShed is built with modern, open-source technologies:</p>
          <ul className="mt-3 space-y-2 text-gray-400">
            <li><span className="text-white">Next.js 16</span> — React framework with static site generation</li>
            <li><span className="text-white">TypeScript</span> — Type-safe code</li>
            <li><span className="text-white">Tailwind CSS</span> — Utility-first styling</li>
            <li><span className="text-white">Vercel</span> — Global edge hosting</li>
            <li><span className="text-white">Giscus</span> — GitHub Discussions-powered comments</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">Open Source</h2>
          <p>
            ToolsShed is open source. Found a bug? Want to suggest a tool? Contributions are welcome.
          </p>
          <a
            href="https://github.com/hasune/tools-shed"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-sm rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            View on GitHub
          </a>
        </section>

      </div>

      <div className="mt-12 pt-6 border-t border-gray-800 flex gap-6">
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
          ← Browse Tools
        </Link>
        <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
