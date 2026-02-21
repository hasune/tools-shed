import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const t = await getTranslations("Footer");

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <span className="text-xl">🛠️</span>
              <span className="text-lg font-bold text-white">
                Tools<span className="text-indigo-400">Shed</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm">{t("tagline")}</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">{t("developer")}</h3>
            <ul className="space-y-2">
              {[
                { href: "/developer/json-formatter" as const, label: t("jsonFormatter") },
                { href: "/developer/base64" as const, label: t("base64") },
                { href: "/developer/uuid-generator" as const, label: t("uuidGenerator") },
                { href: "/developer/hash-generator" as const, label: t("hashGenerator") },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">{t("converters")}</h3>
            <ul className="space-y-2">
              {[
                { href: "/converters/length-converter" as const, label: t("length") },
                { href: "/converters/weight-converter" as const, label: t("weight") },
                { href: "/converters/temperature-converter" as const, label: t("temperature") },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">{t("tools")}</h3>
            <ul className="space-y-2">
              {[
                { href: "/health/bmi-calculator" as const, label: t("bmiCalculator") },
                { href: "/text/password-generator" as const, label: t("passwordGenerator") },
                { href: "/time/timezone-converter" as const, label: t("timezoneConverter") },
                { href: "/finance/compound-interest" as const, label: t("compoundInterest") },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            {t("copyright", { year: currentYear })}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              {t("about")}
            </Link>
            <Link href="/privacy" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              {t("privacyPolicy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
