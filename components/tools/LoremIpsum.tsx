"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "eu", "fugiat", "nulla", "pariatur", "excepteur",
  "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui",
  "officia", "deserunt", "mollit", "anim", "id", "est", "laborum", "pellentesque",
  "habitant", "morbi", "tristique", "senectus", "netus", "malesuada", "fames",
  "turpis", "egestas", "maecenas", "pharetra", "convallis", "posuere", "morbi",
  "leo", "risus", "porta", "ac", "consectetur", "ac", "vestibulum", "at", "eros",
  "donec", "ultrices", "tincidunt", "arcu", "non", "sodales", "neque", "volutpat",
  "ac", "tincidunt", "vitae", "semper", "quis", "lectus", "nulla", "at", "volutpat",
  "diam", "ut", "venenatis", "tellus", "cras", "adipiscing", "enim", "eu", "turpis",
  "egestas", "pretium", "aenean", "pharetra", "magna", "ac", "placerat", "vestibulum",
  "lectus", "mauris", "ultrices", "eros", "in", "cursus", "turpis", "massa",
  "tincidunt", "dui", "ut", "ornare", "lectus"
];

const LOREM_START = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function randomWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function generateSentence(wordCount: number = 10): string {
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(randomWord());
  }
  return capitalize(words.join(" ")) + ".";
}

function generateParagraph(sentenceCount: number = 5): string {
  const sentences: string[] = [];
  for (let i = 0; i < sentenceCount; i++) {
    const wordCount = 7 + Math.floor(Math.random() * 10);
    sentences.push(generateSentence(wordCount));
  }
  return sentences.join(" ");
}

function generateWords(count: number, startWithLorem: boolean): string {
  const words: string[] = [];
  if (startWithLorem) {
    const loremWords = LOREM_START.replace(/[.,]/g, "").toLowerCase().split(" ");
    for (let i = 0; i < Math.min(count, loremWords.length); i++) {
      words.push(loremWords[i]);
    }
    for (let i = words.length; i < count; i++) {
      words.push(randomWord());
    }
  } else {
    for (let i = 0; i < count; i++) {
      words.push(randomWord());
    }
  }
  return capitalize(words.join(" "));
}

function generateSentences(count: number, startWithLorem: boolean): string {
  const sentences: string[] = [];
  if (startWithLorem) {
    sentences.push(LOREM_START);
    for (let i = 1; i < count; i++) {
      const wordCount = 7 + Math.floor(Math.random() * 10);
      sentences.push(generateSentence(wordCount));
    }
  } else {
    for (let i = 0; i < count; i++) {
      const wordCount = 7 + Math.floor(Math.random() * 10);
      sentences.push(generateSentence(wordCount));
    }
  }
  return sentences.join(" ");
}

function generateParagraphs(count: number, startWithLorem: boolean): string {
  const paragraphs: string[] = [];
  for (let i = 0; i < count; i++) {
    if (i === 0 && startWithLorem) {
      const sentenceCount = 4 + Math.floor(Math.random() * 3);
      const rest: string[] = [];
      for (let j = 0; j < sentenceCount - 1; j++) {
        const wordCount = 7 + Math.floor(Math.random() * 10);
        rest.push(generateSentence(wordCount));
      }
      paragraphs.push(LOREM_START + " " + rest.join(" "));
    } else {
      paragraphs.push(generateParagraph(4 + Math.floor(Math.random() * 4)));
    }
  }
  return paragraphs.join("\n\n");
}

type GenerateType = "paragraphs" | "sentences" | "words";

export default function LoremIpsum() {
  const t = useTranslations("LoremIpsum");
  const tc = useTranslations("Common");

  const [type, setType] = useState<GenerateType>("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const clampedCount = Math.max(1, Math.min(20, count));
    let result = "";
    if (type === "paragraphs") {
      result = generateParagraphs(clampedCount, startWithLorem);
    } else if (type === "sentences") {
      result = generateSentences(clampedCount, startWithLorem);
    } else {
      result = generateWords(clampedCount, startWithLorem);
    }
    setOutput(result);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Type selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">{t("typeLabel")}</label>
        <div className="flex gap-2">
          {(["paragraphs", "sentences", "words"] as GenerateType[]).map((opt) => (
            <button
              key={opt}
              onClick={() => setType(opt)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                type === opt
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-300"
              }`}
            >
              {t(opt)}
            </button>
          ))}
        </div>
      </div>

      {/* Count input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">
          {t("countLabel")}: <span className="text-indigo-400">{count}</span>
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={1}
            max={20}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="flex-1 accent-indigo-600"
          />
          <input
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (!isNaN(val)) setCount(Math.max(1, Math.min(20, val)));
            }}
            className="w-16 bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 text-center"
          />
        </div>
      </div>

      {/* Start with Lorem checkbox */}
      <div className="flex items-center gap-2">
        <input
          id="start-with-lorem"
          type="checkbox"
          checked={startWithLorem}
          onChange={(e) => setStartWithLorem(e.target.checked)}
          className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-900"
        />
        <label htmlFor="start-with-lorem" className="text-sm font-medium text-gray-300 cursor-pointer">
          {t("startWithLoremIpsum")}
        </label>
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors"
      >
        {t("generateButton")}
      </button>

      {/* Output */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">{t("outputLabel")}</label>
          <button
            onClick={handleCopy}
            disabled={!output}
            className="bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm rounded-lg px-4 py-2 transition-colors"
          >
            {copied ? tc("copied") : tc("copy")}
          </button>
        </div>
        <textarea
          value={output}
          readOnly
          rows={12}
          className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 resize-y leading-relaxed"
        />
      </div>
    </div>
  );
}
