"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

function toSlug(text: string, separator: string, lowercase: boolean): string {
  let result = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (lowercase) result = result.toLowerCase();
  result = result.replace(/[^a-zA-Z0-9\s-_]/g, "");
  result = result.replace(/[\s\-_]+/g, separator);
  result = result.replace(new RegExp(`^[${separator}]+|[${separator}]+$`, "g"), "");
  return result;
}

export default function SlugGenerator() {
  const t = useTranslations("SlugGenerator");
  const tCommon = useTranslations("Common");

  const [input, setInput] = useState("");
  const [separator, setSeparator] = useState<"-" | "_">("-");
  const [lowercase, setLowercase] = useState(true);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOutput(toSlug(input, separator, lowercase));
  }, [input, separator, lowercase]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-5">
      {/* Input */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-300">{t("inputLabel")}</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("inputPlaceholder")}
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
        />
      </div>

      {/* Separator toggle */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">{t("separatorLabel")}</label>
        <div className="flex gap-2">
          {(["-", "_"] as const).map((sep) => (
            <button
              key={sep}
              onClick={() => setSeparator(sep)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                separator === sep
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white border border-gray-700"
              }`}
            >
              {sep === "-" ? t("hyphen") : t("underscore")}
            </button>
          ))}
        </div>
      </div>

      {/* Lowercase toggle */}
      <label className="flex items-center gap-3 cursor-pointer w-fit">
        <input
          type="checkbox"
          checked={lowercase}
          onChange={(e) => setLowercase(e.target.checked)}
          className="w-4 h-4 rounded accent-indigo-500"
        />
        <span className="text-sm font-medium text-gray-300">{t("lowercaseLabel")}</span>
      </label>

      {/* Output */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-300">{t("outputLabel")}</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={output}
            readOnly
            className="w-full bg-gray-900 border border-gray-700 text-indigo-300 text-sm font-mono rounded-lg px-3 py-2.5 focus:outline-none"
          />
          <button
            onClick={handleCopy}
            disabled={!output}
            className="px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors whitespace-nowrap text-sm"
          >
            {copied ? tCommon("copied") : tCommon("copy")}
          </button>
        </div>
      </div>
    </div>
  );
}
