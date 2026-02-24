"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

// Simple ASCII art fonts using 5-row block letters
const FONTS: Record<string, Record<string, string[]>> = {
  block: {
    A: [" █████ ", "██   ██", "███████", "██   ██", "██   ██"],
    B: ["██████ ", "██   ██", "██████ ", "██   ██", "██████ "],
    C: [" █████ ", "██   ██", "██     ", "██   ██", " █████ "],
    D: ["██████ ", "██   ██", "██   ██", "██   ██", "██████ "],
    E: ["███████", "██     ", "█████  ", "██     ", "███████"],
    F: ["███████", "██     ", "█████  ", "██     ", "██     "],
    G: [" █████ ", "██     ", "██  ███", "██   ██", " ██████"],
    H: ["██   ██", "██   ██", "███████", "██   ██", "██   ██"],
    I: ["███████", "  ███  ", "  ███  ", "  ███  ", "███████"],
    J: ["███████", "    ██ ", "    ██ ", "██  ██ ", " █████ "],
    K: ["██   ██", "██  ██ ", "█████  ", "██  ██ ", "██   ██"],
    L: ["██     ", "██     ", "██     ", "██     ", "███████"],
    M: ["██   ██", "███ ███", "██ █ ██", "██   ██", "██   ██"],
    N: ["██   ██", "███  ██", "██ █ ██", "██  ███", "██   ██"],
    O: [" █████ ", "██   ██", "██   ██", "██   ██", " █████ "],
    P: ["██████ ", "██   ██", "██████ ", "██     ", "██     "],
    Q: [" █████ ", "██   ██", "██   ██", "██  ███", " ████ █"],
    R: ["██████ ", "██   ██", "██████ ", "██  ██ ", "██   ██"],
    S: [" █████ ", "██     ", " █████ ", "     ██", " █████ "],
    T: ["███████", "  ███  ", "  ███  ", "  ███  ", "  ███  "],
    U: ["██   ██", "██   ██", "██   ██", "██   ██", " █████ "],
    V: ["██   ██", "██   ██", "██   ██", " ██ ██ ", "  ███  "],
    W: ["██   ██", "██   ██", "██ █ ██", "███ ███", "██   ██"],
    X: ["██   ██", " ██ ██ ", "  ███  ", " ██ ██ ", "██   ██"],
    Y: ["██   ██", " ██ ██ ", "  ███  ", "  ███  ", "  ███  "],
    Z: ["███████", "    ██ ", "  ███  ", "██     ", "███████"],
    " ": ["       ", "       ", "       ", "       ", "       "],
    "0": [" █████ ", "██  ███", "██ █ ██", "███  ██", " █████ "],
    "1": ["  ██   ", " ███   ", "  ██   ", "  ██   ", "███████"],
    "2": [" █████ ", "██   ██", "   ███ ", " ██    ", "███████"],
    "3": ["██████ ", "     ██", " █████ ", "     ██", "██████ "],
    "4": ["██  ██ ", "██  ██ ", "███████", "    ██ ", "    ██ "],
    "5": ["███████", "██     ", "██████ ", "     ██", "██████ "],
    "6": [" █████ ", "██     ", "██████ ", "██   ██", " █████ "],
    "7": ["███████", "     ██", "   ███ ", "  ██   ", "  ██   "],
    "8": [" █████ ", "██   ██", " █████ ", "██   ██", " █████ "],
    "9": [" █████ ", "██   ██", " ██████", "     ██", " █████ "],
    "!": ["  ███  ", "  ███  ", "  ███  ", "       ", "  ███  "],
    "?": [" █████ ", "██   ██", "   ███ ", "       ", "   ██  "],
  },
};

