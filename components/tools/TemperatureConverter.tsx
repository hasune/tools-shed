"use client";

import { useState } from "react";

function round(n: number) {
  return parseFloat(n.toPrecision(7));
}

export default function TemperatureConverter() {
  const [celsius, setCelsius] = useState("");
  const [fahrenheit, setFahrenheit] = useState("");
  const [kelvin, setKelvin] = useState("");

  const fromCelsius = (c: number) => {
    setFahrenheit(isFinite(c) ? String(round(c * 9 / 5 + 32)) : "");
    setKelvin(isFinite(c) ? String(round(c + 273.15)) : "");
  };

  const fromFahrenheit = (f: number) => {
    const c = (f - 32) * 5 / 9;
    setCelsius(isFinite(c) ? String(round(c)) : "");
    setKelvin(isFinite(c) ? String(round(c + 273.15)) : "");
  };

  const fromKelvin = (k: number) => {
    const c = k - 273.15;
    setCelsius(isFinite(c) ? String(round(c)) : "");
    setFahrenheit(isFinite(c) ? String(round(c * 9 / 5 + 32)) : "");
  };

  const handleCelsius = (v: string) => {
    setCelsius(v);
    const n = parseFloat(v);
    if (!isNaN(n)) fromCelsius(n);
    else { setFahrenheit(""); setKelvin(""); }
  };

  const handleFahrenheit = (v: string) => {
    setFahrenheit(v);
    const n = parseFloat(v);
    if (!isNaN(n)) fromFahrenheit(n);
    else { setCelsius(""); setKelvin(""); }
  };

  const handleKelvin = (v: string) => {
    setKelvin(v);
    const n = parseFloat(v);
    if (!isNaN(n)) fromKelvin(n);
    else { setCelsius(""); setFahrenheit(""); }
  };

  const clear = () => { setCelsius(""); setFahrenheit(""); setKelvin(""); };

  const fields = [
    { label: "Celsius (°C)", value: celsius, onChange: handleCelsius },
    { label: "Fahrenheit (°F)", value: fahrenheit, onChange: handleFahrenheit },
    { label: "Kelvin (K)", value: kelvin, onChange: handleKelvin },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={clear}
          className="text-sm px-3 py-1.5 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {fields.map((field) => (
          <div key={field.label} className="space-y-1">
            <label className="text-sm font-medium text-gray-400">{field.label}</label>
            <input
              type="number"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              placeholder="0"
              className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
            />
          </div>
        ))}
      </div>

      {/* Common Temps Reference */}
      <div className="mt-6 bg-gray-900 border border-gray-700 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Common Temperatures</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          {[
            { label: "Water freezes", c: 0 },
            { label: "Room temp", c: 22 },
            { label: "Body temp", c: 37 },
            { label: "Water boils", c: 100 },
            { label: "Absolute zero", c: -273.15 },
            { label: "Oven (medium)", c: 180 },
          ].map((ref) => (
            <button
              key={ref.label}
              onClick={() => handleCelsius(String(ref.c))}
              className="text-left p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className="text-gray-400">{ref.label}</div>
              <div className="text-indigo-400 font-mono">{ref.c}°C</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
