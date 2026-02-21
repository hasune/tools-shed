# 🛠️ ToolsShed

**Free online tools for developers, students, and professionals worldwide.**

> No sign-up. No data sent to servers. Works entirely in your browser.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwind-css)](https://tailwindcss.com)
[![next-intl](https://img.shields.io/badge/next--intl-12%20languages-6366f1)](https://next-intl-docs.vercel.app)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://tools-shed.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ✨ Live Demo

**→ [tools-shed.com](https://tools-shed.com)**

Available in: 🇺🇸 EN · 🇯🇵 JA · 🇰🇷 KO · 🇨🇳 ZH · 🇪🇸 ES · 🇧🇷 PT · 🇫🇷 FR · 🇩🇪 DE · 🇷🇺 RU · 🇮🇹 IT · 🇹🇷 TR · 🇮🇩 ID

---

## 🧰 Tools

<table>
<tr>
<td valign="top" width="50%">

### 💻 Developer Tools
- **JSON Formatter** — Format, validate & minify JSON
- **UUID Generator** — Bulk v4 UUID generation
- **Base64** — Encode / Decode with Unicode support
- **URL Encoder/Decoder** — Percent-encoding utility
- **Hash Generator** — MD5, SHA-256, SHA-512
- **JWT Decoder** — Inspect JWT payloads & expiry

### 🔄 Unit Converters
- **Length** — km, m, ft, in, mi, nmi...
- **Weight** — kg, lbs, oz, g, stone...
- **Temperature** — °C, °F, Kelvin

</td>
<td valign="top" width="50%">

### ✍️ Text Tools
- **Word Counter** — Words, chars, reading time
- **Case Converter** — 8 case formats (camelCase, snake_case...)
- **Password Generator** — Cryptographically secure

### 💰 Finance Tools
- **Compound Interest** — With monthly contributions
- **Percentage Calculator** — 4 modes including tip splitter

### ❤️ Health & ⏰ Time
- **BMI Calculator** — Metric & Imperial
- **Age Calculator** — Exact age + days until birthday
- **Timezone Converter** — 15+ world cities

</td>
</tr>
</table>

---

## 🌍 Internationalization

Fully localized in **12 languages** using [next-intl](https://next-intl-docs.vercel.app):

| Code | Language | Region |
|------|----------|--------|
| `en` | English | Global (default) |
| `ja` | 日本語 | Japan |
| `ko` | 한국어 | Korea |
| `zh-CN` | 中文(简体) | China, Singapore |
| `es` | Español | Spain, Latin America |
| `pt-BR` | Português | Brazil |
| `fr` | Français | France, Africa |
| `de` | Deutsch | Germany, Austria |
| `ru` | Русский | Russia, CIS |
| `it` | Italiano | Italy |
| `tr` | Türkçe | Turkey |
| `id` | Bahasa Indonesia | Indonesia |

All pages include `hreflang` alternate tags for proper international SEO.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) — App Router, SSG |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| i18n | [next-intl](https://next-intl-docs.vercel.app) v4 |
| Hosting | Vercel (Hobby — free tier) |
| Comments | [Giscus](https://giscus.app) (GitHub Discussions) |
| Ads | Google AdSense |

---

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/hasune/tools-shed.git
cd tools-shed

# Install
npm install

# Develop
npm run dev
# → http://localhost:3000  (redirects to /en/)

# Build (generates 316 static pages across 12 locales)
npm run build
```

---

## ➕ Adding a New Tool

New tools require **5 steps** (including i18n):

**1. Register in `lib/tools.ts`**
```ts
{
  slug: "my-tool",
  name: "My Tool",
  description: "What it does.",
  category: "Developer Tools",
  categorySlug: "developer",
  icon: "🔧",
  keywords: ["keyword1", "keyword2"],
}
```

**2. Add translation keys to `messages/en.json`**
```json
// Under "Tools":
"my-tool": {
  "name": "My Tool",
  "description": "Short description.",
  "metaTitle": "My Tool",
  "metaDescription": "SEO description under 150 chars."
},
// New namespace for UI strings:
"MyTool": {
  "inputLabel": "Input",
  "button": "Process"
}
```

**3. Add same keys to the other 11 language files** (`ja.json`, `ko.json`, etc.)

**4. Create the component (`components/tools/MyTool.tsx`)**
```tsx
"use client";
import { useTranslations } from "next-intl";

export default function MyTool() {
  const t = useTranslations("MyTool");
  // All logic runs in the browser
}
```

**5. Create the page (`app/[locale]/developer/my-tool/page.tsx`)**
```tsx
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ToolLayout from "@/components/ToolLayout";
import MyTool from "@/components/tools/MyTool";

const BASE_URL = "https://tools-shed.com";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.my-tool" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/developer/my-tool`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}/developer/my-tool`])
      ),
    },
  };
}

export default async function MyToolPage({ params }) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.my-tool" });
  const tCat = await getTranslations({ locale, namespace: "Categories.developer" });
  return (
    <ToolLayout
      toolName={tTools("name")}
      toolSlug="my-tool"
      categoryName={tCat("name")}
      categorySlug="developer"
      description={tTools("description")}
    >
      <MyTool />
    </ToolLayout>
  );
}
```

`ToolLayout` automatically includes breadcrumbs, ad slots, and Giscus comments.

---

## 🏛️ Architecture

```
All computation → Browser only (no API routes, no DB)
     ↓
Next.js SSG → 316 pages pre-rendered at build time (12 locales × 26 pages)
     ↓
Vercel Edge Network → served globally from CDN
```

**Key design decisions:**
- `app/[locale]/` — all pages live under locale segment
- `page.tsx` files are **Server Components** (use `await getTranslations()`)
- Tool UI files in `components/tools/` are **Client Components** (`useTranslations()`)
- Use `Link` from `@/i18n/navigation` instead of `next/link`
- Never pass functions from Server → Client as props

---

## 📁 Project Structure

```
tools-shed/
├── app/
│   ├── layout.tsx          # Root layout (renders children only)
│   ├── sitemap.ts          # Auto-generated sitemap.xml (316 entries)
│   ├── robots.ts           # Auto-generated robots.txt
│   └── [locale]/           # All pages live here
│       ├── layout.tsx      # html lang + NextIntlClientProvider + AdSense
│       ├── page.tsx        # Home page
│       ├── [category]/     # Dynamic category index pages
│       ├── developer/      # Tool pages (6 tools)
│       ├── converters/     # Tool pages (3 tools)
│       ├── text/           # Tool pages (3 tools)
│       ├── finance/        # Tool pages (2 tools)
│       ├── health/         # Tool pages (1 tool)
│       └── time/           # Tool pages (2 tools)
├── components/
│   ├── Header.tsx          # Navigation + LocaleSwitcher
│   ├── Footer.tsx          # Footer (Server Component)
│   ├── LocaleSwitcher.tsx  # Language dropdown
│   ├── AdSlot.tsx          # Google AdSense wrapper
│   ├── GiscusComments.tsx  # Comment system
│   ├── ToolLayout.tsx      # Shared tool page wrapper (Server Component)
│   └── tools/              # 17 tool components (all "use client")
├── i18n/
│   ├── routing.ts          # Supported locales config
│   ├── request.ts          # Server-side message loading
│   └── navigation.ts       # Locale-aware Link/useRouter
├── messages/
│   ├── en.json             # Source of truth (~390 keys)
│   └── {locale}.json       # 11 translated files
├── lib/
│   └── tools.ts            # Tool & category metadata registry
└── proxy.ts                # next-intl middleware
```

---

## 💬 Comments (Giscus)

Comments are powered by [Giscus](https://giscus.app) — backed by GitHub Discussions on this repository. Sign in with GitHub to leave feedback on any tool.

- Repo: `hasune/tools-shed`
- Category: `Announcements`
- One discussion thread per tool (keyed by tool slug)

---

## 📈 Roadmap

**Coming soon:**
- [ ] Unix Timestamp Converter
- [ ] Color Converter (HEX/RGB/HSL)
- [ ] RegEx Tester
- [ ] Diff Checker
- [ ] Markdown Preview
- [ ] CSV ↔ JSON Converter
- [ ] Loan / Mortgage Calculator
- [ ] TDEE / Calorie Calculator

**Future:**
- [ ] Arabic (`ar`) language support (requires RTL layout)
- [ ] User accounts + saved favorites (Neon DB + Auth.js)

---

## 📄 License

MIT © [hasune](https://github.com/hasune)
