"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inlineFormat(text: string): string {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code class="bg-gray-800 px-1 rounded text-sm font-mono text-indigo-300">$1</code>')
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/~~(.+?)~~/g, "<del>$1</del>")
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" class="max-w-full rounded my-1">')
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:underline">$1</a>'
    );
}

function parseMarkdown(md: string): string {
  const lines = md.split("\n");
  const result: string[] = [];
  let inCodeBlock = false;
  let codeContent: string[] = [];
  let listItems: string[] = [];
  let listType = "";

  const flushList = () => {
    if (listItems.length === 0) return;
    const cls = listType === "ol" ? "list-decimal" : "list-disc";
    result.push(`<${listType} class="${cls} list-inside space-y-0.5 my-2 text-gray-300">`);
    listItems.forEach((item) => result.push(`<li>${inlineFormat(item)}</li>`));
    result.push(`</${listType}>`);
    listItems = [];
    listType = "";
  };

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        result.push(
          `<pre class="bg-gray-800 rounded-lg p-3 overflow-x-auto text-sm font-mono text-gray-200 my-3"><code>${escapeHtml(codeContent.join("\n"))}</code></pre>`
        );
        inCodeBlock = false;
        codeContent = [];
      } else {
        flushList();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      continue;
    }

    const h1 = line.match(/^# (.+)/);
    const h2 = line.match(/^## (.+)/);
    const h3 = line.match(/^### (.+)/);
    const h4 = line.match(/^#### (.+)/);
    const ul = line.match(/^[-*+] (.+)/);
    const ol = line.match(/^\d+\. (.+)/);
    const bq = line.match(/^> (.+)/);
    const hr = /^---+$/.test(line.trim());

    if (h1 || h2 || h3 || h4 || bq || hr) flushList();

    if (h1) {
      result.push(`<h1 class="text-2xl font-bold text-white mt-5 mb-2 border-b border-gray-700 pb-1">${inlineFormat(h1[1])}</h1>`);
    } else if (h2) {
      result.push(`<h2 class="text-xl font-semibold text-white mt-4 mb-1.5">${inlineFormat(h2[1])}</h2>`);
    } else if (h3) {
      result.push(`<h3 class="text-lg font-semibold text-gray-200 mt-3 mb-1">${inlineFormat(h3[1])}</h3>`);
    } else if (h4) {
      result.push(`<h4 class="text-base font-semibold text-gray-300 mt-2 mb-1">${inlineFormat(h4[1])}</h4>`);
    } else if (hr) {
      result.push('<hr class="border-gray-700 my-4">');
    } else if (bq) {
      result.push(`<blockquote class="border-l-4 border-indigo-500 pl-4 text-gray-400 italic my-2">${inlineFormat(bq[1])}</blockquote>`);
    } else if (ul) {
      if (listType !== "ul") flushList();
      listType = "ul";
      listItems.push(ul[1]);
    } else if (ol) {
      if (listType !== "ol") flushList();
      listType = "ol";
      listItems.push(ol[1]);
    } else if (line.trim() === "") {
      flushList();
      result.push('<div class="h-2"></div>');
    } else {
      flushList();
      result.push(`<p class="text-gray-300 leading-relaxed">${inlineFormat(line)}</p>`);
    }
  }

  flushList();
  if (inCodeBlock) {
    result.push(
      `<pre class="bg-gray-800 rounded-lg p-3 overflow-x-auto text-sm font-mono text-gray-200"><code>${escapeHtml(codeContent.join("\n"))}</code></pre>`
    );
  }

  return result.join("\n");
}

const SAMPLE = `# Hello, Markdown!

This is **bold** and this is *italic* text.

## Features

- Live preview as you type
- **Syntax** support for common elements
- Code blocks with \`inline code\`

\`\`\`javascript
const greet = (name) => \`Hello, \${name}!\`;
console.log(greet("World"));
\`\`\`

> Blockquotes look like this.

---

[Visit ToolsShed](https://tools-shed.com)
`;

export default function MarkdownPreview() {
  const t = useTranslations("MarkdownPreview");
  const [markdown, setMarkdown] = useState(SAMPLE);
  const html = useMemo(() => parseMarkdown(markdown), [markdown]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Editor */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">{t("editorLabel")}</label>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="w-full h-96 bg-gray-900 border border-gray-600 text-white font-mono text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 resize-y"
            placeholder={t("placeholder")}
            spellCheck={false}
          />
        </div>

        {/* Preview */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">{t("previewLabel")}</label>
          <div
            className="w-full h-96 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 overflow-y-auto text-sm"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
}
