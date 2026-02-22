"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

function toDecimal(value: string, base: number): number | null {
  if (!value.trim()) return null;
  const n = parseInt(value.trim(), base);
  return isNaN(n) ? null : n;
}

export default function NumberBaseConverter() {
  const t = useTranslations("NumberBaseConverter");
  const tCommon = useTranslations("Common");

  const [decimal, setDecimal] = useState("");
  const [binary, setBinary] = useState("");
  const [octal, setOctal] = useState("");
  const [hex, setHex] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDecimal = (val: string) => {
    setDecimal(val);
    const n = toDecimal(val, 10);
    if (n !== null && n >= 0) {
      setBinary(n.toString(2));
      setOctal(n.toString(8));
      setHex(n.toString(16).toUpperCase());
    } else if (!val.trim()) {
      setBinary(""); setOctal(""); setHex("");
    }
  };

  const handleBinary = (val: string) => {
    setBinary(val);
    const n = toDecimal(val, 2);
    if (n !== null && n >= 0) {
      setDecimal(n.toString(10));
      setOctal(n.toString(8));
      setHex(n.toString(16).toUpperCase());
    } else if (!val.trim()) {
      setDecimal(""); setOctal(""); setHex("");
    }
  };

  const handleOctal = (val: string) => {
    setOctal(val);
    const n = toDecimal(val, 8);
    if (n !== null && n >= 0) {
      setDecimal(n.toString(10));
      setBinary(n.toString(2));
      setHex(n.toString(16).toUpperCase());
    } else if (!val.trim()) {
      setDecimal(""); setBinary(""); setHex("");
    }
  };

  const handleHex = (val: string) => {
    const upper = val.toUpperCase();
    setHex(upper);
    const n = toDecimal(upper, 16);
    if (n !== null && n >= 0) {
      setDecimal(n.toString(10));
      setBinary(n.toString(2));
      setOctal(n.toString(8));
    } else if (!val.trim()) {
      setDecimal(""); setBinary(""); setOctal("");
    }
  };

  const clearAll = () => {
    setDecimal(""); setBinary(""); setOctal(""); setHex("");
  };

  const fields = [
    { label: t("decimalLabel"), subtitle: t("base10"), value: decimal, onChange: handleDecimal, key: "dec" },
    { label: t("binaryLabel"), subtitle: t("base2"), value: binary, onChange: handleBinary, key: "bin" },
    { label: t("octalLabel"), subtitle: t("base8"), value: octal, onChange: handleOctal, key: "oct" },
    { label: t("hexLabel"), subtitle: t("base16"), value: hex, onChange: handleHex, key: "hex" },
  ];

  return (
    <div className="space-y-4">
      {fields.map(({ label, subtitle, value, onChange, key }) => (
        <div key={key} className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-gray-300">{label}</span>
              <span className="text-xs text-gray-500 ml-2">({subtitle})</span>
            </div>
            <button
              onClick={() => copyToClipboard(value, key)}
              disabled={!value}
              className="text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-30 transition-colors"
            >
              {copied === key ? tCommon("copied") : tCommon("copy")}
            </button>
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 text-white font-mono text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
            placeholder={t("inputPlaceholder")}
          />
        </div>
      ))}
      <button
        onClick={clearAll}
        className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm rounded-lg transition-colors"
      >
        {tCommon("clear")}
      </button>
    </div>
  );
}
