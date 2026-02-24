"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface SubnetInfo {
  networkAddress: string;
  broadcastAddress: string;
  subnetMask: string;
  wildcardMask: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  usableHosts: number;
  cidr: string;
  ipClass: string;
}

function ipToLong(ip: string): number {
  return ip.split(".").reduce((acc, oct) => (acc << 8) + parseInt(oct), 0) >>> 0;
}

function longToIp(long: number): string {
  return [
    (long >>> 24) & 0xff,
    (long >>> 16) & 0xff,
    (long >>> 8) & 0xff,
    long & 0xff,
  ].join(".");
}

function getClass(firstOctet: number): string {
  if (firstOctet < 128) return "A";
  if (firstOctet < 192) return "B";
  if (firstOctet < 224) return "C";
  if (firstOctet < 240) return "D (Multicast)";
  return "E (Reserved)";
}

function calcSubnet(input: string): SubnetInfo | null {
  const match = input.trim().match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})$/);
  if (!match) return null;
  const ip = match[1];
  const prefix = parseInt(match[2]);
  if (prefix < 0 || prefix > 32) return null;
  const parts = ip.split(".").map(Number);
  if (parts.some((p) => p < 0 || p > 255)) return null;

  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const wildcard = (~mask) >>> 0;
  const ipLong = ipToLong(ip);
  const network = (ipLong & mask) >>> 0;
  const broadcast = (network | wildcard) >>> 0;
  const totalHosts = Math.pow(2, 32 - prefix);
  const usable = prefix >= 31 ? totalHosts : Math.max(0, totalHosts - 2);

  return {
    networkAddress: longToIp(network),
    broadcastAddress: longToIp(broadcast),
    subnetMask: longToIp(mask),
    wildcardMask: longToIp(wildcard),
    firstHost: prefix >= 31 ? longToIp(network) : longToIp(network + 1),
    lastHost: prefix >= 31 ? longToIp(broadcast) : longToIp(broadcast - 1),
    totalHosts,
    usableHosts: usable,
    cidr: `${longToIp(network)}/${prefix}`,
    ipClass: getClass(parts[0]),
  };
}

export default function IpSubnetCalculator() {
  const t = useTranslations("IpSubnetCalculator");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<SubnetInfo | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    const r = calcSubnet(input);
    if (!r) {
      setError(t("invalidInput"));
      setResult(null);
    } else {
      setError("");
      setResult(r);
    }
  };

  const clear = () => { setInput(""); setResult(null); setError(""); };

  const rows: Array<[string, string]> = result ? [
    [t("networkAddress"), result.networkAddress],
    [t("broadcastAddress"), result.broadcastAddress],
    [t("subnetMask"), result.subnetMask],
    [t("wildcardMask"), result.wildcardMask],
    [t("firstHost"), result.firstHost],
    [t("lastHost"), result.lastHost],
    [t("totalHosts"), result.totalHosts.toLocaleString()],
    [t("usableHosts"), result.usableHosts.toLocaleString()],
    [t("cidrNotation"), result.cidr],
    [t("ipClass"), result.ipClass],
  ] : [];

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-400">{t("ipLabel")}</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && calculate()}
            placeholder={t("ipPlaceholder")}
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 font-mono focus:outline-none focus:border-indigo-500 placeholder-gray-600"
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button onClick={calculate} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
          {t("calculateButton")}
        </button>
        <button onClick={clear} className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {result && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {rows.map(([label, value], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-gray-900" : "bg-gray-800/50"}>
                  <td className="px-4 py-2.5 text-gray-400 font-medium w-1/2">{label}</td>
                  <td className="px-4 py-2.5 text-white font-mono">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
