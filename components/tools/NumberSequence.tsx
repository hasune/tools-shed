"use client";
import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";

type SeqType = "arithmetic" | "geometric" | "fibonacci" | "prime" | "square";

function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}

function generateSequence(type: SeqType, start: number, diff: number, ratio: number, count: number): number[] {
  const seq: number[] = [];
  if (type === "arithmetic") {
    for (let i = 0; i < count; i++) seq.push(start + i * diff);
  } else if (type === "geometric") {
    for (let i = 0; i < count; i++) seq.push(Math.round(start * Math.pow(ratio, i) * 1000000) / 1000000);
  } else if (type === "fibonacci") {
    let a = start, b = start + 1;
    seq.push(a);
    while (seq.length < count) { const c = a + b; seq.push(b); a = b; b = c; }
    seq.length = count;
  } else if (type === "prime") {
    let n = 2;
    while (seq.length < count) { if (isPrime(n)) seq.push(n); n++; }
  } else if (type === "square") {
    for (let i = 1; i <= count; i++) seq.push(i * i);
  }
  return seq;
}

export default function NumberSequence() {
  const t = useTranslations("NumberSequence");

  const [type, setType] = useState<SeqType>("arithmetic");
  const [start, setStart] = useState("1");
  const [diff, setDiff] = useState("2");
  const [ratio, setRatio] = useState("2");
  const [count, setCount] = useState("10");
  const [sequence, setSequence] = useState<number[] | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(() => {
    const c = Math.min(Math.max(parseInt(count) || 10, 1), 50);
    const s = parseFloat(start) || 1;
    const d = parseFloat(diff) || 2;
    const r = parseFloat(ratio) || 2;
    setSequence(generateSequence(type, s, d, r, c));
  }, [type, start, diff, ratio, count]);

  const handleCopy = async () => {
    if (!sequence) return;
    await navigator.clipboard.writeText(sequence.join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sum = sequence ? sequence.reduce((a, b) => a + b, 0) : null;

  const showStart = type === "arithmetic" || type === "geometric";
  const showDiff = type === "arithmetic";
  const showRatio = type === "geometric";

  return (
    <div className="space-y-5">
      {/* Type */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">{t("typeLabel")}</label>
        <div className="flex flex-wrap gap-2">
          {(["arithmetic", "geometric", "fibonacci", "prime", "square"] as SeqType[]).map((tp) => (
            <button
              key={tp}
              onClick={() => { setType(tp); setSequence(null); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                type === tp ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {t(`type${tp.charAt(0).toUpperCase() + tp.slice(1)}` as Parameters<typeof t>[0])}
            </button>
          ))}
        </div>
      </div>

      {/* Params */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {showStart && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("startLabel")}</label>
            <input type="number" value={start} onChange={(e) => setStart(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
          </div>
        )}
        {showDiff && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("diffLabel")}</label>
            <input type="number" value={diff} onChange={(e) => setDiff(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
          </div>
        )}
        {showRatio && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("ratioLabel")}</label>
            <input type="number" value={ratio} onChange={(e) => setRatio(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
          </div>
        )}
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t("countLabel")} (max 50)</label>
          <input type="number" min={1} max={50} value={count} onChange={(e) => setCount(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
        </div>
      </div>

      <button onClick={handleGenerate}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2.5 font-medium transition-colors">
        {t("generateButton")}
      </button>

      {sequence && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {sequence.map((n, i) => (
              <span key={i} className="bg-gray-900 border border-gray-700 rounded px-2 py-1 font-mono text-sm text-indigo-300">
                {n.toLocaleString()}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">{t("sumLabel")}: <span className="text-white font-mono font-medium">{sum?.toLocaleString()}</span></span>
            <button onClick={handleCopy} className="text-indigo-400 hover:text-indigo-300 transition-colors">
              {copied ? "Copied!" : t("copyButton")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
