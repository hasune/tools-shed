"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

export default function WordCounter() {
  const t = useTranslations("WordCounter");
  const tCommon = useTranslations("Common");

  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const sentences = text.trim() === "" ? 0 : text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
    const paragraphs = text.trim() === "" ? 0 : text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
    const lines = text.split("\n").length;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { characters, charactersNoSpaces, words, sentences, paragraphs, lines, readingTime };
  }, [text]);

  const statCards = [
    { labelKey: "words" as const, value: stats.words },
    { labelKey: "characters" as const, value: stats.characters },
    { labelKey: "charsNoSpaces" as const, value: stats.charactersNoSpaces },
    { labelKey: "sentences" as const, value: stats.sentences },
    { labelKey: "paragraphs" as const, value: stats.paragraphs },
    { labelKey: "lines" as const, value: stats.lines },
    { labelKey: "readingTime" as const, value: t("readingTimeValue", { minutes: stats.readingTime }) },
  ];

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((stat) => (
          <div key={stat.labelKey} className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-indigo-400">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1">{t(stat.labelKey)}</div>
          </div>
        ))}
      </div>

      {/* Text Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">{t("inputLabel")}</label>
          {text && (
            <button
              onClick={() => setText("")}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              {tCommon("clear")}
            </button>
          )}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("inputPlaceholder")}
          className="w-full h-64 bg-gray-900 border border-gray-600 text-gray-100 text-sm rounded-lg p-3 resize-none focus:outline-none focus:border-indigo-500 placeholder-gray-600"
        />
      </div>
    </div>
  );
}
