"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

function getFactors(n: number): number[] {
  const factors: number[] = [];
  for (let i = 2; i <= n; i++) {
    if (n % i === 0) factors.push(i);
  }
  return factors;
}

function sieve(limit: number): number[] {
  if (limit < 2) return [];
  const composite = new Uint8Array(limit + 1);
  for (let i = 2; i * i <= limit; i++) {
    if (!composite[i]) {
      for (let j = i * i; j <= limit; j += i) composite[j] = 1;
    }
  }
  const primes: number[] = [];
  for (let i = 2; i <= limit; i++) {
    if (!composite[i]) primes.push(i);
  }
  return primes;
}

export default function PrimeChecker() {
  const t = useTranslations("PrimeChecker");
  const [tab, setTab] = useState<"check" | "list">("check");
  const [numInput, setNumInput] = useState("");
  const [limitInput, setLimitInput] = useState("");
  const [checkResult, setCheckResult] = useState<{ n: number; prime: boolean; factors: number[] } | null>(null);
  const [primeList, setPrimeList] = useState<number[] | null>(null);
  const [listError, setListError] = useState("");

  const handleCheck = () => {
    const n = parseInt(numInput);
    if (isNaN(n) || n < 0) return;
    const prime = isPrime(n);
    const factors = prime ? [] : getFactors(n);
    setCheckResult({ n, prime, factors });
  };

  const handleList = () => {
    const limit = parseInt(limitInput);
    if (isNaN(limit) || limit < 2) { setListError("Enter a number ≥ 2"); return; }
    if (limit > 100000) { setListError("Limit must be ≤ 100,000"); return; }
    setListError("");
    setPrimeList(sieve(limit));
  };

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-2">
        {(["check", "list"] as const).map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === tb ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {t(tb === "check" ? "checkTab" : "listTab")}
          </button>
        ))}
      </div>

      {tab === "check" && (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-400">{t("numberLabel")}</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={numInput}
                onChange={(e) => setNumInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                placeholder={t("numberPlaceholder")}
                min="0"
                className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
              />
              <button onClick={handleCheck} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                {t("checkButton")}
              </button>
            </div>
          </div>

          {checkResult && (
            <div className={`border rounded-xl p-5 space-y-2 ${checkResult.prime ? "bg-green-950/40 border-green-700" : "bg-red-950/40 border-red-800"}`}>
              <p className={`text-base font-medium ${checkResult.prime ? "text-green-400" : "text-red-400"}`}>
                {checkResult.prime
                  ? t("isPrime", { n: checkResult.n })
                  : t("notPrime", { n: checkResult.n, factors: checkResult.factors.join(", ") })}
              </p>
            </div>
          )}
        </div>
      )}

      {tab === "list" && (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-400">{t("limitLabel")}</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={limitInput}
                onChange={(e) => setLimitInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleList()}
                placeholder={t("limitPlaceholder")}
                min="2"
                max="100000"
                className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
              />
              <button onClick={handleList} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                {t("listButton")}
              </button>
            </div>
            {listError && <p className="text-red-400 text-xs">{listError}</p>}
          </div>

          {primeList && (
            <div className="space-y-2">
              <p className="text-sm text-gray-400">{t("primeCount", { count: primeList.length })}</p>
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 max-h-60 overflow-y-auto">
                <p className="font-mono text-sm text-gray-300 leading-relaxed break-all">
                  {primeList.join(", ")}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
