"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LocaleSwitcher from "./LocaleSwitcher";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations("Header");

  const navLinks = [
    { href: "/developer" as const, labelKey: "developer" as const },
    { href: "/converters" as const, labelKey: "converters" as const },
    { href: "/text" as const, labelKey: "text" as const },
    { href: "/finance" as const, labelKey: "finance" as const },
    { href: "/health" as const, labelKey: "health" as const },
    { href: "/time" as const, labelKey: "time" as const },
  ];

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🛠️</span>
            <span className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
              Tools<span className="text-indigo-400">Shed</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                {t(link.labelKey)}
              </Link>
            ))}
            <LocaleSwitcher />
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={t("toggleMenu")}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 hover:text-white text-sm py-1 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {t(link.labelKey)}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-800">
                <LocaleSwitcher />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
