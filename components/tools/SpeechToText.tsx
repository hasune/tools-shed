"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";

const LANGUAGES = [
  { code: "en-US", label: "English (US)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "ja-JP", label: "日本語" },
  { code: "ko-KR", label: "한국어" },
  { code: "zh-CN", label: "中文（普通话）" },
  { code: "es-ES", label: "Español" },
  { code: "pt-BR", label: "Português (Brasil)" },
  { code: "fr-FR", label: "Français" },
  { code: "de-DE", label: "Deutsch" },
  { code: "ru-RU", label: "Русский" },
  { code: "it-IT", label: "Italiano" },
  { code: "tr-TR", label: "Türkçe" },
  { code: "id-ID", label: "Bahasa Indonesia" },
];

export default function SpeechToText() {
  const t = useTranslations("SpeechToText");
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");
  const [lang, setLang] = useState("en-US");
  const [copied, setCopied] = useState(false);
  const recognitionRef = useRef<any>(null);

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const start = () => {
    if (!isSupported) {
      setError(t("notSupportedError"));
      return;
    }
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onresult = (e: any) => {
      let final = "";
      let interim = "";
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + " ";
        else interim += e.results[i][0].transcript;
      }
      setTranscript(final + interim);
    };

    recognition.onerror = (e: any) => {
      if (e.error === "not-allowed") setError(t("permissionError"));
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
    setIsListening(true);
    setError("");
  };

  const stop = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const copy = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-400">{t("languageLabel")}</label>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        {!isListening ? (
          <button
            onClick={start}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-white inline-block" />
            {t("startButton")}
          </button>
        ) : (
          <button
            onClick={stop}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse inline-block" />
            {t("stopButton")}
          </button>
        )}
        <button
          onClick={() => setTranscript("")}
          className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {t("clearButton")}
        </button>
      </div>

      {isListening && (
        <p className="text-sm text-red-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse inline-block" />
          {t("listenLabel")}
        </p>
      )}

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-400">{t("outputLabel")}</label>
          {transcript && (
            <button
              onClick={copy}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {copied ? "Copied!" : t("copyButton")}
            </button>
          )}
        </div>
        <textarea
          value={transcript}
          readOnly
          placeholder={t("outputPlaceholder")}
          rows={8}
          className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none placeholder-gray-600 resize-y"
        />
      </div>
    </div>
  );
}
