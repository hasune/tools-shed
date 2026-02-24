"use client";
import { useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";

export default function TextToSpeech() {
  const t = useTranslations("TextToSpeech");

  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(100);
  const [status, setStatus] = useState<"idle" | "speaking" | "paused">("idle");
  const [supported, setSupported] = useState(true);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }

    function loadVoices() {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
      if (v.length > 0 && !selectedVoice) {
        const en = v.find((vv) => vv.lang.startsWith("en"));
        setSelectedVoice(en?.name ?? v[0].name);
      }
    }

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  function speak() {
    if (!text.trim()) return;
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utter.voice = voice;
    utter.rate = rate;
    utter.pitch = pitch;
    utter.volume = volume / 100;
    utter.onstart = () => setStatus("speaking");
    utter.onend = () => setStatus("idle");
    utter.onerror = () => setStatus("idle");
    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
  }

  function pause() {
    window.speechSynthesis.pause();
    setStatus("paused");
  }

  function resume() {
    window.speechSynthesis.resume();
    setStatus("speaking");
  }

  function stop() {
    window.speechSynthesis.cancel();
    setStatus("idle");
  }

  if (!supported) {
    return <p className="text-red-400">{t("notSupported")}</p>;
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{t("inputLabel")}</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("inputPlaceholder")}
          rows={5}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
        />
      </div>

      {voices.length === 0 ? (
        <p className="text-gray-500 text-sm">{t("noVoices")}</p>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">{t("voiceLabel")}</label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          >
            {voices.map((v) => (
              <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t("rateLabel", { rate: rate.toFixed(1) })}
          </label>
          <input type="range" min={0.5} max={2} step={0.1} value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full accent-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t("pitchLabel", { pitch: pitch.toFixed(1) })}
          </label>
          <input type="range" min={0} max={2} step={0.1} value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="w-full accent-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t("volumeLabel", { volume })}
          </label>
          <input type="range" min={0} max={100} step={5} value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="w-full accent-indigo-500" />
        </div>
      </div>

      <div className="flex gap-3">
        {status === "idle" && (
          <button onClick={speak} disabled={!text.trim()}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            {t("speakButton")}
          </button>
        )}
        {status === "speaking" && (
          <>
            <button onClick={pause}
              className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              {t("pauseButton")}
            </button>
            <button onClick={stop}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-4 rounded-lg transition-colors">
              {t("stopButton")}
            </button>
          </>
        )}
        {status === "paused" && (
          <>
            <button onClick={resume}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              {t("resumeButton")}
            </button>
            <button onClick={stop}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-4 rounded-lg transition-colors">
              {t("stopButton")}
            </button>
          </>
        )}
      </div>

      {status === "speaking" && (
        <div className="flex items-center gap-2 text-indigo-400 text-sm">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Speaking...
        </div>
      )}
    </div>
  );
}
