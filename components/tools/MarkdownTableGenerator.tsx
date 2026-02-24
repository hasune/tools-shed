"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

type Align = "left" | "center" | "right";

interface Column {
  header: string;
  align: Align;
}

export default function MarkdownTableGenerator() {
  const t = useTranslations("MarkdownTableGenerator");

  const [columns, setColumns] = useState<Column[]>([
    { header: "Name", align: "left" },
    { header: "Age", align: "center" },
    { header: "City", align: "right" },
  ]);
  const [rows, setRows] = useState<string[][]>([
    ["Alice", "30", "New York"],
    ["Bob", "25", "London"],
  ]);
  const [copied, setCopied] = useState(false);

  function setHeader(ci: number, val: string) {
    setColumns(columns.map((c, i) => (i === ci ? { ...c, header: val } : c)));
  }

  function setAlign(ci: number, align: Align) {
    setColumns(columns.map((c, i) => (i === ci ? { ...c, align } : c)));
  }

  function setCell(ri: number, ci: number, val: string) {
    setRows(rows.map((r, i) => (i === ri ? r.map((c, j) => (j === ci ? val : c)) : r)));
  }

  function addRow() {
    setRows([...rows, Array(columns.length).fill("")]);
  }

  function addColumn() {
    setColumns([...columns, { header: "Header", align: "left" }]);
    setRows(rows.map((r) => [...r, ""]));
  }

  function deleteRow(ri: number) {
    if (rows.length <= 1) return;
    setRows(rows.filter((_, i) => i !== ri));
  }

  function deleteColumn(ci: number) {
    if (columns.length <= 1) return;
    setColumns(columns.filter((_, i) => i !== ci));
    setRows(rows.map((r) => r.filter((_, i) => i !== ci)));
  }

  function generateMarkdown(): string {
    const colWidths = columns.map((col, ci) =>
      Math.max(col.header.length, ...rows.map((r) => (r[ci] || "").length), 3)
    );

    function pad(str: string, width: number, align: Align): string {
      if (align === "right") return str.padStart(width);
      if (align === "center") {
        const total = width - str.length;
        const left = Math.floor(total / 2);
        return " ".repeat(left) + str + " ".repeat(total - left);
      }
      return str.padEnd(width);
    }

    const header = "| " + columns.map((c, i) => pad(c.header, colWidths[i], c.align)).join(" | ") + " |";
    const separator = "| " + columns.map((c, i) => {
      const dashes = "-".repeat(colWidths[i]);
      if (c.align === "center") return `:${dashes.slice(1, -1)}:`;
      if (c.align === "right") return `${dashes.slice(0, -1)}:`;
      return dashes;
    }).join(" | ") + " |";
    const dataRows = rows.map((r) =>
      "| " + columns.map((c, i) => pad(r[i] || "", colWidths[i], c.align)).join(" | ") + " |"
    );

    return [header, separator, ...dataRows].join("\n");
  }

  const markdown = generateMarkdown();

  function copy() {
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const ALIGN_ICONS: Record<Align, string> = { left: "⬅", center: "↔", right: "➡" };

  return (
    <div className="space-y-4">
      {/* Table editor */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {columns.map((col, ci) => (
                <th key={ci} className="p-1">
                  <div className="space-y-1">
                    <input
                      value={col.header}
                      onChange={(e) => setHeader(ci, e.target.value)}
                      placeholder={t("headerPlaceholder")}
                      className="w-full bg-gray-900 border border-indigo-500/50 rounded px-2 py-1 text-white text-center focus:outline-none focus:border-indigo-500"
                    />
                    <div className="flex gap-1">
                      {(["left", "center", "right"] as Align[]).map((a) => (
                        <button
                          key={a}
                          onClick={() => setAlign(ci, a)}
                          title={t(`align${a.charAt(0).toUpperCase() + a.slice(1)}` as "alignLeft" | "alignCenter" | "alignRight")}
                          className={`flex-1 py-0.5 rounded text-xs transition-colors ${col.align === a ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
                        >
                          {ALIGN_ICONS[a]}
                        </button>
                      ))}
                      <button
                        onClick={() => deleteColumn(ci)}
                        disabled={columns.length <= 1}
                        className="px-1.5 py-0.5 rounded text-xs bg-gray-800 text-red-400 hover:bg-red-900/30 disabled:opacity-30"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </th>
              ))}
              <th className="p-1 w-8" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} className="p-1">
                    <input
                      value={cell}
                      onChange={(e) => setCell(ri, ci, e.target.value)}
                      placeholder={t("cellPlaceholder")}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-gray-300 focus:outline-none focus:border-indigo-500"
                    />
                  </td>
                ))}
                <td className="p-1">
                  <button
                    onClick={() => deleteRow(ri)}
                    disabled={rows.length <= 1}
                    className="px-2 py-1 rounded text-xs text-red-400 hover:bg-red-900/30 disabled:opacity-30"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3">
        <button onClick={addRow}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors">
          + {t("addRowButton")}
        </button>
        <button onClick={addColumn}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors">
          + {t("addColumnButton")}
        </button>
      </div>

      {/* Output */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-300">{t("outputLabel")}</label>
          <button onClick={copy}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm transition-colors">
            {copied ? t("copiedButton") : t("copyButton")}
          </button>
        </div>
        <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto font-mono whitespace-pre">
          {markdown}
        </pre>
      </div>
    </div>
  );
}
