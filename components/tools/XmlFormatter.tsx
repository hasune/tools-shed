"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

function serializeNode(node: Node, indent: string, level: number): string {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.trim() ?? "";
    return text ? indent.repeat(level) + text : "";
  }
  if (node.nodeType === Node.COMMENT_NODE) {
    return indent.repeat(level) + `<!--${node.textContent}-->`;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return "";
  const el = node as Element;
  const tag = el.tagName;
  const attrs = Array.from(el.attributes)
    .map((a) => ` ${a.name}="${a.value}"`)
    .join("");
  const children = Array.from(el.childNodes)
    .map((c) => serializeNode(c, indent, level + 1))
    .filter(Boolean);
  const pad = indent.repeat(level);
  if (children.length === 0) return `${pad}<${tag}${attrs} />`;
  if (children.length === 1 && !children[0].includes("\n")) {
    return `${pad}<${tag}${attrs}>${children[0].trim()}</${tag}>`;
  }
  return `${pad}<${tag}${attrs}>\n${children.join("\n")}\n${pad}</${tag}>`;
}

const SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book id="bk101"><author>Gambardella, Matthew</author><title>XML Developer's Guide</title><price>44.95</price></book>
  <book id="bk102"><author>Ralls, Kim</author><title>Midnight Rain</title><price>5.95</price></book>
</catalog>`;

export default function XmlFormatter() {
  const t = useTranslations("XmlFormatter");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState<1 | 2 | 4>(2);
  const [copied, setCopied] = useState(false);

  const format = () => {
    if (!input.trim()) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, "application/xml");
    const parseError = doc.querySelector("parsererror");
    if (parseError) {
      setError(t("invalidXml") + ": " + (parseError.textContent?.split("\n")[0] ?? ""));
      setOutput("");
      return;
    }
    const ind = " ".repeat(indent);
    const lines: string[] = [];
    if (input.trimStart().startsWith("<?xml")) {
      lines.push(input.trimStart().split("?>")[0] + "?>");
    }
    lines.push(serializeNode(doc.documentElement, ind, 0));
    setOutput(lines.join("\n"));
    setError(t("validXml"));
  };

  const minify = () => {
    if (!input.trim()) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, "application/xml");
    if (doc.querySelector("parsererror")) { setError(t("invalidXml")); setOutput(""); return; }
    const s = new XMLSerializer();
    setOutput(s.serializeToString(doc).replace(/>\s+</g, "><"));
    setError(t("validXml"));
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const clear = () => { setInput(""); setOutput(""); setError(""); };

  const indentOptions: [1 | 2 | 4, string][] = [[1, "1"], [2, t("twoSpaces")], [4, t("fourSpaces")]];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-gray-400">{t("indentLabel")}</span>
        {indentOptions.map(([n, label]) => (
          <button key={n} onClick={() => setIndent(n)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${indent === n ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-400">{t("inputLabel")}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("inputPlaceholder")}
          rows={8}
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600 resize-y"
        />
      </div>

      {error && (
        <p className={`text-sm ${error === t("validXml") ? "text-green-400" : "text-red-400"}`}>{error}</p>
      )}

      <div className="flex flex-wrap gap-3">
        <button onClick={format} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">{t("formatButton")}</button>
        <button onClick={minify} className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">{t("minifyButton")}</button>
        <button onClick={() => { setInput(SAMPLE); setOutput(""); setError(""); }} className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">{t("sampleButton")}</button>
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
          <pre className="w-full bg-gray-900 border border-gray-700 text-green-300 text-sm font-mono rounded-lg px-3 py-3 overflow-auto max-h-96 whitespace-pre">{output}</pre>
        </div>
      )}
    </div>
  );
}
