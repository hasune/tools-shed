"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Tab = "pace" | "time" | "distance";
type Unit = "km" | "mi";

const KM_TO_MI = 0.621371;
const MI_TO_KM = 1.60934;

interface RacePreset {
  label: string;
  km: number;
}

const RACE_PRESETS: RacePreset[] = [
  { label: "5K", km: 5 },
  { label: "10K", km: 10 },
  { label: "Half", km: 21.0975 },
  { label: "Full", km: 42.195 },
];

function parseTime(hh: string, mm: string, ss: string): number {
  return (parseInt(hh) || 0) * 3600 + (parseInt(mm) || 0) * 60 + (parseInt(ss) || 0);
}

function parsePace(mm: string, ss: string): number {
  return (parseInt(mm) || 0) * 60 + (parseInt(ss) || 0);
}

function formatPace(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.round(totalSeconds % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function RunningPace() {
  const t = useTranslations("RunningPace");

  const [tab, setTab] = useState<Tab>("pace");
  const [unit, setUnit] = useState<Unit>("km");

  // Find Pace
  const [paceDistInput, setPaceDistInput] = useState("");
  const [paceHH, setPaceHH] = useState("");
  const [paceMM, setPaceMM] = useState("");
  const [paceSS, setPaceSS] = useState("");
  const [paceResult, setPaceResult] = useState<string | null>(null);

  // Find Time
  const [timeDistInput, setTimeDistInput] = useState("");
  const [timePaceMM, setTimePaceMM] = useState("");
  const [timePaceSS, setTimePaceSS] = useState("");
  const [timeResult, setTimeResult] = useState<string | null>(null);

  // Find Distance
  const [distHH, setDistHH] = useState("");
  const [distMM, setDistMM] = useState("");
  const [distSS, setDistSS] = useState("");
  const [distPaceMM, setDistPaceMM] = useState("");
  const [distPaceSS, setDistPaceSS] = useState("");
  const [distResult, setDistResult] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const applyPreset = (preset: RacePreset, setter: (v: string) => void) => {
    const dist = unit === "km" ? preset.km : parseFloat((preset.km * KM_TO_MI).toFixed(4));
    setter(dist.toString());
  };

  const handleUnitChange = (u: Unit) => {
    setUnit(u);
    setPaceResult(null);
    setTimeResult(null);
    setDistResult(null);
  };

  const calculatePace = () => {
    setError(null);
    setPaceResult(null);
    const dist = parseFloat(paceDistInput);
    const totalSec = parseTime(paceHH, paceMM, paceSS);
    if (!dist || dist <= 0 || totalSec <= 0) {
      setError(t("errorInvalid"));
      return;
    }
    const distKm = unit === "km" ? dist : dist * MI_TO_KM;
    const paceSecPerKm = totalSec / distKm;
    if (unit === "km") {
      setPaceResult(`${formatPace(paceSecPerKm)} /km`);
    } else {
      const paceSecPerMi = paceSecPerKm * MI_TO_KM;
      setPaceResult(`${formatPace(paceSecPerMi)} /mi`);
    }
  };

  const calculateTime = () => {
    setError(null);
    setTimeResult(null);
    const dist = parseFloat(timeDistInput);
    const paceSecPerUnit = parsePace(timePaceMM, timePaceSS);
    if (!dist || dist <= 0 || paceSecPerUnit <= 0) {
      setError(t("errorInvalid"));
      return;
    }
    const distKm = unit === "km" ? dist : dist * MI_TO_KM;
    const paceSecPerKm = unit === "km" ? paceSecPerUnit : paceSecPerUnit / MI_TO_KM;
    const totalSec = paceSecPerKm * distKm;
    setTimeResult(formatTime(totalSec));
  };

  const calculateDistance = () => {
    setError(null);
    setDistResult(null);
    const totalSec = parseTime(distHH, distMM, distSS);
    const paceSecPerUnit = parsePace(distPaceMM, distPaceSS);
    if (totalSec <= 0 || paceSecPerUnit <= 0) {
      setError(t("errorInvalid"));
      return;
    }
    const paceSecPerKm = unit === "km" ? paceSecPerUnit : paceSecPerUnit / MI_TO_KM;
    const distKm = totalSec / paceSecPerKm;
    const displayDist = unit === "km" ? distKm : distKm * KM_TO_MI;
    setDistResult(`${displayDist.toFixed(2)} ${unit}`);
  };

  const timeInputClass =
    "w-16 bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-2 py-2.5 text-center focus:outline-none focus:border-indigo-500 placeholder-gray-600";

  const PresetButtons = ({ onSelect }: { onSelect: (preset: RacePreset) => void }) => (
    <div className="flex flex-wrap gap-2">
      {RACE_PRESETS.map((p) => (
        <button
          key={p.label}
          onClick={() => onSelect(p)}
          className="px-3 py-1.5 bg-gray-800 text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg text-xs font-medium transition-colors"
        >
          {p.label === "Half" ? t("halfMarathon") : p.label === "Full" ? t("fullMarathon") : p.label}
        </button>
      ))}
    </div>
  );

  const ResultCard = ({ label, value }: { label: string; value: string }) => (
    <div className="bg-gray-900 border border-indigo-500/30 rounded-xl p-5 text-center">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{label}</div>
      <div className="text-4xl font-bold text-indigo-400 font-mono">{value}</div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Unit toggle */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400">{t("unitLabel")}</span>
        <div className="flex gap-1 p-1 bg-gray-900 rounded-lg border border-gray-700">
          {(["km", "mi"] as const).map((u) => (
            <button
              key={u}
              onClick={() => handleUnitChange(u)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                unit === u ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-900 rounded-lg border border-gray-700 w-fit">
        {(["pace", "time", "distance"] as const).map((tabKey) => (
          <button
            key={tabKey}
            onClick={() => { setTab(tabKey); setError(null); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === tabKey ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            {tabKey === "pace" ? t("tabFindPace") : tabKey === "time" ? t("tabFindTime") : t("tabFindDistance")}
          </button>
        ))}
      </div>

      {/* Find Pace */}
      {tab === "pace" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">{t("distanceLabel")} ({unit})</label>
            <PresetButtons onSelect={(p) => applyPreset(p, setPaceDistInput)} />
            <input
              type="number"
              min={0}
              step="0.01"
              value={paceDistInput}
              onChange={(e) => setPaceDistInput(e.target.value)}
              placeholder={`e.g. 10`}
              className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">{t("timeLabel")} (HH:MM:SS)</label>
            <div className="flex items-center gap-2">
              <input type="number" min={0} max={99} value={paceHH} onChange={(e) => setPaceHH(e.target.value)} placeholder="HH" className={timeInputClass} />
              <span className="text-gray-500 font-bold">:</span>
              <input type="number" min={0} max={59} value={paceMM} onChange={(e) => setPaceMM(e.target.value)} placeholder="MM" className={timeInputClass} />
              <span className="text-gray-500 font-bold">:</span>
              <input type="number" min={0} max={59} value={paceSS} onChange={(e) => setPaceSS(e.target.value)} placeholder="SS" className={timeInputClass} />
            </div>
          </div>
          <button onClick={calculatePace} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
            {t("calculateButton")}
          </button>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {paceResult && <ResultCard label={t("paceResult")} value={paceResult} />}
        </div>
      )}

      {/* Find Time */}
      {tab === "time" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">{t("distanceLabel")} ({unit})</label>
            <PresetButtons onSelect={(p) => applyPreset(p, setTimeDistInput)} />
            <input
              type="number"
              min={0}
              step="0.01"
              value={timeDistInput}
              onChange={(e) => setTimeDistInput(e.target.value)}
              placeholder={`e.g. 10`}
              className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              {t("paceInputLabel")} (MM:SS /{unit})
            </label>
            <div className="flex items-center gap-2">
              <input type="number" min={0} max={99} value={timePaceMM} onChange={(e) => setTimePaceMM(e.target.value)} placeholder="MM" className={timeInputClass} />
              <span className="text-gray-500 font-bold">:</span>
              <input type="number" min={0} max={59} value={timePaceSS} onChange={(e) => setTimePaceSS(e.target.value)} placeholder="SS" className={timeInputClass} />
              <span className="text-gray-400 text-sm ml-1">/{unit}</span>
            </div>
          </div>
          <button onClick={calculateTime} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
            {t("calculateButton")}
          </button>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {timeResult && <ResultCard label={t("timeResult")} value={timeResult} />}
        </div>
      )}

      {/* Find Distance */}
      {tab === "distance" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">{t("timeLabel")} (HH:MM:SS)</label>
            <div className="flex items-center gap-2">
              <input type="number" min={0} max={99} value={distHH} onChange={(e) => setDistHH(e.target.value)} placeholder="HH" className={timeInputClass} />
              <span className="text-gray-500 font-bold">:</span>
              <input type="number" min={0} max={59} value={distMM} onChange={(e) => setDistMM(e.target.value)} placeholder="MM" className={timeInputClass} />
              <span className="text-gray-500 font-bold">:</span>
              <input type="number" min={0} max={59} value={distSS} onChange={(e) => setDistSS(e.target.value)} placeholder="SS" className={timeInputClass} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              {t("paceInputLabel")} (MM:SS /{unit})
            </label>
            <div className="flex items-center gap-2">
              <input type="number" min={0} max={99} value={distPaceMM} onChange={(e) => setDistPaceMM(e.target.value)} placeholder="MM" className={timeInputClass} />
              <span className="text-gray-500 font-bold">:</span>
              <input type="number" min={0} max={59} value={distPaceSS} onChange={(e) => setDistPaceSS(e.target.value)} placeholder="SS" className={timeInputClass} />
              <span className="text-gray-400 text-sm ml-1">/{unit}</span>
            </div>
          </div>
          <button onClick={calculateDistance} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
            {t("calculateButton")}
          </button>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {distResult && <ResultCard label={t("distanceResult")} value={distResult} />}
        </div>
      )}
    </div>
  );
}
