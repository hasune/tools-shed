export type { Tool, Category } from "./types";
export { developerTools } from "./developer";
export { converterTools } from "./converters";
export { textTools } from "./text";
export { financeTools } from "./finance";
export { healthTools } from "./health";
export { timeTools } from "./time";
export { mathTools } from "./math";

import { developerTools } from "./developer";
import { converterTools } from "./converters";
import { textTools } from "./text";
import { financeTools } from "./finance";
import { healthTools } from "./health";
import { timeTools } from "./time";
import { mathTools } from "./math";
import type { Tool, Category } from "./types";

export const tools: Tool[] = [
  ...developerTools,
  ...converterTools,
  ...textTools,
  ...financeTools,
  ...healthTools,
  ...timeTools,
  ...mathTools,
];

export const categories: Category[] = [
  {
    slug: "developer",
    name: "Developer Tools",
    description: "Essential tools for developers: JSON, Base64, UUID, hashing, and more.",
    icon: "💻",
    tools: tools.filter((t) => t.categorySlug === "developer"),
  },
  {
    slug: "converters",
    name: "Unit Converters",
    description: "Convert between units of length, weight, temperature, and more.",
    icon: "🔄",
    tools: tools.filter((t) => t.categorySlug === "converters"),
  },
  {
    slug: "text",
    name: "Text Tools",
    description: "Tools for text manipulation, counting, and conversion.",
    icon: "✍️",
    tools: tools.filter((t) => t.categorySlug === "text"),
  },
  {
    slug: "finance",
    name: "Finance Tools",
    description: "Calculators for interest, percentages, loans, and investments.",
    icon: "💰",
    tools: tools.filter((t) => t.categorySlug === "finance"),
  },
  {
    slug: "health",
    name: "Health Tools",
    description: "Health calculators for BMI, calories, and fitness metrics.",
    icon: "❤️",
    tools: tools.filter((t) => t.categorySlug === "health"),
  },
  {
    slug: "time",
    name: "Time Tools",
    description: "Time zone converters, age calculators, and date utilities.",
    icon: "⏰",
    tools: tools.filter((t) => t.categorySlug === "time"),
  },
  {
    slug: "math",
    name: "Math Tools",
    description: "Calculators for equations, number theory, and scientific computing.",
    icon: "🧮",
    tools: tools.filter((t) => t.categorySlug === "math"),
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getToolsByCategory(categorySlug: string): Tool[] {
  return tools.filter((t) => t.categorySlug === categorySlug);
}
