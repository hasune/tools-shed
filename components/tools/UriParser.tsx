"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface Parsed {
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  params: [string, string][];
  hash: string;
  origin: string;
}

function parseUrl(raw: string): Parsed | null {
  try {
    const url = new URL(raw.trim());
    const params: [string, string][] = [];
    url.searchParams.forEach((v, k) => params.push([k, v]));
    return {
      protocol: url.protocol,
      host: url.host,
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
      search: url.search,
      params,
      hash: url.hash,
      origin: url.origin,
    };
  } catch {
    return null;
  }
}

const SAMPLE = "https://example.com:8080/products/search?category=books&sort=price&page=2#results";

export default function UriParser() {
  const t = useTranslations("UriParser");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Parsed | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const parse = (val?: string) => {
    const raw = val ?? input;
    setError("");
    const parsed = parseUrl(raw);
    if (!parsed) { setError(t("invalidUrl")); setResult(null); return; }
    setResult(parsed);
  };

  const loadSample = () => { setInput(SAMPLE); parse(SAMPLE); };
  const clear = () => { setInput(""); setResult(null); setError(""); };

  const copy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const Row = ({ label, value, copyKey }: { label: string; value: string; copyKey: string }) => {
    if (!value) return null;
    return (
      <tr className="border-b border-gray-700">
        <td className="px-4 py-2 text-gray-400 text-sm w-36">{label}</td>
        <td className="px-4 py-2 font-mono text-sm text-indigo-300 break-all">{value}</td>
        <td className="px-4 py-2 text-right">
          <button onClick={() => copy(value, copyKey)}
            className="text-xs text-gray-400 hover:text-white transition-colors">
            {copied === copyKey ? "✓" : t("copyButton")}
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{t("inputLabel")}</label>
        <input type="text" value={input}
          onChange={(e) => { setInput(e.target.value); setResult(null); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && parse()}
          placeholder={t("placeholder")}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-indigo-500" />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button onClick={() => parse()} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg transition-colors">
          {t("parseButton")}
        </button>
        <button onClick={loadSample} className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
          {t("sampleButton")}
        </button>
        <button onClick={clear} className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {result && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <table className="w-full">
            <tbody>
              <Row label={t("protocolLabel")} value={result.protocol} copyKey="protocol" />
              <Row label={t("originLabel")} value={result.origin} copyKey="origin" />
              <Row label={t("hostLabel")} value={result.host} copyKey="host" />
              <Row label={t("hostnameLabel")} value={result.hostname} copyKey="hostname" />
              <Row label={t("portLabel")} value={result.port} copyKey="port" />
              <Row label={t("pathLabel")} value={result.pathname} copyKey="path" />
              <Row label={t("queryLabel")} value={result.search} copyKey="query" />
              <Row label={t("hashLabel")} value={result.hash} copyKey="hash" />
            </tbody>
          </table>
          {result.params.length > 0 && (
            <div className="border-t border-gray-700 p-4">
              <p className="text-sm font-medium text-gray-300 mb-2">{t("paramsLabel")}</p>
              <div className="space-y-1">
                {result.params.map(([k, v]) => (
                  <div key={k} className="flex gap-2 text-sm font-mono">
                    <span className="text-yellow-400">{k}</span>
                    <span className="text-gray-500">=</span>
                    <span className="text-green-400">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
