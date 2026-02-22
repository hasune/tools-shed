export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: string;
  categorySlug: string;
  icon: string;
  keywords: string[];
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  tools: Tool[];
}

export const tools: Tool[] = [
  // Developer Tools
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Format, validate, and beautify JSON data with syntax highlighting.",
    category: "Developer Tools",
    categorySlug: "developer",
    icon: "{ }",
    keywords: ["json", "format", "validate", "beautify", "minify", "pretty print"],
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    description: "Generate random UUIDs (v4) for use in your applications.",
    category: "Developer Tools",
    categorySlug: "developer",
    icon: "🔑",
    keywords: ["uuid", "guid", "unique", "identifier", "random", "v4"],
  },
  {
    slug: "base64",
    name: "Base64 Encoder / Decoder",
    description: "Encode text or files to Base64 and decode Base64 strings.",
    category: "Developer Tools",
    categorySlug: "developer",
    icon: "64",
    keywords: ["base64", "encode", "decode", "binary", "text"],
  },
  {
    slug: "url-encoder",
    name: "URL Encoder / Decoder",
    description: "Encode and decode URLs and query parameters for safe transmission.",
    category: "Developer Tools",
    categorySlug: "developer",
    icon: "🔗",
    keywords: ["url", "encode", "decode", "percent", "uri", "query string"],
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    description: "Generate MD5, SHA-256, and SHA-512 cryptographic hashes.",
    category: "Developer Tools",
    categorySlug: "developer",
    icon: "#",
    keywords: ["hash", "md5", "sha256", "sha512", "checksum", "crypto"],
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    description: "Decode and inspect JSON Web Token payloads without signature verification.",
    category: "Developer Tools",
    categorySlug: "developer",
    icon: "JWT",
    keywords: ["jwt", "json web token", "decode", "payload", "auth", "bearer"],
  },
  {
    slug: "color-converter",
    name: "Color Converter",
    description: "Convert colors between HEX, RGB, and HSL formats instantly.",
    category: "Developer Tools",
    categorySlug: "developer",
    icon: "🎨",
    keywords: ["color", "hex", "rgb", "hsl", "converter", "palette", "css color"],
  },
  {
    slug: "number-base-converter",
    name: "Number Base Converter",
    description: "Convert numbers between binary, octal, decimal, and hexadecimal.",
    category: "Developer Tools",
    categorySlug: "developer",
    icon: "01",
    keywords: ["binary", "octal", "decimal", "hexadecimal", "base", "convert", "number base"],
  },
  {
    slug: "regex-tester",
    name: "RegEx Tester",
    description: "Test and debug regular expressions with live match highlighting.",
    category: "Developer Tools",
    categorySlug: "developer",
    icon: ".*",
    keywords: ["regex", "regular expression", "test", "match", "pattern", "debug"],
  },
  // Unit Converters
  {
    slug: "length-converter",
    name: "Length Converter",
    description: "Convert between meters, feet, inches, miles, kilometers, and more.",
    category: "Unit Converters",
    categorySlug: "converters",
    icon: "📏",
    keywords: ["length", "convert", "meter", "feet", "inch", "mile", "kilometer"],
  },
  {
    slug: "weight-converter",
    name: "Weight Converter",
    description: "Convert between kilograms, pounds, ounces, grams, and more.",
    category: "Unit Converters",
    categorySlug: "converters",
    icon: "⚖️",
    keywords: ["weight", "mass", "kg", "lbs", "ounce", "gram", "convert"],
  },
  {
    slug: "temperature-converter",
    name: "Temperature Converter",
    description: "Convert between Celsius, Fahrenheit, and Kelvin.",
    category: "Unit Converters",
    categorySlug: "converters",
    icon: "🌡️",
    keywords: ["temperature", "celsius", "fahrenheit", "kelvin", "convert"],
  },
  // Text Tools
  {
    slug: "word-counter",
    name: "Word & Character Counter",
    description: "Count words, characters, sentences, and paragraphs in your text.",
    category: "Text Tools",
    categorySlug: "text",
    icon: "✍️",
    keywords: ["word count", "character count", "text", "counter", "writing"],
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    description: "Convert text to UPPERCASE, lowercase, Title Case, camelCase, and more.",
    category: "Text Tools",
    categorySlug: "text",
    icon: "Aa",
    keywords: ["case", "uppercase", "lowercase", "title case", "camelcase", "text convert"],
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    description: "Generate strong, secure passwords with customizable options.",
    category: "Text Tools",
    categorySlug: "text",
    icon: "🔒",
    keywords: ["password", "generate", "secure", "random", "strong", "security"],
  },
  {
    slug: "markdown-preview",
    name: "Markdown Preview",
    description: "Write Markdown and preview the rendered output in real time.",
    category: "Text Tools",
    categorySlug: "text",
    icon: "MD",
    keywords: ["markdown", "preview", "render", "html", "editor", "md"],
  },
  // Finance Tools
  {
    slug: "compound-interest",
    name: "Compound Interest Calculator",
    description: "Calculate compound interest growth for investments over time.",
    category: "Finance Tools",
    categorySlug: "finance",
    icon: "📈",
    keywords: ["compound interest", "investment", "calculator", "finance", "savings"],
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    description: "Calculate percentages, percentage change, and tip amounts.",
    category: "Finance Tools",
    categorySlug: "finance",
    icon: "%",
    keywords: ["percentage", "percent", "tip", "calculator", "math"],
  },
  // Health Tools
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    description: "Calculate Body Mass Index with metric and imperial units.",
    category: "Health Tools",
    categorySlug: "health",
    icon: "🏃",
    keywords: ["bmi", "body mass index", "health", "weight", "height"],
  },
  // Time Tools
  {
    slug: "age-calculator",
    name: "Age Calculator",
    description: "Calculate exact age in years, months, and days from a birth date.",
    category: "Time Tools",
    categorySlug: "time",
    icon: "🎂",
    keywords: ["age", "birthday", "date", "calculate", "years", "months"],
  },
  {
    slug: "timezone-converter",
    name: "Timezone Converter",
    description: "Convert time between different time zones around the world.",
    category: "Time Tools",
    categorySlug: "time",
    icon: "🌍",
    keywords: ["timezone", "time zone", "convert", "world time", "utc", "gmt"],
  },
  {
    slug: "unix-timestamp",
    name: "Unix Timestamp Converter",
    description: "Convert between Unix timestamps and human-readable dates.",
    category: "Time Tools",
    categorySlug: "time",
    icon: "⏱️",
    keywords: ["unix", "timestamp", "epoch", "date", "convert", "time", "posix"],
  },
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
