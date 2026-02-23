"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

type SortMode = "az" | "za" | "lengthAsc" | "lengthDesc" | "random";

export default function TextSorter() {
  const t = useTranslations("TextSorter");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<SortMode>("az");
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [trimLines, setTrimLines] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [removeDuplicates, setRemoveDuplicates] = useState(false);

  function sort() {
    let lines = input.split("\n");
    if (trimLines) lines = lines.map((l) => l.trim());
    if (removeEmpty) lines = lines.filter((l) => l.length > 0);
    if (removeDuplicates) {
      const seen = new Set<string>();
      lines = lines.filter((l) => {
        const key = caseInsensitive ? l.toLowerCase() : l;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
    switch (mode) {
      case "az":
        lines.sort((a, b) =>
          caseInsensitive ? a.toLowerCase().localeCompare(b.toLowerCase()) : a.localeCompare(b)
        );
        break;
      case "za":
        lines.sort((a, b) =>
          caseInsensitive ? b.toLowerCase().localeCompare(a.toLowerCase()) : b.localeCompare(a)
        );
        break;
      case "lengthAsc":
        lines.sort((a, b) => a.length - b.length);
        break;
      case "lengthDesc":
        lines.sort((a, b) => b.length - a.length);
        break;
      case "random":
        for (let i = lines.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [lines[i], lines[j]] = [lines[j], lines[i]];
        }
        break;
    }
    setOutput(lines.join("\n"));
  }

  const modes: { value: SortMode; label: string }[] = [
    { value: "az", label: t("sortAZ") },
    { value: "za", label: t("sortZA") },
    { value: "lengthAsc", label: t("sortLengthAsc") },
    { value: "lengthDesc", label: t("sortLengthDesc") },
    { value: "random", label: t("sortRandom") },
  ];

  const lineCount = output ? output.split("\n").filter((l) => l.length > 0).length : 0;
  const textareaCls =
    "w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600 resize-none font-mono";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {modes.map((m) => (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              mode === m.value ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {([
          [caseInsensitive, setCaseInsensitive, t("optionCaseInsensitive")],
          [trimLines, setTrimLines, t("optionTrimLines")],
          [removeEmpty, setRemoveEmpty, t("optionRemoveEmpty")],
          [removeDuplicates, setRemoveDuplicates, t("optionRemoveDuplicates")],
        ] as [boolean, (v: boolean) => void, string][]).map(([checked, setter, label]) => (
          <label key={label} className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setter(e.target.checked)}
              className="accent-indigo-500"
            />
            <span className="text-sm text-gray-400">{label}</span>
          </label>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">{t("inputLabel")}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("inputPlaceholder")}
            rows={10}
            className={textareaCls}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-400">{t("outputLabel")}</label>
            {output && (
              <span className="text-xs text-gray-500">{t("lineCount", { count: lineCount })}</span>
            )}
          </div>
          <textarea value={output} readOnly rows={10} className={`${textareaCls} cursor-default`} />
        </div>
      </div>
      <button
        onClick={sort}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
      >
        {t("sortButton")}
      </button>
    </div>
  );
}
