"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

// Band size conversions: US/UK -> EU -> FR
// FR = EU + 15 (approximately)
const BAND_US_TO_EU: Record<number, number> = {
  28: 60, 30: 65, 32: 70, 34: 75, 36: 80, 38: 85, 40: 90, 42: 95, 44: 100, 46: 105,
};
const BAND_EU_TO_US: Record<number, number> = Object.fromEntries(
  Object.entries(BAND_US_TO_EU).map(([k, v]) => [v, Number(k)])
);
const BAND_EU_TO_JP: Record<number, string> = {
  60: "A60", 65: "A65 / B60", 70: "A70 / B65 / C60", 75: "A75 / B70 / C65 / D60",
  80: "B75 / C70 / D65", 85: "C75 / D70", 90: "D75", 95: "D80", 100: "D85", 105: "D90",
};

// Cup sizes: US ≈ UK ≈ international
// EU cup = same letter but sizing starts differently
// FR cup: A=A, B=B, C=C, D=D, E=DD, F=E
const CUPS_US = ["AA","A","B","C","D","DD","DDD/F","G","H","I","J","K"];
const CUP_US_TO_EU: Record<string, string> = {
  "AA":"AA","A":"A","B":"B","C":"C","D":"D","DD":"E","DDD/F":"F","G":"G","H":"H","I":"I","J":"J","K":"K",
};
const CUP_US_TO_UK: Record<string, string> = {
  "AA":"AA","A":"A","B":"B","C":"C","D":"D","DD":"DD","DDD/F":"E","G":"F","H":"FF","I":"G","J":"GG","K":"H",
};
const CUP_US_TO_FR: Record<string, string> = {
  "AA":"AA","A":"A","B":"B","C":"C","D":"D","DD":"E","DDD/F":"F","G":"G","H":"H","I":"I","J":"J","K":"K",
};

type System = "US" | "UK" | "EU" | "FR" | "JP";

export default function BraSizeConverter() {
  const t = useTranslations("BraSizeConverter");
  const [system, setSystem] = useState<System>("US");
  const [band, setBand] = useState("");
  const [cup, setCup] = useState("");
  const [result, setResult] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState("");

  const systems: System[] = ["US", "UK", "EU", "FR", "JP"];

  const getBands = (): number[] => {
    if (system === "EU" || system === "JP") return Object.values(BAND_US_TO_EU).sort((a,b)=>a-b);
    if (system === "FR") return Object.values(BAND_US_TO_EU).map(v => v + 15).sort((a,b)=>a-b);
    return Object.keys(BAND_US_TO_EU).map(Number).sort((a,b)=>a-b);
  };

  const convert = () => {
    setError("");
    if (!band || !cup) { setError("Please select both band and cup size."); return; }

    let bandUS: number;
    let cupUS: string;

    // Normalize to US
    if (system === "US" || system === "UK") {
      bandUS = Number(band);
      cupUS = cup;
      if (system === "UK") {
        const entry = Object.entries(CUP_US_TO_UK).find(([, uk]) => uk === cup);
        cupUS = entry ? entry[0] : cup;
      }
    } else if (system === "EU") {
      bandUS = BAND_EU_TO_US[Number(band)] ?? Number(band);
      const entry = Object.entries(CUP_US_TO_EU).find(([, eu]) => eu === cup);
      cupUS = entry ? entry[0] : cup;
    } else if (system === "FR") {
      const euBand = Number(band) - 15;
      bandUS = BAND_EU_TO_US[euBand] ?? euBand;
      const entry = Object.entries(CUP_US_TO_FR).find(([, fr]) => fr === cup);
      cupUS = entry ? entry[0] : cup;
    } else {
      bandUS = BAND_EU_TO_US[Number(band.replace(/[A-Z]/g, ""))] ?? 34;
      cupUS = cup;
    }

    const euBand = BAND_US_TO_EU[bandUS] ?? bandUS * 2 + 12;
    setResult({
      US: `${bandUS}${cupUS}`,
      UK: `${bandUS}${CUP_US_TO_UK[cupUS] ?? cupUS}`,
      EU: `${euBand}${CUP_US_TO_EU[cupUS] ?? cupUS}`,
      "FR/BE": `${euBand + 15}${CUP_US_TO_FR[cupUS] ?? cupUS}`,
      JP: BAND_EU_TO_JP[euBand] ?? `${euBand} (${cupUS})`,
    });
  };

  const cupsForSystem = (): string[] => {
    if (system === "UK") return CUPS_US.map(c => CUP_US_TO_UK[c] ?? c);
    if (system === "EU") return CUPS_US.map(c => CUP_US_TO_EU[c] ?? c);
    if (system === "FR") return CUPS_US.map(c => CUP_US_TO_FR[c] ?? c);
    return CUPS_US;
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{t("systemLabel")}</label>
        <div className="flex flex-wrap gap-2">
          {systems.map(s => (
            <button key={s} onClick={() => { setSystem(s); setBand(""); setCup(""); setResult(null); setError(""); }}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${system === s ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
              {s === "FR" ? t("systemFR") : s === "JP" ? t("systemJP") : s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("bandLabel")}</label>
          <select value={band} onChange={e => setBand(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
            <option value="">—</option>
            {getBands().map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("cupLabel")}</label>
          <select value={cup} onChange={e => setCup(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
            <option value="">—</option>
            {cupsForSystem().map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button onClick={convert} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg transition-colors">
          {t("convertButton")}
        </button>
        <button onClick={() => { setBand(""); setCup(""); setResult(null); setError(""); }}
          className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {result && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-300">{t("resultTitle")}</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Object.entries(result).map(([sys, val]) => (
              <div key={sys} className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-indigo-400">{val}</div>
                <div className="text-xs text-gray-400 mt-1">{sys}</div>
              </div>
            ))}
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm text-gray-400">
            <span className="font-medium text-gray-300">{t("noteTitle")}: </span>
            {t("noteDesc")}
          </div>
        </div>
      )}
    </div>
  );
}
