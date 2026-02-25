"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!word) return 0;
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  const m = word.match(/[aeiouy]{1,2}/g);
  return m ? m.length : 1;
}

export default function TextStatistics() {
  const t = useTranslations("TextStatistics");
  const [text, setText] = useState("");

  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const sentences = text.trim()
    ? text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
    : 0;
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const avgWPS = sentences > 0 ? wordCount / sentences : 0;
  const avgSPW = wordCount > 0 ? syllables / wordCount : 0;

  const fleschEase =
    wordCount > 0 && sentences > 0
      ? 206.835 - 1.015 * avgWPS - 84.6 * avgSPW
      : 0;
  const fleschGrade =
    wordCount > 0 && sentences > 0
      ? 0.39 * avgWPS + 11.8 * avgSPW - 15.59
      : 0;
  const complexWords = words.filter((w) => countSyllables(w) >= 3).length;
  const gunningFog =
    wordCount > 0 && sentences > 0
      ? 0.4 * (avgWPS + 100 * (complexWords / wordCount))
      : 0;

  const getEaseLabel = (score: number) => {
    if (score >= 90) return t("veryEasy");
    if (score >= 80) return t("easy");
    if (score >= 70) return t("fairlyEasy");
    if (score >= 60) return t("standard");
    if (score >= 50) return t("fairlyDifficult");
    if (score >= 30) return t("difficult");
    return t("veryDifficult");
  };

  const getEaseColor = (score: number) => {
    if (score >= 70) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-400">{t("inputLabel")}</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("inputPlaceholder")}
          rows={8}
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600 resize-y"
        />
      </div>

      <button
        onClick={() => setText("")}
        className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
      >
        {t("clearButton")}
      </button>

      {wordCount > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              [t("wordsLabel"), wordCount.toLocaleString()],
              [t("sentencesLabel"), sentences.toLocaleString()],
              [t("syllablesLabel"), syllables.toLocaleString()],
              [t("avgWordsPerSentence"), avgWPS.toFixed(1)],
              [t("avgSyllablesPerWord"), avgSPW.toFixed(2)],
            ].map(([label, value], i) => (
              <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="text-2xl font-mono text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
            <p className="text-xs text-gray-500 px-4 py-2 border-b border-gray-700">{t("readabilityLabel")}</p>
            <table className="w-full text-sm">
              <tbody>
                {[
                  { label: t("fleschEaseLabel"), value: fleschEase.toFixed(1), sub: getEaseLabel(fleschEase), color: getEaseColor(fleschEase) },
                  { label: t("fleschGradeLabel"), value: `Grade ${Math.max(0, fleschGrade).toFixed(1)}`, sub: "", color: "text-indigo-400" },
                  { label: t("gunningFogLabel"), value: Math.max(0, gunningFog).toFixed(1), sub: "", color: "text-indigo-400" },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-900" : "bg-gray-800/30"}>
                    <td className="px-4 py-2.5 text-gray-300">{row.label}</td>
                    <td className={`px-4 py-2.5 font-mono text-right ${row.color}`}>{row.value}</td>
                    <td className="px-4 py-2.5 text-gray-500 text-xs text-right">{row.sub}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
