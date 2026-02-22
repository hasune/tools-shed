"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Tab = "encode" | "decode";
type Separator = "space" | "dash" | "none";
type Encoding = "binary" | "hex" | "octal" | "decimal";

function textToBinary(text: string, separator: Separator): string {
  const sep = separator === "space" ? " " : separator === "dash" ? "-" : "";
  return text
    .split("")
    .map((ch) => ch.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(sep);
}

function textToHex(text: string, separator: Separator): string {
  const sep = separator === "space" ? " " : separator === "dash" ? "-" : "";
  return text
    .split("")
    .map((ch) => ch.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0"))
    .join(sep);
}

function textToOctal(text: string, separator: Separator): string {
  const sep = separator === "space" ? " " : separator === "dash" ? "-" : "";
  return text
    .split("")
    .map((ch) => ch.charCodeAt(0).toString(8))
    .join(sep);
}

function textToDecimal(text: string, separator: Separator): string {
  const sep = separator === "space" ? " " : separator === "dash" ? "-" : "";
  return text
    .split("")
    .map((ch) => ch.charCodeAt(0).toString(10))
    .join(sep);
}

function binaryToText(encoded: string): string {
  const tokens = encoded.trim().split(/[\s\-]+/);
  return tokens
    .map((t) => {
      const code = parseInt(t, 2);
      return isNaN(code) ? "?" : String.fromCharCode(code);
    })
    .join("");
}

function hexToText(encoded: string): string {
  const tokens = encoded.trim().split(/[\s\-]+/);
  return tokens
    .map((t) => {
      const code = parseInt(t, 16);
      return isNaN(code) ? "?" : String.fromCharCode(code);
    })
    .join("");
}

function octalToText(encoded: string): string {
  const tokens = encoded.trim().split(/[\s\-]+/);
  return tokens
    .map((t) => {
      const code = parseInt(t, 8);
      return isNaN(code) ? "?" : String.fromCharCode(code);
    })
    .join("");
}

function decimalToText(encoded: string): string {
  const tokens = encoded.trim().split(/[\s\-]+/);
  return tokens
    .map((t) => {
      const code = parseInt(t, 10);
      return isNaN(code) ? "?" : String.fromCharCode(code);
    })
    .join("");
}

export default function TextToBinary() {
  const t = useTranslations("TextToBinary");

  const [tab, setTab] = useState<Tab>("encode");

  // encode tab state
  const [inputText, setInputText] = useState("");
  const [separator, setSeparator] = useState<Separator>("space");
  const [copied, setCopied] = useState<string | null>(null);

  // decode tab state
  const [encodedInput, setEncodedInput] = useState("");
  const [decodeType, setDecodeType] = useState<Encoding>("binary");
  const [decodedOutput, setDecodedOutput] = useState("");
  const [decodeError, setDecodeError] = useState("");
  const [copiedDecode, setCopiedDecode] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyDecoded = () => {
    if (!decodedOutput) return;
    navigator.clipboard.writeText(decodedOutput);
    setCopiedDecode(true);
    setTimeout(() => setCopiedDecode(false), 2000);
  };

  const handleDecode = () => {
    setDecodeError("");
    try {
      let result = "";
      if (decodeType === "binary") result = binaryToText(encodedInput);
      else if (decodeType === "hex") result = hexToText(encodedInput);
      else if (decodeType === "octal") result = octalToText(encodedInput);
      else result = decimalToText(encodedInput);
      setDecodedOutput(result);
    } catch {
      setDecodeError(t("decodeError"));
      setDecodedOutput("");
    }
  };

  const binaryOut = inputText ? textToBinary(inputText, separator) : "";
  const hexOut = inputText ? textToHex(inputText, separator) : "";
  const octalOut = inputText ? textToOctal(inputText, separator) : "";
  const decimalOut = inputText ? textToDecimal(inputText, separator) : "";

  const encodeOutputs = [
    { key: "binary", label: t("binaryLabel"), value: binaryOut },
    { key: "hex", label: t("hexLabel"), value: hexOut },
    { key: "octal", label: t("octalLabel"), value: octalOut },
    { key: "decimal", label: t("decimalLabel"), value: decimalOut },
  ];

  const encodingOptions: { value: Encoding; label: string }[] = [
    { value: "binary", label: t("binaryLabel") },
    { value: "hex", label: t("hexLabel") },
    { value: "octal", label: t("octalLabel") },
    { value: "decimal", label: t("decimalLabel") },
  ];

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-900 rounded-lg border border-gray-700 w-fit">
        <button
          onClick={() => setTab("encode")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === "encode" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          {t("encodeTab")}
        </button>
        <button
          onClick={() => setTab("decode")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === "decode" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          {t("decodeTab")}
        </button>
      </div>

      {tab === "encode" && (
        <div className="space-y-4">
          {/* Text input */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">{t("textInputLabel")}</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
              placeholder={t("textInputPlaceholder")}
              className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 resize-y placeholder-gray-600"
            />
          </div>

          {/* Separator */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-400 shrink-0">{t("separatorLabel")}</label>
            <select
              value={separator}
              onChange={(e) => setSeparator(e.target.value as Separator)}
              className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              <option value="space">{t("separatorSpace")}</option>
              <option value="dash">{t("separatorDash")}</option>
              <option value="none">{t("separatorNone")}</option>
            </select>
          </div>

          {/* Outputs */}
          <div className="space-y-3">
            {encodeOutputs.map(({ key, label, value }) => (
              <div key={key} className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-300">{label}</span>
                  <button
                    onClick={() => copyToClipboard(value, key)}
                    disabled={!value}
                    className="text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-30 transition-colors"
                  >
                    {copied === key ? t("copied") : t("copy")}
                  </button>
                </div>
                <div className="min-h-[44px] bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 font-mono text-xs text-gray-300 break-all">
                  {value || <span className="text-gray-600">{t("outputPlaceholder")}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "decode" && (
        <div className="space-y-4">
          {/* Encoded input */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">{t("encodedInputLabel")}</label>
            <textarea
              value={encodedInput}
              onChange={(e) => setEncodedInput(e.target.value)}
              rows={4}
              placeholder={t("encodedInputPlaceholder")}
              className="w-full bg-gray-900 border border-gray-600 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 resize-y placeholder-gray-600"
            />
          </div>

          {/* Encoding type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">{t("encodingTypeLabel")}</label>
            <div className="flex flex-wrap gap-2">
              {encodingOptions.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setDecodeType(value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    decodeType === value
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:text-white border border-gray-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Decode button */}
          <button
            onClick={handleDecode}
            disabled={!encodedInput.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {t("decodeButton")}
          </button>

          {/* Error */}
          {decodeError && (
            <p className="text-sm text-red-400">{decodeError}</p>
          )}

          {/* Output */}
          {decodedOutput && (
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-300">{t("decodedOutputLabel")}</span>
                <button
                  onClick={copyDecoded}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {copiedDecode ? t("copied") : t("copy")}
                </button>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white break-all whitespace-pre-wrap">
                {decodedOutput}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
