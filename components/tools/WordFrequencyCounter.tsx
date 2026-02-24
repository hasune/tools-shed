"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

const COMMON_WORDS = new Set([
  "the","a","an","and","or","but","in","on","at","to","for","of","with","by","from","is","are","was","were","be","been","being","have","has","had","do","does","did","will","would","could","should","may","might","shall","can","this","that","these","those","i","you","he","she","it","we","they","me","him","her","us","them","my","your","his","its","our","their","what","which","who","when","where","why","how","not","no","so","if","as","up","out","about","into","through","then","than","also","just","more","some","any","all","each","both","few","more","most","other","such","own","same","only","over","after","before","between","under","after","since","during","without","within","along","following","across","behind","beyond","plus","except","like","even","though","although","because"
]);

interface WordEntry {
  word: string;
  count: number;
  percent: number;
}

export default function WordFrequencyCounter() {
  const t = useTranslations("WordFrequencyCounter");

  const [text, setText] = useState("");
  const [ignoreCommon, setIgnoreCommon] = useState(true);
  const [result, setResult] = useState<{ entries: WordEntry[]; total: number; unique: number } | null>(null);
  const [copied, setCopied] = useState(false);

  function analyze() {
    if (!text.trim()) return;

    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9'\s-]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 1);

    const filtered = ignoreCommon ? words.filter((w) => !COMMON_WORDS.has(w)) : words;

    const freq: Record<string, number> = {};
    for (const w of filtered) {
      freq[w] = (freq[w] || 0) + 1;
    }

    const total = filtered.length;
    const entries = Object.entries(freq)
      .map(([word, count]) => ({ word, count, percent: total > 0 ? (count / total) * 100 : 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 100);

    setResult({ entries, total, unique: Object.keys(freq).length });
  }

  function clear() {
    setText("");
    setResult(null);
  }

  function copyCSV() {
    if (!result) return;
    const csv = ["Rank,Word,Count,Percent", ...result.entries.map((e, i) => `${i + 1},${e.word},${e.count},${e.percent.toFixed(2)}%`)].join("\n");
    navigator.clipboard.writeText(csv).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const maxCount = result?.entries[0]?.count ?? 1;

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{t("inputLabel")}</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("inputPlaceholder")}
          rows={6}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
        />
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={ignoreCommon}
            onChange={(e) => setIgnoreCommon(e.target.checked)}
            className="accent-indigo-500 w-4 h-4"
          />
          <span className="text-sm text-gray-300">{t("ignoreCommonLabel")}</span>
        </label>
        <div className="flex gap-3">
          <button onClick={analyze}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
            {t("analyzeButton")}
          </button>
          <button onClick={clear}
            className="bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-4 rounded-lg transition-colors text-sm">
            {t("clearButton")}
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">{t("totalWordsLabel")}</p>
              <p className="text-2xl font-bold text-white">{result.total.toLocaleString()}</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">{t("uniqueWordsLabel")}</p>
              <p className="text-2xl font-bold text-indigo-400">{result.unique.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-gray-300">{t("topWordsLabel")}</p>
            <button onClick={copyCSV}
              className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors">
              {copied ? "Copied!" : t("copyButton")}
            </button>
          </div>

          {result.entries.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">{t("noText")}</p>
          ) : (
            <div className="space-y-1.5">
              {result.entries.slice(0, 30).map((entry, i) => (
                <div key={entry.word} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-6 text-right">{i + 1}</span>
                  <span className="text-sm text-white font-mono w-32 truncate">{entry.word}</span>
                  <div className="flex-1 bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all"
                      style={{ width: `${(entry.count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right">{entry.count}</span>
                  <span className="text-xs text-gray-600 w-12 text-right">{entry.percent.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
