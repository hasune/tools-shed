"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

type Sex = "male" | "female";
type Unit = "cm" | "inch";
type Risk = "low" | "moderate" | "high" | "veryHigh";

function getRisk(whr: number, sex: Sex): Risk {
  if (sex === "male") {
    if (whr < 0.90) return "low";
    if (whr < 0.95) return "moderate";
    if (whr < 1.00) return "high";
    return "veryHigh";
  } else {
    if (whr < 0.80) return "low";
    if (whr < 0.85) return "moderate";
    if (whr < 0.90) return "high";
    return "veryHigh";
  }
}

const RISK_COLORS: Record<Risk, string> = {
  low: "text-green-400",
  moderate: "text-yellow-400",
  high: "text-orange-400",
  veryHigh: "text-red-400",
};

export default function WaistToHipRatio() {
  const t = useTranslations("WaistToHipRatio");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [unit, setUnit] = useState<Unit>("cm");
  const [sex, setSex] = useState<Sex>("male");
  const [result, setResult] = useState<{ whr: number; risk: Risk } | null>(null);

  const calculate = () => {
    const w = parseFloat(waist);
    const h = parseFloat(hip);
    if (!w || !h || w <= 0 || h <= 0) return;
    const whr = w / h;
    setResult({ whr, risk: getRisk(whr, sex) });
  };

  const clear = () => { setWaist(""); setHip(""); setResult(null); };

  const riskLabels: Record<Risk, string> = {
    low: t("riskLow"),
    moderate: t("riskModerate"),
    high: t("riskHigh"),
    veryHigh: t("riskVeryHigh"),
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("unitLabel")}</label>
          <select value={unit} onChange={(e) => setUnit(e.target.value as Unit)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
            <option value="cm">{t("unitCm")}</option>
            <option value="inch">{t("unitInch")}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("sexLabel")}</label>
          <select value={sex} onChange={(e) => setSex(e.target.value as Sex)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
            <option value="male">{t("sexMale")}</option>
            <option value="female">{t("sexFemale")}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("waistLabel")} ({unit === "cm" ? t("unitCm") : t("unitInch")})</label>
          <input type="number" min="0" step="0.1" value={waist} onChange={(e) => setWaist(e.target.value)} placeholder={unit === "cm" ? "80" : "32"}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("hipLabel")} ({unit === "cm" ? t("unitCm") : t("unitInch")})</label>
          <input type="number" min="0" step="0.1" value={hip} onChange={(e) => setHip(e.target.value)} placeholder={unit === "cm" ? "96" : "38"}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={calculate} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg transition-colors">
          {t("calculateButton")}
        </button>
        <button onClick={clear} className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {result && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
          <div className="text-sm text-gray-400 mb-1">{t("whrLabel")}</div>
          <div className="text-4xl font-bold text-white mb-2">{result.whr.toFixed(2)}</div>
          <div className={`text-lg font-semibold ${RISK_COLORS[result.risk]}`}>
            {t("riskLabel")}: {riskLabels[result.risk]}
          </div>
        </div>
      )}

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 overflow-x-auto">
        <h3 className="font-semibold text-white mb-3">{t("whoTitle")}</h3>
        <p className="text-sm text-gray-400 mb-3">{t("whoSubtitle")}</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400">
              <th className="text-left py-1 pr-4">{t("colSex")}</th>
              <th className="text-center py-1 px-2 text-green-400">{t("colLow")}</th>
              <th className="text-center py-1 px-2 text-yellow-400">{t("colModerate")}</th>
              <th className="text-center py-1 px-2 text-orange-400">{t("colHigh")}</th>
              <th className="text-center py-1 px-2 text-red-400">{t("colVeryHigh")}</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            <tr>
              <td className="py-1 pr-4">{t("sexMale")}</td>
              <td className="text-center py-1 px-2">&lt;0.90</td>
              <td className="text-center py-1 px-2">0.90–0.95</td>
              <td className="text-center py-1 px-2">0.95–1.00</td>
              <td className="text-center py-1 px-2">≥1.00</td>
            </tr>
            <tr>
              <td className="py-1 pr-4">{t("sexFemale")}</td>
              <td className="text-center py-1 px-2">&lt;0.80</td>
              <td className="text-center py-1 px-2">0.80–0.85</td>
              <td className="text-center py-1 px-2">0.85–0.90</td>
              <td className="text-center py-1 px-2">≥0.90</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
