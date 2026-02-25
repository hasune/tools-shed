"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

function base64urlEncode(data: Uint8Array): string {
  return btoa(String.fromCharCode(...data))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function toBytes(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

function toBuffer(str: string): ArrayBuffer {
  return toBytes(str).buffer as ArrayBuffer;
}

const DEFAULT_HEADER = JSON.stringify({ alg: "HS256", typ: "JWT" }, null, 2);
const DEFAULT_PAYLOAD = JSON.stringify(
  { sub: "1234567890", name: "John Doe", iat: 1516239022 },
  null,
  2
);

export default function JwtGenerator() {
  const t = useTranslations("JwtGenerator");
  const [header, setHeader] = useState(DEFAULT_HEADER);
  const [payload, setPayload] = useState(DEFAULT_PAYLOAD);
  const [secret, setSecret] = useState("your-256-bit-secret");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    try {
      const headerObj = JSON.parse(header);
      const payloadObj = JSON.parse(payload);

      const headerB64 = base64urlEncode(toBytes(JSON.stringify(headerObj)));
      const payloadB64 = base64urlEncode(toBytes(JSON.stringify(payloadObj)));
      const signingInput = `${headerB64}.${payloadB64}`;

      const key = await crypto.subtle.importKey(
        "raw",
        toBuffer(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const sig = await crypto.subtle.sign("HMAC", key, toBuffer(signingInput));
      const sigB64 = base64urlEncode(new Uint8Array(sig));

      setOutput(`${signingInput}.${sigB64}`);
      setError("");
    } catch (e: any) {
      setError(e.message ?? "Error generating JWT");
      setOutput("");
    }
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const clear = () => {
    setHeader(DEFAULT_HEADER);
    setPayload(DEFAULT_PAYLOAD);
    setSecret("your-256-bit-secret");
    setOutput("");
    setError("");
  };

  return (
    <div className="space-y-5">
      <div className="p-3 bg-yellow-950/40 border border-yellow-700 rounded-lg">
        <p className="text-xs text-yellow-400">{t("warningLabel")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("headerLabel")}</label>
          <textarea
            value={header}
            onChange={(e) => setHeader(e.target.value)}
            rows={5}
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 resize-y"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("payloadLabel")}</label>
          <textarea
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            rows={5}
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 resize-y"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-400">{t("secretLabel")}</label>
        <input
          type="text"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder={t("secretPlaceholder")}
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button onClick={generate} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">{t("generateButton")}</button>
        <button onClick={clear} className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">{t("clearButton")}</button>
      </div>

      {output && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-400">{t("outputLabel")}</label>
            <button onClick={copy} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
              {copied ? "Copied!" : t("copyButton")}
            </button>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 break-all">
            <span className="text-red-400 font-mono text-sm">{output.split(".")[0]}</span>
            <span className="text-gray-500">.</span>
            <span className="text-purple-400 font-mono text-sm">{output.split(".")[1]}</span>
            <span className="text-gray-500">.</span>
            <span className="text-cyan-400 font-mono text-sm">{output.split(".")[2]}</span>
          </div>
        </div>
      )}
    </div>
  );
}
