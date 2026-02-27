# CLAUDE.md — ToolsShed 프로젝트 컨텍스트

> 이 파일은 Claude Code가 새 세션을 시작할 때 프로젝트 전체 컨텍스트를 즉시 파악할 수 있도록 작성되었습니다.
> 모든 커뮤니케이션은 **한국어**로 합니다.

---

## 프로젝트 개요

**ToolsShed** — 12개 언어 지원 글로벌 타겟 무료 온라인 도구 모음 사이트.

- **목표**: Google AdSense 수익 + 글로벌 개발자/일반 사용자 트래픽
- **특징**: 서버 없음, 브라우저에서 모든 계산 처리, 로그인 불필요, 12개 언어 지원
- **참고**: 한국어 자매 사이트(life-tools.net)가 별도로 존재함 (이 프로젝트와 무관)
- **도구 목록**: [`TOOLS.md`](./TOOLS.md) — 현재 구현된 155개 도구 전체 인벤토리 (새 도구 제안 전 반드시 확인)

---

## 기술 스택

| 항목 | 기술 | 버전 |
|------|------|------|
| Framework | Next.js (App Router) | ^16.1.6 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | ^3.4.1 |
| Runtime | React | ^19.0.0 |
| i18n | next-intl | ^4.8.3 |
| Hosting | Vercel (Hobby) | - |
| Comments | Giscus (GitHub Discussions 기반) | - |
| 광고 | Google AdSense | - |

---

## 배포 정보

| 항목 | 값 |
|------|-----|
| GitHub 저장소 | https://github.com/hasune/tools-shed |
| Vercel 프로덕션 URL | https://tools-shed.vercel.app |
| Vercel 프로젝트명 | cadenzas-projects/tools-shed |
| 커스텀 도메인 | https://tools-shed.com ✅ |
| 배포 방식 | `git push` → Vercel 자동 배포 (GitHub 연동됨) |

> **배포 명령어**: `git push origin main` 만으로 자동 배포됨.

---

## 광고 / 수익화

| 항목 | 값 |
|------|-----|
| AdSense Publisher ID | `ca-pub-6229200956587599` |
| 광고 슬롯 위치 | `components/AdSlot.tsx` |
| 실제 광고 슬롯 ID | **TODO**: AdSense 승인 후 실제 slot ID로 교체 필요 |

**현재 `ToolLayout.tsx`의 Ad slot ID는 플레이스홀더:**
```tsx
<AdSlot slot="1234567890" format="leaderboard" />  // 교체 필요
<AdSlot slot="0987654321" format="rectangle" />    // 교체 필요
```

---

## Giscus 댓글 설정

| 항목 | 값 |
|------|-----|
| GitHub 저장소 | `hasune/tools-shed` |
| Repo ID | `R_kgDORVbF2Q` |
| Category ID | `DIC_kwDORVbF2c4C262O` |
| Mapping | `specific` (도구 slug 기준) |

---

## i18n 구조 (next-intl)

### 지원 언어 (12개)

| 코드 | 언어 | 타겟 지역 |
|------|------|----------|
| `en` | 영어 | 글로벌 (기본값) |
| `ja` | 일본어 | 일본 |
| `ko` | 한국어 | 한국 |
| `zh-CN` | 중국어(간체) | 중국, 싱가포르 |
| `es` | 스페인어 | 스페인, 중남미 |
| `pt-BR` | 포르투갈어(브라질) | 브라질 |
| `fr` | 프랑스어 | 프랑스, 아프리카 |
| `de` | 독일어 | 독일, 오스트리아 |
| `ru` | 러시아어 | 러시아, 구소련권 |
| `it` | 이탈리아어 | 이탈리아 |
| `tr` | 터키어 | 터키 |
| `id` | 인도네시아어 | 인도네시아 |

### URL 구조
- 모든 언어가 prefix 포함: `/en/`, `/ja/`, `/ko/` ...
- 루트 `/` → `/en/` 자동 리다이렉트 (307)

### 핵심 i18n 파일

| 파일 | 역할 |
|------|------|
| `i18n/routing.ts` | 지원 언어 목록 + `localePrefix: "always"` 설정 |
| `i18n/request.ts` | 서버 사이드 메시지 로딩 |
| `i18n/navigation.ts` | locale-aware `Link`, `useRouter`, `usePathname` |
| `proxy.ts` | 미들웨어 (로케일 감지 + 리다이렉트) |
| `messages/en.json` | 번역 파일 (source of truth, ~1200+ 키) |
| `messages/{locale}.json` | 각 언어 번역 파일 (11개) |

### 번역 방식
- **Server Component** (`page.tsx`, `ToolLayout.tsx`, `Footer.tsx`): `await getTranslations({ locale, namespace: "..." })`
- **Client Component** (도구 컴포넌트, `Header.tsx`): `useTranslations("...")`
- **Link**: `next/link` 대신 반드시 `@/i18n/navigation`의 `Link` 사용

### 언어 추가 방법
1. `messages/{new-locale}.json` 생성 (en.json 구조 복사 + 번역)
2. `i18n/routing.ts`의 `locales` 배열에 추가
3. `app/sitemap.ts`의 `LOCALES` 배열에 추가

