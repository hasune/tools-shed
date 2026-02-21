"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface JwtPayload {
  [key: string]: unknown;
}

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return atob(padded);
}

function decodeJwt(token: string): { header: JwtPayload; payload: JwtPayload; signature: string } | null {
  const parts = token.trim().split(".");
  if (parts.length !== 3) return null;
  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return { header, payload, signature: parts[2] };
  } catch {
    return null;
  }
}

function formatTimestamp(value: unknown): string {
  if (typeof value !== "number") return String(value);
  const date = new Date(value * 1000);
  return `${value} (${date.toUTCString()})`;
}

const TIMESTAMP_KEYS = ["exp", "iat", "nbf", "auth_time", "updated_at"];

function JsonView({ data }: { data: JwtPayload }) {
  return (
    <div className="space-y-1">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex gap-2 text-sm flex-wrap">
          <span className="text-indigo-400 font-mono">{key}:</span>
          <span className="text-gray-300 font-mono break-all">
            {TIMESTAMP_KEYS.includes(key) && typeof value === "number"
              ? formatTimestamp(value)
              : JSON.stringify(value)}
          </span>
        </div>
      ))}
    </div>
  );
}

const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MDAwMDAwMDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export default function JwtDecoder() {
  const t = useTranslations("JwtDecoder");
  const tCommon = useTranslations("Common");

  const [input, setInput] = useState("");
  const [decoded, setDecoded] = useState<ReturnType<typeof decodeJwt>>(null);
  const [error, setError] = useState("");

  const decode = () => {
    if (!input.trim()) {
      setDecoded(null);
      setError("");
      return;
    }
    const result = decodeJwt(input);
    if (!result) {
      setError("Invalid JWT. Must have 3 dot-separated base64url parts.");
      setDecoded(null);
    } else {
      setDecoded(result);
      setError("");
    }
  };

  const loadSample = () => {
    setInput(SAMPLE_JWT);
    setDecoded(null);
    setError("");
  };

  const isExpired = () => {
    if (!decoded?.payload?.exp || typeof decoded.payload.exp !== "number") return null;
    return decoded.payload.exp * 1000 < Date.now();
  };

  const expiredStatus = decoded ? isExpired() : null;

  return (
    <div className="space-y-4">
      {/* Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">{t("inputLabel")}</label>
          <button
            onClick={loadSample}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            {tCommon("sample")}
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("inputPlaceholder")}
          className="w-full h-28 bg-gray-900 border border-gray-600 text-gray-100 text-sm font-mono rounded-lg p-3 resize-none focus:outline-none focus:border-indigo-500 placeholder-gray-600 break-all"
          spellCheck={false}
        />
      </div>

      <button
        onClick={decode}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors"
      >
        {t("decodeButton")}
      </button>

      {error && (
        <div className="bg-red-950/30 border border-red-800 rounded-lg p-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {decoded && (
        <div className="space-y-4">
          {/* Expiry Status */}
          {expiredStatus !== null && (
            <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${expiredStatus ? "bg-red-950/30 border border-red-800 text-red-400" : "bg-green-950/30 border border-green-800 text-green-400"}`}>
              <span>{expiredStatus ? t("tokenExpired") : t("tokenValid")}</span>
            </div>
          )}

          {/* Header */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
              <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">{t("headerLabel")}</span>
            </div>
            <div className="p-4">
              <JsonView data={decoded.header} />
            </div>
          </div>

          {/* Payload */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">{t("payloadLabel")}</span>
            </div>
            <div className="p-4">
              <JsonView data={decoded.payload} />
            </div>
          </div>

          {/* Signature */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
              <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">{t("signatureLabel")}</span>
              <span className="text-xs text-gray-500 ml-2">{t("signatureNotVerified")}</span>
            </div>
            <div className="p-4">
              <code className="text-xs font-mono text-yellow-300 break-all">{decoded.signature}</code>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-sm text-gray-400">
        <p>{t("notVerifiedNote")}</p>
      </div>
    </div>
  );
}
