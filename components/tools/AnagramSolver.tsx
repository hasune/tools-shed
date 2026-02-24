"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function sortLetters(s: string): string {
  return normalize(s).split("").sort().join("");
}

function letterCount(s: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const c of normalize(s)) {
    counts[c] = (counts[c] ?? 0) + 1;
  }
  return counts;
}

export default function AnagramSolver() {
  const t = useTranslations("AnagramSolver");
  const [word1, setWord1] = useState("");
  const [word2, setWord2] = useState("");

  const clear = () => { setWord1(""); setWord2(""); };

  const both = word1.trim() && word2.trim();
  const isAnagram = both ? sortLetters(word1) === sortLetters(word2) : null;
  const counts1 = letterCount(word1);
  const counts2 = letterCount(word2);
  const allLetters = Array.from(new Set([...Object.keys(counts1), ...Object.keys(counts2)])).sort();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("word1Label")}</label>
          <input
            type="text"
            value={word1}
            onChange={(e) => setWord1(e.target.value)}
            placeholder={t("word1Placeholder")}
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("word2Label")}</label>
          <input
            type="text"
            value={word2}
            onChange={(e) => setWord2(e.target.value)}
            placeholder={t("word2Placeholder")}
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={clear} className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {!both && (
        <p className="text-gray-500 text-sm">{t("enterBoth")}</p>
      )}

      {both && isAnagram !== null && (
        <div className={`border rounded-xl p-5 space-y-4 ${isAnagram ? "bg-green-950/40 border-green-700" : "bg-red-950/40 border-red-800"}`}>
          <p className={`text-base font-semibold ${isAnagram ? "text-green-400" : "text-red-400"}`}>
            {isAnagram
              ? t("isAnagram", { a: word1, b: word2 })
              : t("notAnagram", { a: word1, b: word2 })}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">{t("sortedLetters")} ({word1})</p>
              <p className="font-mono text-sm text-gray-300 bg-gray-900 rounded-lg px-3 py-2">{sortLetters(word1) || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">{t("sortedLetters")} ({word2})</p>
              <p className="font-mono text-sm text-gray-300 bg-gray-900 rounded-lg px-3 py-2">{sortLetters(word2) || "—"}</p>
            </div>
          </div>

          {allLetters.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500">{t("letterCount")}</p>
              <div className="bg-gray-900 rounded-xl overflow-hidden">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="text-gray-500 bg-gray-800">
                      <th className="px-3 py-2 text-left">Letter</th>
                      <th className="px-3 py-2 text-center">{word1.slice(0, 10)}</th>
                      <th className="px-3 py-2 text-center">{word2.slice(0, 10)}</th>
                      <th className="px-3 py-2 text-center">Match</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allLetters.map((l) => {
                      const c1 = counts1[l] ?? 0;
                      const c2 = counts2[l] ?? 0;
                      return (
                        <tr key={l} className="border-t border-gray-800">
                          <td className="px-3 py-1.5 text-gray-300 uppercase">{l}</td>
                          <td className="px-3 py-1.5 text-center text-gray-300">{c1}</td>
                          <td className="px-3 py-1.5 text-center text-gray-300">{c2}</td>
                          <td className="px-3 py-1.5 text-center">{c1 === c2 ? <span className="text-green-500">✓</span> : <span className="text-red-500">✗</span>}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