→ 나머지(URL, hreflang, 드롭다운, sitemap)는 **자동** 처리됨

---

## 프로젝트 구조

```
tools-shed/
├── app/
│   ├── layout.tsx                    # 루트 레이아웃
│   ├── globals.css                   # Tailwind + 전역 스타일
│   ├── sitemap.ts                    # sitemap.xml 자동 생성 (12 × 전체 페이지)
│   ├── robots.ts
│   ├── opengraph-image.tsx           # 홈 OG 이미지
│   └── [locale]/
│       ├── layout.tsx                # html lang={locale} + NextIntlClientProvider + AdSense
│       ├── page.tsx                  # 홈페이지
│       ├── not-found.tsx
│       ├── about/page.tsx
│       ├── privacy/page.tsx
│       ├── [category]/page.tsx       # 카테고리 인덱스
│       ├── developer/                # 42개 도구 페이지
│       ├── converters/               # 22개 도구 페이지
│       ├── text/                     # 23개 도구 페이지
│       ├── finance/                  # 19개 도구 페이지
│       ├── health/                   # 18개 도구 페이지
│       ├── time/                     # 12개 도구 페이지
│       └── math/                     # 19개 도구 페이지
│
├── components/
│   ├── Header.tsx                    # useTranslations + LocaleSwitcher
│   ├── Footer.tsx                    # getTranslations (Server Component)
│   ├── LocaleSwitcher.tsx            # 언어 전환 드롭다운
│   ├── AdSlot.tsx                    # Google AdSense 슬롯
│   ├── GiscusComments.tsx            # Giscus 댓글
│   ├── ToolLayout.tsx                # 도구 페이지 공통 래퍼 (광고/댓글/빵부스러기)
│   └── tools/                        # 155개 도구 UI 컴포넌트 ("use client" + useTranslations)
│       ├── UnitConverter.tsx         # length/weight/data-storage/speed/area/volume 등 공유
│       ├── TemperatureConverter.tsx  # 온도 전용
│       └── ...                       # 각 도구별 컴포넌트
│
├── lib/
│   └── tools/                        # 도구 메타데이터 레지스트리 (카테고리별 분리)
│       ├── types.ts                  # Tool, Category 인터페이스
│       ├── developer.ts              # Developer Tools (42개)
│       ├── converters.ts             # Unit Converters (22개)
│       ├── text.ts                   # Text Tools (23개)
│       ├── finance.ts                # Finance Tools (19개)
│       ├── health.ts                 # Health Tools (18개)
│       ├── time.ts                   # Time Tools (12개)
│       ├── math.ts                   # Math Tools (19개)
│       └── index.ts                  # 전체 통합 + 헬퍼 함수 export
│
├── i18n/
│   ├── routing.ts
│   ├── request.ts
│   └── navigation.ts
│
├── messages/
│   ├── en.json                       # Source of truth (~900+ 키)
│   └── {ja,ko,zh-CN,es,pt-BR,fr,de,ru,it,tr,id}.json
│
├── .claude/
│   ├── settings.json                 # Claude Code 훅 설정 (커밋됨, public)
│   └── hooks/
│       ├── protect-files.sh          # package-lock.json 등 보호 (PreToolUse)
│       ├── check-translation-keys.py # 번역 키 누락 검사 (PostToolUse)
│       ├── translation-reminder.sh   # en.json 수정 시 11개 언어 파일 상기
│       ├── tools-md-reminder.sh      # lib/tools 수정 시 TOOLS.md 상기
│       └── completion-checklist.sh   # 작업 완료 시 page.tsx/번역/TOOLS.md 검증 (Stop)
├── TOOLS.md                          # ← 도구 전체 인벤토리 (새 도구 추가 전 참조)
├── proxy.ts                          # next-intl 미들웨어
└── next.config.ts                    # createNextIntlPlugin 래핑
```

---

## 새 도구 추가 방법 (i18n 포함 전체 절차)

> ⚠️ **먼저 [`TOOLS.md`](./TOOLS.md)에서 유사 도구가 없는지 확인할 것**

### Step 1: `lib/tools/{category}.ts`에 메타데이터 추가
```ts
{
  slug: "new-tool-slug",
  name: "Tool Name",
  description: "Short description.",
  category: "Developer Tools",
  categorySlug: "developer",
  icon: "🔧",
  keywords: ["keyword1", "keyword2"],
}
```

### Step 2: `messages/en.json`에 번역 키 추가
```json
// "Tools" 섹션:
"new-tool-slug": {
  "name": "New Tool Name",
  "description": "Short description.",
  "metaTitle": "New Tool Name",
  "metaDescription": "SEO description under 150 chars."
}

// 도구 UI 네임스페이스:
"NewTool": {
  "inputLabel": "Input",
  "button": "Process"
}
```

### Step 3: 나머지 11개 언어 파일에 동일 키 번역 추가

### Step 4: `components/tools/NewTool.tsx` 생성
```tsx
"use client";
import { useTranslations } from "next-intl";
export default function NewTool() {
  const t = useTranslations("NewTool");
}
```

