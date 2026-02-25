"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type CipherType = "caesar" | "rot13" | "vigenere";
type Mode = "encode" | "decode";

function caesarShift(text: string, shift: number, decode: boolean): string {
  const s = decode ? (26 - shift) % 26 : shift;
  return text.replace(/[a-zA-Z]/g, (ch) => {
    const base = ch >= "a" ? 97 : 65;
    return String.fromCharCode(((ch.charCodeAt(0) - base + s) % 26) + base);
  });
}

function rot13(text: string): string {
  return caesarShift(text, 13, false);
}

function vigenereProcess(text: string, key: string, decode: boolean): string {
  if (!key.replace(/[^a-zA-Z]/g, "")) return text;
  const cleanKey = key.replace(/[^a-zA-Z]/g, "").toUpperCase();
  let keyIdx = 0;
  return text.replace(/[a-zA-Z]/g, (ch) => {
    const base = ch >= "a" ? 97 : 65;
    const shift = cleanKey.charCodeAt(keyIdx % cleanKey.length) - 65;
    keyIdx++;
    const s = decode ? (26 - shift) % 26 : shift;
    return String.fromCharCode(((ch.charCodeAt(0) - base + s) % 26) + base);
  });
}

export default function CipherTool() {
  const t = useTranslations("CipherTool");
  const [cipher, setCipher] = useState<CipherType>("caesar");
  const [mode, setMode] = useState<Mode>("encode");
  const [shift, setShift] = useState(3);
  const [keyword, setKeyword] = useState("KEY");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const process = () => {
    const decode = mode === "decode";
    let result = "";
    if (cipher === "caesar") result = caesarShift(input, shift, decode);
    else if (cipher === "rot13") result = rot13(input);
    else result = vigenereProcess(input, keyword, decode);
    setOutput(result);
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const clear = () => { setInput(""); setOutput(""); };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("cipherLabel")}</label>
          <div className="flex gap-2">
            {(["caesar", "rot13", "vigenere"] as CipherType[]).map((c) => (
              <button
                key={c}
                onClick={() => setCipher(c)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${cipher === c ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
              >
                {t(c)}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("modeLabel")}</label>
          <div className="flex gap-2">
            {(["encode", "decode"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === m ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
              >
                {t(m)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {cipher === "caesar" && (
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("shiftLabel")}</label>
          <div className="flex items-center gap-3">
            <input
              type="range" min={0} max={25} value={shift}
              onChange={(e) => setShift(Number(e.target.value))}
              className="flex-1 accent-indigo-500"
            />
            <span className="w-8 text-center text-white font-mono">{shift}</span>
          </div>
        </div>
      )}

      {cipher === "vigenere" && (
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-400">{t("keywordLabel")}</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value.toUpperCase())}
            placeholder={t("keywordPlaceholder")}
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
          />
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-400">{t("inputLabel")}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 resize-y"
        />
      </div>

      <div className="flex gap-3">
        <button onClick={process} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">{t("processButton")}</button>
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
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
            <p className="text-white font-mono text-sm whitespace-pre-wrap break-all">{output}</p>
          </div>
        </div>
      )}
    </div>
  );
}