// Simple small font variant (just uses # chars with smaller spacing)
const SMALL_FONT: Record<string, string[]> = {
  A: [" # ", "# #", "###", "# #", "# #"],
  B: ["## ", "# #", "## ", "# #", "## "],
  C: [" ##", "#  ", "#  ", "#  ", " ##"],
  D: ["## ", "# #", "# #", "# #", "## "],
  E: ["###", "#  ", "## ", "#  ", "###"],
  F: ["###", "#  ", "## ", "#  ", "#  "],
  G: [" ##", "#  ", "# #", "# #", " ##"],
  H: ["# #", "# #", "###", "# #", "# #"],
  I: ["###", " # ", " # ", " # ", "###"],
  J: ["  #", "  #", "  #", "# #", " # "],
  K: ["# #", "## ", "## ", "# #", "# #"],
  L: ["#  ", "#  ", "#  ", "#  ", "###"],
  M: ["# #", "###", "# #", "# #", "# #"],
  N: ["# #", "## ", "# #", "# #", "# #"],
  O: [" # ", "# #", "# #", "# #", " # "],
  P: ["## ", "# #", "## ", "#  ", "#  "],
  Q: [" # ", "# #", "# #", "###", "  #"],
  R: ["## ", "# #", "## ", "# #", "# #"],
  S: [" ##", "#  ", " # ", "  #", "## "],
  T: ["###", " # ", " # ", " # ", " # "],
  U: ["# #", "# #", "# #", "# #", " # "],
  V: ["# #", "# #", "# #", " # ", " # "],
  W: ["# #", "# #", "###", "###", "# #"],
  X: ["# #", " # ", " # ", " # ", "# #"],
  Y: ["# #", "# #", " # ", " # ", " # "],
  Z: ["###", "  #", " # ", "#  ", "###"],
  " ": ["   ", "   ", "   ", "   ", "   "],
  "0": [" # ", "# #", "# #", "# #", " # "],
  "1": [" # ", "## ", " # ", " # ", "###"],
  "2": [" # ", "# #", " ##", "#  ", "###"],
  "3": ["## ", "  #", " # ", "  #", "## "],
  "4": ["# #", "# #", "###", "  #", "  #"],
  "5": ["###", "#  ", "## ", "  #", "## "],
  "6": [" # ", "#  ", "## ", "# #", " # "],
  "7": ["###", "  #", " # ", " # ", " # "],
  "8": [" # ", "# #", " # ", "# #", " # "],
  "9": [" # ", "# #", " ##", "  #", " # "],
  "!": [" # ", " # ", " # ", "   ", " # "],
  "?": [" # ", "# #", " ##", "   ", " # "],
};

type FontName = "block" | "small";

function renderText(text: string, font: FontName): string {
  const upperText = text.toUpperCase().slice(0, 20);
  const glyphs = font === "block" ? FONTS.block : SMALL_FONT;
  const rows = 5;
  const lines: string[] = Array(rows).fill("");

  for (const char of upperText) {
    const glyph = glyphs[char] ?? glyphs[" "] ?? Array(5).fill("   ");
    for (let i = 0; i < rows; i++) {
      lines[i] += (lines[i] ? " " : "") + glyph[i];
    }
  }
  return lines.join("\n");
}

export default function AsciiArt() {
  const t = useTranslations("AsciiArt");
  const [input, setInput] = useState("");
  const [font, setFont] = useState<FontName>("block");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!input.trim()) return;
    setOutput(renderText(input, font));
  };

  const clear = () => { setInput(""); setOutput(""); };

  const copy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-400">{t("inputLabel")}</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
          placeholder={t("inputPlaceholder")}
          maxLength={20}
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-400">{t("fontLabel")}</label>
        <div className="flex gap-2">
          {(["block", "small"] as FontName[]).map((f) => (
            <button
              key={f}
              onClick={() => setFont(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${font === f ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
            >
              {f === "block" ? t("fontBlock") : t("fontShadow")}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={generate} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
          {t("generateButton")}
        </button>
        <button onClick={clear} className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
          {t("clearButton")}
        </button>
      </div>

      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-400">{t("outputLabel")}</label>
            <button onClick={copy} className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors">
              {copied ? "Copied!" : t("copyButton")}
            </button>
          </div>
          <pre className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-green-400 font-mono text-xs leading-tight overflow-x-auto whitespace-pre">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