### Step 5: `app/[locale]/{category}/new-tool-slug/page.tsx` 생성
```tsx
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import ToolLayout from "@/components/ToolLayout";
import NewTool from "@/components/tools/NewTool";

const BASE_URL = "https://tools-shed.com";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Tools.new-tool-slug" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${BASE_URL}/${locale}/developer/new-tool-slug`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}/developer/new-tool-slug`])
      ),
    },
  };
}

export default async function NewToolPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tTools = await getTranslations({ locale, namespace: "Tools.new-tool-slug" });
  const tCat = await getTranslations({ locale, namespace: "Categories.developer" });
  return (
    <ToolLayout toolName={tTools("name")} toolSlug="new-tool-slug"
      categoryName={tCat("name")} categorySlug="developer" description={tTools("description")}>
      <NewTool />
    </ToolLayout>
  );
}
```

### Step 6: `TOOLS.md` 업데이트

> ⚠️ `toolSlug`는 영어 slug 고정. `toolName`은 번역된 값 전달.
> ⚠️ Server Component에서 Client Component로 **함수를 props로 전달하지 말 것**.

---

## 아키텍처 핵심 원칙

1. **모든 계산은 클라이언트 사이드** — 서버 API 없음, DB 없음
2. **SSG** — 모든 페이지가 빌드 시 정적 HTML로 생성됨
3. **`"use client"` 디렉티브** — useState가 있는 컴포넌트에 반드시 붙일 것
4. **Server Component는 metadata만 export** — page.tsx는 Server Component 유지
5. **도구 컴포넌트는 ToolLayout으로 감쌈** — 광고/댓글/빵부스러기 자동 포함
6. **i18n Link 사용** — `next/link` 대신 `@/i18n/navigation`의 `Link` 사용
7. **번역 키 네이밍** — 도구 메타: `Tools.{slug}.name`, UI 문자열: `{ComponentName}.{key}`

---

## SEO 설정 현황

| 항목 | 상태 |
|------|------|
| metadataBase | `https://tools-shed.com` ✅ |
| hreflang | 12개 언어 alternate 태그 자동 삽입 ✅ |
| html lang | 언어별 동적 설정 ✅ |
| sitemap.xml | 12개 언어 × 전체 페이지, GSC 제출 완료 ✅ |
| JSON-LD | `ToolLayout.tsx`에서 WebApplication 스키마 자동 삽입 ✅ |
| Favicon | SVG emoji (`🛠️`) ✅ |
| Google Search Console | 등록 + sitemap 제출 완료 ✅ |
| Google Analytics 4 | G-3N423K0N2Q ✅ |

### SEO 원칙
- `metaTitle` 60자 이내, `metaDescription` 150자 이내
- 모든 `h1`은 페이지당 하나

---

## 디자인 시스템

- **테마**: 다크 모드 전용
- **배경**: `bg-gray-950` → `bg-gray-900` → `bg-gray-800`
- **강조색**: `indigo-400` / `indigo-500` / `indigo-600`
- **텍스트**: `text-white` / `text-gray-300` / `text-gray-400` / `text-gray-500`
- **보더**: `border-gray-700` / `border-gray-800`, 호버: `hover:border-indigo-500/50`
- **반응형**: Tailwind 기본 breakpoint (`sm:`, `md:`, `lg:`)

---

## 개발 명령어

```bash
npm run dev       # 로컬 개발 서버
npm run build     # 프로덕션 빌드
npm run lint      # ESLint 검사
git push origin main  # Vercel 자동 배포
```

---

## TODO

### 즉시
- [ ] Google AdSense 승인 신청
- [ ] AdSense 승인 후 `ToolLayout.tsx`의 실제 slot ID 입력
- [ ] Giscus GitHub App 설치 확인

### 검토 중
- [ ] 아랍어(`ar`) — RTL 레이아웃 추가 CSS 작업 필요

### Phase 3 (장기)
- [ ] Neon DB + Auth.js (즐겨찾기 저장 기능)

---

## 보안 주의사항

**GitHub Public 저장소여도 안전한 값들**: AdSense Publisher ID, GA 측정 ID, Giscus Repo/Category ID — 모두 프론트엔드 공개 식별자

**Phase 3에서 반드시 Vercel 환경변수로 관리해야 할 것**:
```
DATABASE_URL=postgres://...
NEXTAUTH_SECRET=...
```

---

## 주요 파일 참조

| 파일 | 용도 |
|------|------|
| `TOOLS.md` | **새 도구 제안/추가 전 중복 확인** |
| `lib/tools/{category}.ts` | **새 도구 메타데이터 추가** |
| `messages/en.json` | **번역 키 추가 (source of truth)** |
| `i18n/routing.ts` | 언어 추가 시 수정 |
| `components/ToolLayout.tsx` | 모든 도구 페이지의 공통 래퍼 |
| `app/sitemap.ts` | 사이트맵 (언어 추가 시 LOCALES 수정) |
| `proxy.ts` | next-intl 미들웨어 |
| `.claude/settings.json` | Claude Code 훅 설정 |
| `.claude/hooks/` | 프로젝트 품질 자동 검사 훅 스크립트 |
