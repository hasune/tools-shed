"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const MIME_DB: Record<string, string> = {
  // Images
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif",
  webp: "image/webp", svg: "image/svg+xml", ico: "image/x-icon", bmp: "image/bmp",
  tiff: "image/tiff", tif: "image/tiff", avif: "image/avif",
  // Video
  mp4: "video/mp4", webm: "video/webm", ogg: "video/ogg", ogv: "video/ogg",
  avi: "video/x-msvideo", mov: "video/quicktime", mkv: "video/x-matroska",
  flv: "video/x-flv", wmv: "video/x-ms-wmv", m4v: "video/x-m4v",
  // Audio
  mp3: "audio/mpeg", wav: "audio/wav", ogg_audio: "audio/ogg", flac: "audio/flac",
  aac: "audio/aac", m4a: "audio/x-m4a", opus: "audio/opus", weba: "audio/webm",
  // Documents
  pdf: "application/pdf", doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  // Text
  txt: "text/plain", html: "text/html", htm: "text/html", css: "text/css",
  js: "text/javascript", mjs: "text/javascript", ts: "application/typescript",
  json: "application/json", xml: "application/xml", csv: "text/csv",
  md: "text/markdown", yaml: "application/yaml", yml: "application/yaml",
  // Archives
  zip: "application/zip", gz: "application/gzip", tar: "application/x-tar",
  rar: "application/vnd.rar", "7z": "application/x-7z-compressed",
  bz2: "application/x-bzip2",
  // Fonts
  woff: "font/woff", woff2: "font/woff2", ttf: "font/ttf", otf: "font/otf",
  eot: "application/vnd.ms-fontobject",
  // Data / Code
  wasm: "application/wasm", sh: "application/x-sh", py: "text/x-python",
  rb: "application/x-ruby", php: "application/x-httpd-php",
  // Other
  bin: "application/octet-stream", exe: "application/octet-stream",
  dmg: "application/x-apple-diskimage", iso: "application/x-iso9660-image",
  apk: "application/vnd.android.package-archive",
};

const COMMON = [
  ["jpg / jpeg", "image/jpeg"], ["png", "image/png"], ["gif", "image/gif"],
  ["webp", "image/webp"], ["svg", "image/svg+xml"], ["mp4", "video/mp4"],
  ["mp3", "audio/mpeg"], ["pdf", "application/pdf"], ["json", "application/json"],
  ["html", "text/html"], ["css", "text/css"], ["js", "text/javascript"],
  ["zip", "application/zip"], ["xml", "application/xml"], ["csv", "text/csv"],
];

export default function MimeTypeLookup() {
  const t = useTranslations("MimeTypeLookup");
  const [tab, setTab] = useState<"ext" | "mime">("ext");
  const [extInput, setExtInput] = useState("");
  const [mimeInput, setMimeInput] = useState("");
  const [extResult, setExtResult] = useState<string | null>(null);
  const [mimeResult, setMimeResult] = useState<string[] | null>(null);

  const lookupByExt = () => {
    const ext = extInput.replace(/^\./, "").toLowerCase();
    const mime = MIME_DB[ext] ?? null;
    setExtResult(mime);
  };

  const lookupByMime = () => {
    const target = mimeInput.toLowerCase().trim();
    const exts = Object.entries(MIME_DB)
      .filter(([, v]) => v === target)
      .map(([k]) => `.${k}`);
    setMimeResult(exts.length > 0 ? exts : []);
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {(["ext", "mime"] as const).map((tb) => (
          <button
            key={tb}
            onClick={() => { setTab(tb); setExtResult(null); setMimeResult(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === tb ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
          >
            {tb === "ext" ? t("extensionTab") : t("mimeTab")}
          </button>
        ))}
      </div>

      {tab === "ext" ? (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-400">{t("extensionLabel")}</label>
            <div className="flex gap-2">
              <input
                type="text" value={extInput} onChange={(e) => setExtInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && lookupByExt()}
                placeholder={t("extensionPlaceholder")}
                className="flex-1 bg-gray-900 border border-gray-600 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
              />
              <button onClick={lookupByExt} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">{t("lookupButton")}</button>
            </div>
          </div>
          {extResult !== null && (
            <div className={`p-3 rounded-lg border ${extResult ? "bg-gray-900 border-gray-700" : "bg-red-950/30 border-red-800"}`}>
              <p className="font-mono text-sm">{extResult ? <span className="text-green-400">{extResult}</span> : <span className="text-red-400">{t("notFound")}</span>}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-400">{t("mimeLabel")}</label>
            <div className="flex gap-2">
              <input
                type="text" value={mimeInput} onChange={(e) => setMimeInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && lookupByMime()}
                placeholder={t("mimePlaceholder")}
                className="flex-1 bg-gray-900 border border-gray-600 text-white text-sm font-mono rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
              />
              <button onClick={lookupByMime} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">{t("lookupButton")}</button>
            </div>
          </div>
          {mimeResult !== null && (
            <div className={`p-3 rounded-lg border ${mimeResult.length > 0 ? "bg-gray-900 border-gray-700" : "bg-red-950/30 border-red-800"}`}>
              {mimeResult.length > 0
                ? <p className="font-mono text-sm text-green-400">{mimeResult.join(", ")}</p>
                : <p className="font-mono text-sm text-red-400">{t("notFound")}</p>}
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-400">{t("commonTypesLabel")}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-800">
                <th className="text-left py-2 pr-4 font-medium">Extension</th>
                <th className="text-left py-2 font-medium">MIME Type</th>
              </tr>
            </thead>
            <tbody>
              {COMMON.map(([ext, mime]) => (
                <tr key={ext} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="py-2 pr-4 font-mono text-indigo-400">{ext}</td>
                  <td className="py-2 font-mono text-gray-300">{mime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
