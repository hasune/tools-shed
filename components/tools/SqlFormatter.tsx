"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

// Keywords that trigger a new line (order matters — longer first)
const BLOCK_KEYWORDS = [
  "UNION ALL",
  "UNION",
  "LEFT OUTER JOIN",
  "RIGHT OUTER JOIN",
  "FULL OUTER JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "INNER JOIN",
  "CROSS JOIN",
  "OUTER JOIN",
  "JOIN",
  "INSERT INTO",
  "DELETE FROM",
  "CREATE TABLE",
  "ALTER TABLE",
  "DROP TABLE",
  "ORDER BY",
  "GROUP BY",
  "HAVING",
  "SELECT",
  "FROM",
  "WHERE",
  "ON",
  "SET",
  "VALUES",
  "LIMIT",
  "OFFSET",
  "UPDATE",
  "AND",
  "OR",
];

// Keywords that get extra indentation under WHERE/HAVING
const INDENT_KEYWORDS = new Set(["AND", "OR"]);

// Keywords that introduce comma-separated lists needing per-line formatting
const LIST_KEYWORDS = new Set(["SELECT", "VALUES", "SET"]);

interface Token {
  type: "keyword" | "literal" | "text";
  value: string;
}

function tokenize(sql: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < sql.length) {
    // String literal single quote
    if (sql[i] === "'") {
      let j = i + 1;
      while (j < sql.length) {
        if (sql[j] === "'" && sql[j + 1] === "'") {
          j += 2;
        } else if (sql[j] === "'") {
          j++;
          break;
        } else {
          j++;
        }
      }
      tokens.push({ type: "literal", value: sql.slice(i, j) });
      i = j;
      continue;
    }

    // String literal double quote
    if (sql[i] === '"') {
      let j = i + 1;
      while (j < sql.length && sql[j] !== '"') j++;
      j++;
      tokens.push({ type: "literal", value: sql.slice(i, j) });
      i = j;
      continue;
    }

    // Backtick identifier
    if (sql[i] === "`") {
      let j = i + 1;
      while (j < sql.length && sql[j] !== "`") j++;
      j++;
      tokens.push({ type: "literal", value: sql.slice(i, j) });
      i = j;
      continue;
    }

    // Check for block keywords (case-insensitive)
    let matched = false;
    for (const kw of BLOCK_KEYWORDS) {
      if (sql.slice(i, i + kw.length).toUpperCase() === kw) {
        // Make sure it's a word boundary after
        const after = sql[i + kw.length];
        if (!after || /[\s,()\n]/.test(after)) {
          tokens.push({ type: "keyword", value: kw });
          i += kw.length;
          matched = true;
          break;
        }
      }
    }
    if (matched) continue;

    // Regular text — accumulate until whitespace or keyword boundary
    let j = i;
    while (j < sql.length && sql[j] !== "'" && sql[j] !== '"' && sql[j] !== "`") {
      // Check if next position starts a keyword
      let kwFound = false;
      for (const kw of BLOCK_KEYWORDS) {
        if (sql.slice(j, j + kw.length).toUpperCase() === kw) {
          const after = sql[j + kw.length];
          if (!after || /[\s,()\n]/.test(after)) {
            kwFound = true;
            break;
          }
        }
      }
      if (kwFound && j > i) break;
      if (kwFound && j === i) break;
      j++;
    }

    if (j === i) {
      // Single char we couldn't classify
      tokens.push({ type: "text", value: sql[i] });
      i++;
    } else {
      tokens.push({ type: "text", value: sql.slice(i, j) });
      i = j;
    }
  }

  return tokens;
}

