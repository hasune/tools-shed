"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

function primeFactorize(n: number): number[] {
  const factors: number[] = [];
  let d = 2;
  let num = n;
  while (d * d <= num) {
    while (num % d === 0) {
      factors.push(d);
      num = Math.floor(num / d);
    }
    d++;
  }
  if (num > 1) factors.push(num);
  return factors;
}

function getDivisors(n: number): number[] {
  const divs: number[] = [];
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      divs.push(i);
      if (i !== n / i) divs.push(n / i);
    }
  }
  return divs.sort((a, b) => a - b);
}

function sieveOfEratosthenes(limit: number): number[] {
  const sieve = new Array(limit + 1).fill(true);
  sieve[0] = sieve[1] = false;
  for (let i = 2; i * i <= limit; i++) {
    if (sieve[i]) {
      for (let j = i * i; j <= limit; j += i) sieve[j] = false;
    }
  }
  return sieve.map((v, i) => (v ? i : -1)).filter((v) => v > 0);
}

interface FactorResult {
  n: number;
  prime: boolean;
  factors: number[];
  factorMap: [number, number][];
  divisors: number[];
}

export default function PrimeFactorizer() {
  const t = useTranslations("PrimeFactorizer");

  const [input, setInput] = useState("");
  const [result, setResult] = useState<FactorResult | null>(null);
  const [sieveLimit, setSieveLimit] = useState("100");
  const [sievePrimes, setSievePrimes] = useState<number[] | null>(null);

  const handleCheck = () => {
    const n = parseInt(input, 10);
    if (isNaN(n) || n < 1 || n > 1_000_000) return;
    const prime = isPrime(n);
    const factors = primeFactorize(n);
    const divisors = getDivisors(n);
    // build factor map: [[2, 3], [3, 2]] for 2^3 * 3^2
    const factorMap: [number, number][] = [];
    let prev = -1;
    for (const f of factors) {
      if (f === prev) {
        factorMap[factorMap.length - 1][1]++;
      } else {
        factorMap.push([f, 1]);
        prev = f;
      }
    }
    setResult({ n, prime, factors, factorMap, divisors });
  };

  const handleSieve = () => {
    const limit = parseInt(sieveLimit, 10);
    if (isNaN(limit) || limit < 2 || limit > 10000) return;
    setSievePrimes(sieveOfEratosthenes(limit));
  };

  return (
    <div className="space-y-5">
      {/* Input */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">{t("inputLabel")}</label>
        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            max={1000000}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("inputPlaceholder")}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          />
          <button
            onClick={handleCheck}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
          >
            {t("checkButton")}
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-3">
          <div className={`rounded-xl p-3 border text-center ${result.prime ? "bg-green-950 border-green-700" : "bg-gray-900 border-gray-700"}`}>
            <p className={`font-medium ${result.prime ? "text-green-400" : "text-gray-300"}`}>
              {result.prime ? t("isPrime", { n: result.n }) : t("isNotPrime", { n: result.n })}
            </p>
          </div>

          {!result.prime && result.factorMap.length > 0 && (
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
              <p className="text-xs text-gray-500 mb-2">{t("factorizationLabel")}</p>
              <p className="font-mono text-lg text-white">
                {result.n} = {result.factorMap.map(([f, e]) => e > 1 ? `${f}^${e}` : `${f}`).join(" × ")}
              </p>
            </div>
          )}

          <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
            <p className="text-xs text-gray-500 mb-1">{t("divisorsLabel")} <span className="text-gray-400">({t("divisorCountLabel")}: {result.divisors.length})</span></p>
            <p className="font-mono text-sm text-gray-300 break-all">
              {result.divisors.join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* Sieve */}
      <div className="border-t border-gray-800 pt-4">
        <p className="text-sm text-gray-400 mb-2">{t("sieveLabel")}</p>
        <div className="flex gap-2">
          <input
            type="number"
            min={2}
            max={10000}
            value={sieveLimit}
            onChange={(e) => setSieveLimit(e.target.value)}
            className="w-28 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleSieve}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors"
          >
            {t("sieveButton")}
          </button>
        </div>
        {sievePrimes && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">{t("sieveResultLabel")} ({sievePrimes.length}개):</p>
            <p className="font-mono text-xs text-gray-400 break-all leading-relaxed">
              {sievePrimes.join(", ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
