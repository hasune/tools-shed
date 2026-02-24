"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function FindReplace() {
  const t = useTranslations("FindReplace");
  const [input, setInput] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [useRegex, setUseRegex] = useState(false);
  const [matchCase, setMatchCase] = useState(false);
  const [replaceAll, setReplaceAll] = useState(true);
  const [output, setOutput] = useState("");
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const [regexError, setRegexError] = useState("");

  const handleReplace = () => {
    if (!find) {
      setOutput(input);
      setMatchCount(0);
      return;
    }
    try {
      let flags = replaceAll ? "g" : "";
      if (!matchCase) flags += "i";
      const pattern = useRegex ? find : find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(pattern, flags);
      const matches = input.match(new RegExp(pattern, flags + (flags.includes("g") ? "" : "g")));
      setMatchCount(matches ? matches.length : 0);
      setOutput(input.replace(regex, replace));
      setRegexError("");
    } catch (e) {
      setRegexError((e as Error).message);
    }
  };

  return (
    <div className="space-y-4">
      {/* Input */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-400">{t("inputLabel")}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("inputPlaceholder")}
          rows={6}
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600 resize-y font-mono"
        />
      </div>

      {/* Find / Replace inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("findLabel")}</label>
          <input
            type="text"
            value={find}
            onChange={(e) => setFind(e.target.value)}
            placeholder={t("findPlaceholder")}
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600 font-mono"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("replaceLabel")}</label>
          <input
            type="text"
            value={replace}
            onChange={(e) => setReplace(e.target.value)}
            placeholder={t("replacePlaceholder")}
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600 font-mono"
          />
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-4">
        {[
          { label: t("regexToggle"), val: useRegex, set: setUseRegex },
          { label: t("caseToggle"), val: matchCase, set: setMatchCase },
          { label: t("globalToggle"), val: replaceAll, set: setReplaceAll },
        ].map(({ label, val, set }) => (
          <label key={label} className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
            <input type="checkbox" checked={val} onChange={(e) => set(e.target.checked)} className="w-4 h-4 accent-indigo-500" />
            {label}
          </label>
        ))}
      </div>

      {regexError && <p className="text-red-400 text-sm">{regexError}</p>}

      <button
        onClick={handleReplace}
        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
      >
        {t("replaceButton")}
      </button>

      {/* Output */}
      {output !== "" && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-400">{t("outputLabel")}</label>
            {matchCount !== null && (
              <span className="text-xs text-gray-500">{t("matchCount", { count: matchCount })}</span>
            )}
          </div>
          <textarea
            readOnly
            value={output}
            rows={6}
            className="w-full bg-gray-900 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2.5 resize-y font-mono"
          />
        </div>
      )}
    </div>
  );
}
