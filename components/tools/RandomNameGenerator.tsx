"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Gender = "any" | "male" | "female";
type NameType = "full" | "first" | "last";

const MALE_FIRST_NAMES = [
  "James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph",
  "Thomas", "Charles", "Christopher", "Daniel", "Matthew", "Anthony", "Mark",
  "Donald", "Steven", "Paul", "Andrew", "Kenneth", "Joshua", "George", "Kevin",
  "Brian", "Timothy", "Ronald", "Edward", "Jason", "Jeffrey", "Ryan", "Jacob",
  "Gary", "Nicholas", "Eric", "Jonathan", "Stephen", "Larry", "Justin", "Scott",
  "Brandon",
];

const FEMALE_FIRST_NAMES = [
  "Mary", "Patricia", "Jennifer", "Linda", "Barbara", "Susan", "Jessica", "Sarah",
  "Karen", "Lisa", "Nancy", "Betty", "Dorothy", "Sandra", "Ashley", "Emily",
  "Donna", "Carol", "Ruth", "Sharon", "Michelle", "Laura", "Amanda", "Melissa",
  "Stephanie", "Rebecca", "Rachel", "Carolyn", "Janet", "Catherine", "Maria",
  "Heather", "Diana", "Julie", "Joyce", "Victoria", "Samantha", "Amy", "Olivia",
  "Emma",
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
  "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
  "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateName(gender: Gender, type: NameType): string {
  const firstPool =
    gender === "male"
      ? MALE_FIRST_NAMES
      : gender === "female"
      ? FEMALE_FIRST_NAMES
      : Math.random() < 0.5
      ? MALE_FIRST_NAMES
      : FEMALE_FIRST_NAMES;

  if (type === "first") return pickRandom(firstPool);
  if (type === "last") return pickRandom(LAST_NAMES);
  return `${pickRandom(firstPool)} ${pickRandom(LAST_NAMES)}`;
}

export default function RandomNameGenerator() {
  const t = useTranslations("RandomNameGenerator");

  const [count, setCount] = useState(5);
  const [gender, setGender] = useState<Gender>("any");
  const [nameType, setNameType] = useState<NameType>("full");
  const [names, setNames] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push(generateName(gender, nameType));
    }
    setNames(result);
    setCopied(false);
  };

  const copyAll = () => {
    if (names.length === 0) return;
    navigator.clipboard.writeText(names.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const genderOptions: { value: Gender; label: string }[] = [
    { value: "any", label: t("genderAny") },
    { value: "male", label: t("genderMale") },
    { value: "female", label: t("genderFemale") },
  ];

  const typeOptions: { value: NameType; label: string }[] = [
    { value: "full", label: t("typeFullName") },
    { value: "first", label: t("typeFirstName") },
    { value: "last", label: t("typeLastName") },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Count */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-300">{t("countLabel")}</label>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => {
              const v = parseInt(e.target.value);
              if (!isNaN(v)) setCount(Math.min(50, Math.max(1, v)));
            }}
            className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Gender */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-300">{t("genderLabel")}</label>
          <div className="flex gap-1">
            {genderOptions.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setGender(value)}
                className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  gender === value
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white border border-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Name Type */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-300">{t("typeLabel")}</label>
          <div className="flex gap-1">
            {typeOptions.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setNameType(value)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors leading-tight text-center break-words min-w-0 ${
                  nameType === value
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white border border-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={generate}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {t("generateButton")}
        </button>
        {names.length > 0 && (
          <button
            onClick={copyAll}
            className="text-sm px-3 py-1.5 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
          >
            {copied ? t("copiedButton") : t("copyAllButton")}
          </button>
        )}
      </div>

      {/* Name list */}
      {names.length > 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg divide-y divide-gray-800">
          {names.map((name, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-3 group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-5 text-right shrink-0">{i + 1}</span>
                <span className="text-white text-sm">{name}</span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(name);
                }}
                className="text-xs text-gray-600 group-hover:text-indigo-400 transition-colors"
              >
                {t("copyButton")}
              </button>
            </div>
          ))}
        </div>
      )}

      {names.length === 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg py-12 text-center">
          <p className="text-gray-500 text-sm">{t("emptyHintText")}</p>
        </div>
      )}
    </div>
  );
}
