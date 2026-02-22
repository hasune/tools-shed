"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

interface InterfaceDef {
  name: string;
  fields: FieldDef[];
}

interface FieldDef {
  key: string;
  type: string;
  optional: boolean;
}

function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^./, (c) => c.toUpperCase());
}

function inferType(
  value: JsonValue,
  keyName: string,
  interfaces: Map<string, InterfaceDef>,
  usedNames: Set<string>
): string {
  if (value === null) return "null";
  if (typeof value === "string") return "string";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";

  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    const elementTypes = new Set<string>();
    for (const item of value) {
      elementTypes.add(inferType(item, keyName + "Item", interfaces, usedNames));
    }
    const typeUnion = [...elementTypes].join(" | ");
    return elementTypes.size === 1 ? `${typeUnion}[]` : `(${typeUnion})[]`;
  }

  if (typeof value === "object" && value !== null) {
    const baseName = toPascalCase(keyName);
    let interfaceName = baseName;
    let counter = 1;
    while (usedNames.has(interfaceName) && interfaces.get(interfaceName) !== undefined) {
      interfaceName = `${baseName}${counter++}`;
    }
    usedNames.add(interfaceName);

    const fields: FieldDef[] = [];
    for (const [k, v] of Object.entries(value as { [key: string]: JsonValue })) {
      const isNull = v === null;
      const fieldType = inferType(v, k, interfaces, usedNames);
      fields.push({
        key: k,
        type: isNull ? "null" : fieldType,
        optional: isNull,
      });
    }

    interfaces.set(interfaceName, { name: interfaceName, fields });
    return interfaceName;
  }

  return "unknown";
}

function generateInterfaces(json: JsonValue, rootName: string): string {
  const interfaces = new Map<string, InterfaceDef>();
  const usedNames = new Set<string>([rootName]);

  let rootType: string;

  if (Array.isArray(json)) {
    if (json.length === 0) {
      return `type ${rootName} = unknown[];`;
    }
    const elementTypes = new Set<string>();
    for (const item of json) {
      elementTypes.add(inferType(item, rootName + "Item", interfaces, usedNames));
    }
    const typeUnion = [...elementTypes].join(" | ");
    const elementType = elementTypes.size === 1 ? typeUnion : `(${typeUnion})`;
    return generateInterfaceText(interfaces, rootName, null, elementType);
  } else if (typeof json === "object" && json !== null) {
    const fields: FieldDef[] = [];
    for (const [k, v] of Object.entries(json as { [key: string]: JsonValue })) {
      const isNull = v === null;
      const fieldType = inferType(v, k, interfaces, usedNames);
      fields.push({ key: k, type: fieldType, optional: isNull });
    }
    interfaces.set(rootName, { name: rootName, fields });
    rootType = rootName;
  } else {
    rootType = inferType(json, rootName, interfaces, usedNames);
    return `type ${rootName} = ${rootType};`;
  }

  return generateInterfaceText(interfaces, rootName, rootType, null);
}

function generateInterfaceText(
  interfaces: Map<string, InterfaceDef>,
  rootName: string,
  rootType: string | null,
  arrayType: string | null
): string {
  const lines: string[] = [];

  const order: string[] = [];
  if (rootType) order.push(rootType);

  const remaining = [...interfaces.keys()].filter((k) => k !== rootName);
  order.push(...remaining);

  if (arrayType) {
    lines.push(`type ${rootName} = ${arrayType}[];`);
    lines.push("");
  }

  for (const name of order) {
    const iface = interfaces.get(name);
    if (!iface) continue;

    lines.push(`interface ${iface.name} {`);
    for (const field of iface.fields) {
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(field.key)
        ? field.key
        : `"${field.key}"`;
      const optMark = field.optional ? "?" : "";
      lines.push(`  ${safeKey}${optMark}: ${field.type};`);
    }
    lines.push("}");
    lines.push("");
  }

  return lines.join("\n").trimEnd();
}

const EXAMPLE_JSON = `{
  "name": "John Doe",
  "age": 30,
  "active": true,
  "score": null,
  "address": {
    "city": "New York",
    "zip": "10001"
  },
  "tags": ["developer", "designer"]
}`;

export default function JsonToTypescript() {
  const t = useTranslations("JsonToTypescript");
  const [input, setInput] = useState("");
  const [rootName, setRootName] = useState("Root");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    setError(null);
    setOutput("");

    if (!input.trim()) {
      setError("Please enter a JSON value.");
      return;
    }

    let parsed: JsonValue;
    try {
      parsed = JSON.parse(input);
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
      return;
    }

    const name = rootName.trim() || "Root";
    try {
      const result = generateInterfaces(parsed, toPascalCase(name));
      setOutput(result);
    } catch (e) {
      setError(`Conversion error: ${(e as Error).message}`);
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
    setRootName("Root");
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadExample = () => {
    setInput(EXAMPLE_JSON);
    setError(null);
    setOutput("");
  };

  return (
    <div className="space-y-5">
      {/* Controls row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-400 mb-1.5">
            {t("rootInterfaceName")}
          </label>
          <input
            type="text"
            value={rootName}
            onChange={(e) => setRootName(e.target.value)}
            placeholder="Root"
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex items-end gap-2">
          <button
            onClick={handleConvert}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {t("convert")}
          </button>
          <button
            onClick={handleLoadExample}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-medium rounded-lg transition-colors"
          >
            {t("example")}
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-medium rounded-lg transition-colors"
          >
            {t("clear")}
          </button>
        </div>
      </div>

      {/* Input / Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">{t("jsonInput")}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={'{\n  "key": "value"\n}'}
            rows={16}
            className="w-full bg-gray-900 border border-gray-600 text-white text-xs font-mono rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 resize-y"
          />
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-gray-400">{t("tsOutput")}</label>
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

      {/* Error */}
      {error && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg px-4 py-3">
          <p className="text-red-400 text-sm font-mono">{error}</p>
        </div>
      )}

      {/* Info */}
      <div className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700">
        <p className="text-xs text-gray-500">{t("info")}</p>
      </div>
    </div>
  );
}
