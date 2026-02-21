# 🛠️ ToolsShed

**Free online tools for developers, students, and professionals worldwide.**

> No sign-up. No data sent to servers. Works entirely in your browser.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwind-css)](https://tailwindcss.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://tools-shed.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ✨ Live Demo

**→ [tools-shed.com](https://tools-shed.com)**

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

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) — App Router, SSG |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
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
# → http://localhost:3000

# Build
npm run build
```

---

## ➕ Adding a New Tool

New tools follow a 3-step pattern:

**1. Register in `lib/tools.ts`**
```ts
{
  slug: "my-tool",
  name: "My Tool",
  description: "What it does in one sentence.",
  category: "Developer Tools",
  categorySlug: "developer",
  icon: "🔧",
  keywords: ["keyword1", "keyword2"],
}
```

**2. Create the component (`components/tools/MyTool.tsx`)**
```tsx
"use client";
import { useState } from "react";

export default function MyTool() {
  // All logic runs in the browser
}
```

**3. Create the page (`app/developer/my-tool/page.tsx`)**
```tsx
import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import MyTool from "@/components/tools/MyTool";

export const metadata: Metadata = {
  title: "My Tool",
  description: "SEO description under 150 chars.",
};

export default function MyToolPage() {
  return (
    <ToolLayout
      toolName="My Tool"
      toolSlug="my-tool"
      categoryName="Developer Tools"
      categorySlug="developer"
      description="Shown under the page title."
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
Next.js SSG → every page pre-rendered as static HTML at build time
     ↓
Vercel Edge Network → served globally from CDN
```

**Key design decisions:**
- `page.tsx` files are **Server Components** (export `metadata`)
- Tool UI files in `components/tools/` are **Client Components** (`"use client"`)
- Never pass functions from Server → Client as props (Next.js serialization limit)

---

## 📁 Project Structure

```
tools-shed/
├── app/
│   ├── layout.tsx          # Root layout (Header, Footer, AdSense)
│   ├── page.tsx            # Home page
│   ├── sitemap.ts          # Auto-generated sitemap.xml
│   ├── robots.ts           # Auto-generated robots.txt
│   ├── [category]/         # Dynamic category index pages
│   ├── developer/          # Tool pages
│   ├── converters/
│   ├── text/
│   ├── finance/
│   ├── health/
│   └── time/
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── AdSlot.tsx          # Google AdSense wrapper
│   ├── GiscusComments.tsx  # Comment system
│   ├── ToolLayout.tsx      # Shared tool page wrapper
│   └── tools/              # 16 tool components
└── lib/
    └── tools.ts            # Tool & category metadata registry
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
- [ ] RegEx Tester
- [ ] Diff Checker
- [ ] Markdown Preview
- [ ] Unix Timestamp Converter
- [ ] CSV ↔ JSON Converter
- [ ] Color Converter (HEX/RGB/HSL)
- [ ] Loan / Mortgage Calculator

**Phase 2 (after traffic):**
- [ ] User accounts + saved favorites (Neon DB + Auth.js)
- [ ] Dark/light theme toggle

---

## 📄 License

MIT © [hasune](https://github.com/hasune)
