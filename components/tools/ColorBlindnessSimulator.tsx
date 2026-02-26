"use client";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect, useCallback } from "react";

type SimulationType = "normal" | "deuteranopia" | "protanopia" | "tritanopia" | "achromatopsia";

const SIMULATION_TYPES: SimulationType[] = [
  "normal",
  "deuteranopia",
  "protanopia",
  "tritanopia",
  "achromatopsia",
];

// Color transformation matrices for color blindness simulation
function applyMatrix(r: number, g: number, b: number, matrix: number[][]): [number, number, number] {
  const nr = matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b;
  const ng = matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b;
  const nb = matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b;
  return [
    Math.min(255, Math.max(0, Math.round(nr))),
    Math.min(255, Math.max(0, Math.round(ng))),
    Math.min(255, Math.max(0, Math.round(nb))),
  ];
}

const matrices: Record<SimulationType, number[][] | null> = {
  normal: null,
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7],
  ],
  protanopia: [
    [0.567, 0.433, 0],
    [0.558, 0.442, 0],
    [0, 0.242, 0.758],
  ],
  tritanopia: [
    [0.95, 0.05, 0],
    [0, 0.433, 0.567],
    [0, 0.475, 0.525],
  ],
  achromatopsia: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
  ],
};

function simulateOnCanvas(
  sourceCanvas: HTMLCanvasElement,
  targetCanvas: HTMLCanvasElement,
  type: SimulationType
) {
  const ctx = sourceCanvas.getContext("2d");
  const targetCtx = targetCanvas.getContext("2d");
  if (!ctx || !targetCtx) return;

  const { width, height } = sourceCanvas;
  targetCanvas.width = width;
  targetCanvas.height = height;

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const matrix = matrices[type];

  if (!matrix) {
    targetCtx.drawImage(sourceCanvas, 0, 0);
    return;
  }

  const newData = new Uint8ClampedArray(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = applyMatrix(data[i], data[i + 1], data[i + 2], matrix);
    newData[i] = r;
    newData[i + 1] = g;
    newData[i + 2] = b;
    newData[i + 3] = data[i + 3];
  }

  const newImageData = new ImageData(newData, width, height);
  targetCtx.putImageData(newImageData, 0, 0);
}

export default function ColorBlindnessSimulator() {
  const t = useTranslations("ColorBlindnessSimulator");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<SimulationType>("deuteranopia");
  const [isDragging, setIsDragging] = useState(false);

  const sourceCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadImage = useCallback((src: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = sourceCanvasRef.current;
      if (!canvas) return;
      // Limit max size
      const maxW = 800;
      const scale = img.width > maxW ? maxW / img.width : 1;
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = src;
  }, []);

  useEffect(() => {
    if (!imageSrc) return;
    loadImage(imageSrc);
  }, [imageSrc, loadImage]);

  useEffect(() => {
    if (!imageSrc || !sourceCanvasRef.current || !outputCanvasRef.current) return;
    simulateOnCanvas(sourceCanvasRef.current, outputCanvasRef.current, selectedType);
  }, [imageSrc, selectedType]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setImageSrc(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const typeLabels: Record<SimulationType, string> = {
    normal: t("normalVision"),
    deuteranopia: t("deuteranopia"),
    protanopia: t("protanopia"),
    tritanopia: t("tritanopia"),
    achromatopsia: t("achromatopsia"),
  };

  return (
    <div className="space-y-6">
      {/* Upload area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-indigo-400 bg-indigo-500/10"
            : "border-gray-600 hover:border-indigo-500/50"
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="text-4xl mb-2">🖼️</div>
        <p className="text-gray-300">{t("uploadPrompt")}</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      {/* Hidden source canvas */}
      <canvas ref={sourceCanvasRef} className="hidden" />

      {/* Simulation type selector */}
      {imageSrc && (
        <div className="flex flex-wrap gap-2">
          {SIMULATION_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedType === type
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {typeLabels[type]}
            </button>
          ))}
        </div>
      )}

      {/* Output */}
      {imageSrc ? (
        <div>
          <p className="text-sm text-gray-400 mb-2">{typeLabels[selectedType]}</p>
          <canvas ref={outputCanvasRef} className="max-w-full rounded-lg border border-gray-700" />
        </div>
      ) : (
        <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-12 text-center text-gray-500">
          {t("noImagePlaceholder")}
        </div>
      )}

      {/* Info */}
      <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
        <h3 className="font-medium text-gray-200 mb-1">{t("aboutTitle")}</h3>
        <p className="text-sm text-gray-400">{t("aboutDesc")}</p>
      </div>
    </div>
  );
}
