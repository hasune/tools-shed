"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

type Category = "tops" | "bottoms" | "dresses";
type SizeSystem = "us" | "eu" | "uk" | "jp";

// Size charts: [US, EU, UK, JP]
const SIZE_CHARTS: Record<Category, { us: string; eu: string; uk: string; jp: string }[]> = {
  tops: [
    { us: "XS", eu: "32-34", uk: "6-8", jp: "5" },
    { us: "S", eu: "36-38", uk: "10-12", jp: "7" },
    { us: "M", eu: "40-42", uk: "14-16", jp: "9" },
    { us: "L", eu: "44-46", uk: "18-20", jp: "11" },
    { us: "XL", eu: "48-50", uk: "22-24", jp: "13" },
    { us: "2XL", eu: "52-54", uk: "26-28", jp: "15" },
    { us: "3XL", eu: "56-58", uk: "30-32", jp: "17" },
  ],
  bottoms: [
    { us: "0", eu: "32", uk: "4", jp: "55" },
    { us: "2", eu: "34", uk: "6", jp: "58" },
    { us: "4", eu: "36", uk: "8", jp: "61" },
    { us: "6", eu: "38", uk: "10", jp: "64" },
    { us: "8", eu: "40", uk: "12", jp: "67" },
    { us: "10", eu: "42", uk: "14", jp: "70" },
    { us: "12", eu: "44", uk: "16", jp: "73" },
    { us: "14", eu: "46", uk: "18", jp: "76" },
    { us: "16", eu: "48", uk: "20", jp: "79" },
  ],
  dresses: [
    { us: "0", eu: "32", uk: "4", jp: "5" },
    { us: "2", eu: "34", uk: "6", jp: "7" },
    { us: "4", eu: "36", uk: "8", jp: "9" },
    { us: "6", eu: "38", uk: "10", jp: "11" },
    { us: "8", eu: "40", uk: "12", jp: "13" },
    { us: "10", eu: "42", uk: "14", jp: "15" },
    { us: "12", eu: "44", uk: "16", jp: "17" },
    { us: "14", eu: "46", uk: "18", jp: "19" },
    { us: "16", eu: "48", uk: "20", jp: "21" },
  ],
};

export default function ClothingSizeConverter() {
  const t = useTranslations("ClothingSizeConverter");
  const [category, setCategory] = useState<Category>("tops");
  const [fromSystem, setFromSystem] = useState<SizeSystem>("us");
  const [fromSize, setFromSize] = useState("");
  const [result, setResult] = useState<{ us: string; eu: string; uk: string; jp: string } | null>(null);
  const [notFound, setNotFound] = useState(false);

  const systems: SizeSystem[] = ["us", "eu", "uk", "jp"];
  const systemLabels: Record<SizeSystem, string> = {
    us: t("usLabel"),
    eu: t("euLabel"),
    uk: t("ukLabel"),
    jp: t("jpLabel"),
  };

  const categoryOptions: Category[] = ["tops", "bottoms", "dresses"];
  const categoryLabels: Record<Category, string> = {
    tops: t("tops"),
    bottoms: t("bottoms"),
    dresses: t("dresses"),
  };

  const handleConvert = () => {
    setNotFound(false);
    const chart = SIZE_CHARTS[category];
    const match = chart.find(
      (row) => row[fromSystem].toLowerCase() === fromSize.trim().toLowerCase()
    );
    if (match) {
      setResult(match);
    } else {
      setResult(null);
      setNotFound(true);
    }
  };

  const handleClear = () => {
    setFromSize("");
    setResult(null);
    setNotFound(false);
  };

  // Get all sizes for the selected system to show as options
  const availableSizes = SIZE_CHARTS[category].map((row) => row[fromSystem]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t("categoryLabel")}</label>
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value as Category); setResult(null); setNotFound(false); }}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500"
          >
            {categoryOptions.map((c) => (
              <option key={c} value={c}>{categoryLabels[c]}</option>
            ))}
          </select>
        </div>

        {/* From system */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t("systemLabel")}</label>
          <select
            value={fromSystem}
            onChange={(e) => { setFromSystem(e.target.value as SizeSystem); setResult(null); setNotFound(false); }}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500"
          >
            {systems.map((s) => (
              <option key={s} value={s}>{systemLabels[s]}</option>
            ))}
          </select>
        </div>

        {/* Size input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t("sizeLabel")}</label>
          <select
            value={fromSize}
            onChange={(e) => setFromSize(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500"
          >
            <option value="">—</option>
            {availableSizes.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleConvert}
          disabled={!fromSize}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {t("convertButton")}
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-medium transition-colors"
        >
          {t("clearButton")}
        </button>
      </div>

      {notFound && (
        <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/30 px-4 py-3 text-yellow-400 text-sm">
          {t("notFound")}
        </div>
      )}

      {result && (
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3">{t("equivalentSizes")}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {systems.map((s) => (
              <div
                key={s}
                className={`rounded-lg border px-4 py-3 text-center ${
                  s === fromSystem
                    ? "border-indigo-500/50 bg-indigo-500/10"
                    : "border-gray-700 bg-gray-800/50"
                }`}
              >
                <div className="text-xs text-gray-500 mb-1">{systemLabels[s]}</div>
                <div className="text-2xl font-semibold text-gray-100">{result[s]}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full chart */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-700">
              {systems.map((s) => (
                <th key={s} className="px-4 py-2 text-left text-gray-400 font-medium">
                  {systemLabels[s]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIZE_CHARTS[category].map((row, i) => (
              <tr
                key={i}
                className={`border-b border-gray-800 transition-colors ${
                  result && row === result ? "bg-indigo-500/10" : "hover:bg-gray-800/50"
                }`}
              >
                {systems.map((s) => (
                  <td key={s} className="px-4 py-2 text-gray-300">{row[s]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
