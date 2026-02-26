"use client";
import { useTranslations } from "next-intl";
import { useRef, useState, useEffect } from "react";

export default function FaviconGenerator() {
  const t = useTranslations("FaviconGenerator");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("🚀");
  const [bgColor, setBgColor] = useState("#6366f1");
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(56);
  const [size, setSize] = useState(128);
  const [shape, setShape] = useState<"square" | "rounded" | "circle">("rounded");
  const [dataUrl, setDataUrl] = useState("");
  const [copied, setCopied] = useState(false);

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);

    // Shape clipping
    ctx.beginPath();
    if (shape === "circle") {
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    } else if (shape === "rounded") {
      const r = size * 0.2;
      ctx.moveTo(r, 0);
      ctx.lineTo(size - r, 0);
      ctx.quadraticCurveTo(size, 0, size, r);
      ctx.lineTo(size, size - r);
      ctx.quadraticCurveTo(size, size, size - r, size);
      ctx.lineTo(r, size);
      ctx.quadraticCurveTo(0, size, 0, size - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
    } else {
      ctx.rect(0, 0, size, size);
    }
    ctx.closePath();
    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.clip();

    // Text
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(text || " ", size / 2, size / 2 + 2);

    setDataUrl(canvas.toDataURL("image/png"));
  }

  useEffect(() => { draw(); }, [text, bgColor, textColor, fontSize, size, shape]);

  function download() {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "favicon.png";
    a.click();
  }

  function copyDataUrl() {
    navigator.clipboard.writeText(dataUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{t("textLabel")}</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("textPlaceholder")}
              maxLength={4}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t("bgColorLabel")}</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent" />
                <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-2 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t("textColorLabel")}</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent" />
                <input type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)}
                  className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-2 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t("fontSizeLabel")}: {fontSize}px</label>
              <input type="range" min={16} max={120} value={fontSize} onChange={(e) => setFontSize(+e.target.value)}
                className="w-full accent-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t("sizeLabel")}</label>
              <select value={size} onChange={(e) => setSize(+e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500">
                {[16, 32, 48, 64, 128, 256, 512].map((s) => (
                  <option key={s} value={s}>{s}×{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{t("shapeLabel")}</label>
            <div className="flex gap-2">
              {(["square", "rounded", "circle"] as const).map((s) => (
                <button key={s} onClick={() => setShape(s)}
                  className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${shape === s ? "bg-indigo-600 border-indigo-500 text-white" : "bg-gray-900 border-gray-600 text-gray-400 hover:border-indigo-500"}`}>
                  {t(`shape${s.charAt(0).toUpperCase() + s.slice(1)}` as "shapeSquare" | "shapeRounded" | "shapeCircle")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm font-medium text-gray-300 self-start">{t("previewLabel")}</p>
          <div className="flex items-center gap-6">
            <canvas ref={canvasRef} className="rounded shadow-lg" style={{ imageRendering: "pixelated", width: 128, height: 128 }} />
            <div className="space-y-2">
              {[128, 64, 32, 16].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <canvas ref={(el) => {
                    if (!el || !dataUrl) return;
                    const ctx = el.getContext("2d");
                    if (!ctx) return;
                    el.width = s; el.height = s;
                    const img = new Image();
                    img.onload = () => ctx.drawImage(img, 0, 0, s, s);
                    img.src = dataUrl;
                  }} style={{ width: s, height: s }} className="rounded" />
                  <span className="text-xs text-gray-500">{s}px</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 w-full">
            <button onClick={download}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
              {t("downloadButton")}
            </button>
            <button onClick={copyDataUrl}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-4 rounded-lg transition-colors text-sm">
              {copied ? t("copiedButton") : t("copyButton")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
