"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Entity = "owner" | "group" | "others";
type Permission = "read" | "write" | "execute";

const ENTITIES: Entity[] = ["owner", "group", "others"];
const PERMISSIONS: Permission[] = ["read", "write", "execute"];

const PERM_VALUES: Record<Permission, number> = { read: 4, write: 2, execute: 1 };
const PERM_CHARS: Record<Permission, string> = { read: "r", write: "w", execute: "x" };

type PermState = Record<Entity, Record<Permission, boolean>>;

function stateToOctal(state: PermState): string {
  return ENTITIES.map((e) =>
    PERMISSIONS.reduce((sum, p) => sum + (state[e][p] ? PERM_VALUES[p] : 0), 0)
  ).join("");
}

function stateToSymbolic(state: PermState): string {
  return ENTITIES.map((e) =>
    PERMISSIONS.map((p) => (state[e][p] ? PERM_CHARS[p] : "-")).join("")
  ).join("");
}

function octalToState(octal: string): PermState | null {
  if (!/^[0-7]{3}$/.test(octal)) return null;
  const digits = octal.split("").map(Number);
  const state: PermState = { owner: { read: false, write: false, execute: false }, group: { read: false, write: false, execute: false }, others: { read: false, write: false, execute: false } };
  ENTITIES.forEach((e, i) => {
    PERMISSIONS.forEach((p) => {
      state[e][p] = (digits[i] & PERM_VALUES[p]) !== 0;
    });
  });
  return state;
}

const DEFAULT_STATE: PermState = {
  owner: { read: true, write: true, execute: false },
  group: { read: true, write: false, execute: false },
  others: { read: true, write: false, execute: false },
};

export default function ChmodCalculator() {
  const t = useTranslations("ChmodCalculator");
  const [perms, setPerms] = useState<PermState>(DEFAULT_STATE);
  const [octalInput, setOctalInput] = useState("");

  const octal = stateToOctal(perms);
  const symbolic = stateToSymbolic(perms);

  const toggle = (entity: Entity, perm: Permission) => {
    setPerms((prev) => ({
      ...prev,
      [entity]: { ...prev[entity], [perm]: !prev[entity][perm] },
    }));
  };

  const handleOctalInput = (val: string) => {
    setOctalInput(val);
    const state = octalToState(val);
    if (state) setPerms(state);
  };

  return (
    <div className="space-y-6">
      {/* Permission grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left py-2 pr-4 text-gray-400 font-medium"></th>
              <th className="text-center py-2 px-3 text-gray-400 font-medium">{t("readLabel")}</th>
              <th className="text-center py-2 px-3 text-gray-400 font-medium">{t("writeLabel")}</th>
              <th className="text-center py-2 px-3 text-gray-400 font-medium">{t("executeLabel")}</th>
              <th className="text-center py-2 px-3 text-gray-400 font-medium">{t("octalLabel")}</th>
              <th className="text-center py-2 px-3 text-gray-400 font-medium">{t("symbolicLabel")}</th>
            </tr>
          </thead>
          <tbody>
            {ENTITIES.map((entity) => {
              const entityOctal = PERMISSIONS.reduce((sum, p) => sum + (perms[entity][p] ? PERM_VALUES[p] : 0), 0);
              const entitySymbolic = PERMISSIONS.map((p) => (perms[entity][p] ? PERM_CHARS[p] : "-")).join("");
              const labelKey = `${entity}Label` as keyof typeof t;
              return (
                <tr key={entity} className="border-t border-gray-800">
                  <td className="py-3 pr-4 text-white font-medium capitalize">{t(labelKey as any)}</td>
                  {PERMISSIONS.map((perm) => (
                    <td key={perm} className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={perms[entity][perm]}
                        onChange={() => toggle(entity, perm)}
                        className="w-4 h-4 accent-indigo-500 cursor-pointer"
                      />
                    </td>
                  ))}
                  <td className="py-3 px-3 text-center">
                    <span className="font-mono text-indigo-400 text-lg">{entityOctal}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="font-mono text-gray-300">{entitySymbolic}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 space-y-1">
          <p className="text-xs text-gray-400">{t("octalLabel")}</p>
          <p className="font-mono text-2xl text-indigo-400">{octal}</p>
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 space-y-1">
          <p className="text-xs text-gray-400">{t("symbolicLabel")}</p>
          <p className="font-mono text-xl text-gray-200">{symbolic}</p>
        </div>
      </div>

      {/* chmod command */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 space-y-1">
        <p className="text-xs text-gray-400">{t("commandLabel")}</p>
        <p className="font-mono text-gray-200">chmod {octal} filename</p>
      </div>

      {/* Octal input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">{t("octalInputLabel")}</label>
        <input
          type="text"
          value={octalInput}
          onChange={(e) => handleOctalInput(e.target.value)}
          placeholder={t("octalInputPlaceholder")}
          maxLength={3}
          className="w-40 bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 placeholder-gray-600 font-mono"
        />
      </div>
    </div>
  );
}
