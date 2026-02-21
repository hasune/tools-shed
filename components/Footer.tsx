import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
            <p className="text-gray-400 text-sm">
              Free online tools for developers, students, and professionals worldwide.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Developer</h3>
            <ul className="space-y-2">
              {[
                { href: "/developer/json-formatter", label: "JSON Formatter" },
                { href: "/developer/base64", label: "Base64" },
                { href: "/developer/uuid-generator", label: "UUID Generator" },
                { href: "/developer/hash-generator", label: "Hash Generator" },
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
            <h3 className="text-white font-semibold mb-3 text-sm">Converters</h3>
            <ul className="space-y-2">
              {[
                { href: "/converters/length-converter", label: "Length" },
                { href: "/converters/weight-converter", label: "Weight" },
                { href: "/converters/temperature-converter", label: "Temperature" },
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
            <h3 className="text-white font-semibold mb-3 text-sm">Tools</h3>
            <ul className="space-y-2">
              {[
                { href: "/health/bmi-calculator", label: "BMI Calculator" },
                { href: "/text/password-generator", label: "Password Generator" },
                { href: "/time/timezone-converter", label: "Timezone Converter" },
                { href: "/finance/compound-interest", label: "Compound Interest" },
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
            © {currentYear} ToolsShed. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Free tools, no account required.
          </p>
        </div>
      </div>
    </footer>
  );
}
