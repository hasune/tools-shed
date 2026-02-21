"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";

const CHARS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

function getStrength(password: string): { labelKey: "strengthWeak" | "strengthFair" | "strengthGood" | "strengthStrong"; color: string; width: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { labelKey: "strengthWeak", color: "bg-red-500", width: "w-1/4" };
  if (score <= 4) return { labelKey: "strengthFair", color: "bg-yellow-500", width: "w-2/4" };
  if (score <= 5) return { labelKey: "strengthGood", color: "bg-blue-500", width: "w-3/4" };
  return { labelKey: "strengthStrong", color: "bg-green-500", width: "w-full" };
}

export default function PasswordGenerator() {
  const t = useTranslations("PasswordGenerator");
  const tCommon = useTranslations("Common");

  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState("");
  const [count, setCount] = useState(1);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = useCallback(() => {
    const charset = Object.entries(options)
      .filter(([, enabled]) => enabled)
      .map(([key]) => CHARS[key as keyof typeof CHARS])
      .join("");

    if (!charset) return;

    const generated = Array.from({ length: count }, () => {
      const arr = new Uint32Array(length);
      crypto.getRandomValues(arr);
      return Array.from(arr, (n) => charset[n % charset.length]).join("");
    });

    setPasswords(generated);
    setPassword(generated[0]);
  }, [length, options, count]);

  const toggleOption = (key: keyof typeof options) => {
    const newOptions = { ...options, [key]: !options[key] };
    const anyEnabled = Object.values(newOptions).some(Boolean);
    if (anyEnabled) setOptions(newOptions);
  };

  const copy = (pwd: string, index: number) => {
    navigator.clipboard.writeText(pwd).then(() => {
      setCopied(index);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const strength = password ? getStrength(password) : null;

  const optionLabels: Record<keyof typeof options, "uppercase" | "lowercase" | "numbers" | "symbols"> = {
    uppercase: "uppercase",
    lowercase: "lowercase",
    numbers: "numbers",
    symbols: "symbols",
  };

  return (
    <div className="space-y-5">
      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            {t("lengthLabel", { length })}
          </label>
          <input
            type="range"
            min={6}
            max={128}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>6</span>
            <span>128</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Character types</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(options) as (keyof typeof options)[]).map((key) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options[key]}
                  onChange={() => toggleOption(key)}
                  className="w-4 h-4 rounded accent-indigo-500"
                />
                <span className="text-gray-400 text-sm">{t(optionLabels[key])}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-400 whitespace-nowrap">{t("generateCount")}</label>
        <select
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
        >
          {[1, 5, 10].map((n) => (
            <option key={n} value={n}>
              {n > 1 ? t("passwordPlural", { count: n }) : t("passwordSingular", { count: n })}
            </option>
          ))}
        </select>
        <button
          onClick={generate}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg transition-colors"
        >
          {t("generateButton")}
        </button>
      </div>

      {/* Strength Meter */}
      {strength && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">{t("strengthLabel")}</span>
            <span className={strength.color.replace("bg-", "text-")}>{t(strength.labelKey)}</span>
          </div>
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
          </div>
        </div>
      )}

      {/* Results */}
      {passwords.length > 0 && (
        <div className="space-y-2">
          {passwords.map((pwd, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 gap-3"
            >
              <code className="text-indigo-300 text-sm font-mono break-all flex-1">{pwd}</code>
              <button
                onClick={() => copy(pwd, i)}
                className="text-xs px-2 py-1 bg-gray-700 hover:bg-indigo-600 text-gray-300 hover:text-white rounded transition-colors flex-shrink-0"
              >
                {copied === i ? "✓" : tCommon("copy")}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
