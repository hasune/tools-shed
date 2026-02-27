"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
    .replace(/\s+/g, " ") // Collapse whitespace
    .replace(/\s*([{},;:>~+])\s*/g, "$1") // Remove spaces around symbols
    .replace(/;\}/g, "}") // Remove last semicolon before }
    .replace(/^\s+|\s+$/g, ""); // Trim
}

function beautifyCss(css: string): string {
  // First minify to normalize
  const min = minifyCss(css);
  let result = "";
  let indent = 0;
  let i = 0;

  while (i < min.length) {
    const ch = min[i];
    if (ch === "{") {
      result += " {\n" + "  ".repeat(indent + 1);
      indent++;
    } else if (ch === "}") {
      indent--;
      result = result.trimEnd();
      result += "\n" + "  ".repeat(indent) + "}\n";
      if (indent > 0) result += "  ".repeat(indent);
    } else if (ch === ";") {
      result += ";\n" + "  ".repeat(indent);
    } else if (ch === ",") {
      // Check if it's a selector comma (not in property value)
      result += ",\n" + "  ".repeat(indent);
    } else {
      result += ch;
    }
    i++;
  }

  return result.trim();
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  return `${(n / 1024).toFixed(1)} KB`;
}

export default function CssMinifier() {
  const t = useTranslations("CssMinifier");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const origSize = new Blob([input]).size;
  const outSize = new Blob([output]).size;
  const savings = origSize > 0 ? Math.round(((origSize - outSize) / origSize) * 100) : 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const SAMPLE = `/* Navigation styles */
.nav {
  display: flex;
  align-items: center;
  background-color: #1a1a2e;
  padding: 1rem 2rem;
}

.nav a {
  color: #fff;
  text-decoration: none;
  margin: 0 1rem;
}

.nav a:hover {
  color: #6366f1;
}`;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-300">{t("inputLabel")}</label>
          <button onClick={() => setInput(SAMPLE)} className="text-xs text-indigo-400 hover:text-indigo-300">
            Sample
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("inputPlaceholder")}
          rows={10}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm font-mono focus:outline-none focus:border-indigo-500 resize-y"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setOutput(minifyCss(input))}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {t("minifyButton")}
        </button>
        <button
          onClick={() => setOutput(beautifyCss(input))}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-medium transition-colors"
        >
          {t("beautifyButton")}
        </button>
        <button
          onClick={() => { setInput(""); setOutput(""); }}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-medium transition-colors"
        >
          {t("clearButton")}
        </button>
      </div>

      {output && (
        <div className="space-y-2">
          {origSize > 0 && (
            <div className="flex gap-4 text-sm text-gray-400">
              <span>{t("originalSize")}: {formatBytes(origSize)}</span>
              <span>{t("outputSize")}: {formatBytes(outSize)}</span>
              {savings > 0 && <span className="text-green-400">{t("savings")}: {savings}%</span>}
            </div>
          )}
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-300">{t("outputLabel")}</label>
            <button onClick={handleCopy} className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded">
              {copied ? t("copiedButton") : t("copyButton")}
            </button>
          </div>
          <textarea
            readOnly
            value={output}
            rows={10}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm font-mono resize-y"
          />
        </div>
      )}
    </div>
  );
}