function formatSql(sql: string, uppercaseKeywords: boolean): string {
  // Normalize whitespace for non-literal sections
  const normalized = sql.replace(/\s+/g, " ").trim();

  const tokens = tokenize(normalized);

  const lines: string[] = [];
  let currentLine = "";
  let inListContext = false; // After SELECT, VALUES, SET
  let indentLevel = 0;

  const flush = () => {
    const trimmed = currentLine.trim();
    if (trimmed) lines.push(trimmed);
    currentLine = "";
  };

  const indent = (extra = 0) => "  ".repeat(indentLevel + extra);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === "keyword") {
      const kw = uppercaseKeywords ? token.value.toUpperCase() : token.value.toLowerCase();

      if (INDENT_KEYWORDS.has(token.value.toUpperCase())) {
        // AND/OR — flush current, indent under WHERE
        flush();
        currentLine = indent(1) + kw;
        inListContext = false;
      } else if (LIST_KEYWORDS.has(token.value.toUpperCase())) {
        flush();
        currentLine = indent() + kw;
        inListContext = true;
        indentLevel = token.value.toUpperCase() === "SELECT" ? 0 : indentLevel;
      } else {
        flush();
        inListContext = false;
        if (
          token.value.toUpperCase().includes("JOIN") ||
          token.value.toUpperCase() === "ON"
        ) {
          currentLine = indent(1) + kw;
        } else {
          currentLine = indent() + kw;
        }
      }
    } else {
      // text or literal
      let val = token.value;
      const trimmedVal = val.trim();

      if (!trimmedVal) continue;

      if (inListContext && trimmedVal.endsWith(",")) {
        // Each comma-separated item on its own line
        currentLine += " " + trimmedVal;
        flush();
        // Next item on indented line
        const nextToken = tokens[i + 1];
        if (nextToken && nextToken.type !== "keyword") {
          currentLine = "  ";
        }
      } else if (inListContext && !currentLine.trim()) {
        currentLine = "  " + trimmedVal;
      } else {
        if (currentLine.trim()) {
          currentLine += " " + trimmedVal;
        } else {
          currentLine = trimmedVal;
        }
      }
    }
  }

  flush();

  return lines
    .map((line) => line.trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}

const EXAMPLES = [
  {
    label: "SELECT with JOIN",
    sql: "select u.id, u.name, o.total from users u inner join orders o on u.id = o.user_id where u.active = 1 and o.total > 100 order by o.total desc limit 10",
  },
  {
    label: "INSERT",
    sql: "insert into users (name, email, created_at) values ('John', 'john@example.com', NOW())",
  },
  {
    label: "UPDATE",
    sql: "update users set name = 'Jane', email = 'jane@example.com', updated_at = NOW() where id = 42",
  },
];

export default function SqlFormatter() {
  const t = useTranslations("SqlFormatter");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [uppercase, setUppercase] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    if (!input.trim()) return;
    const formatted = formatSql(input, uppercase);
    setOutput(formatted);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExample = (sql: string) => {
    setInput(sql);
    const formatted = formatSql(sql, uppercase);
    setOutput(formatted);
  };

  return (
    <div className="space-y-5">
      {/* Options row */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="w-4 h-4 rounded accent-indigo-500"
          />
          <span className="text-sm text-gray-300">{t("uppercaseKeywords")}</span>
        </label>

        <div className="flex flex-wrap gap-2 ml-auto">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => handleExample(ex.sql)}
              className="text-xs px-3 py-1.5 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input / Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">{t("sqlInput")}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("inputPlaceholder")}
            rows={16}
            className="w-full bg-gray-900 border border-gray-600 text-white text-xs font-mono rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 resize-y"
          />
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-gray-400">{t("sqlOutput")}</label>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="text-sm px-3 py-1.5 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {copied ? t("copied") : t("copy")}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            rows={16}
            placeholder={t("outputPlaceholder")}
            className="w-full bg-gray-900 border border-gray-700 text-white text-xs font-mono rounded-lg px-3 py-2.5 focus:outline-none resize-y text-gray-300"
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleFormat}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {t("format")}
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-medium rounded-lg transition-colors"
        >
          {t("clear")}
        </button>
      </div>

      {/* Info */}
      <div className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700">
        <p className="text-xs text-gray-500">{t("info")}</p>
      </div>
    </div>
  );
}
