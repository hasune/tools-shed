# CLAUDE.md — ToolsShed 프로젝트 컨텍스트

> 이 파일은 Claude Code가 새 세션을 시작할 때 프로젝트 전체 컨텍스트를 즉시 파악할 수 있도록 작성되었습니다.
> 모든 커뮤니케이션은 **한국어**로 합니다.

---

## 프로젝트 개요

**ToolsShed** — 영어권 글로벌 타겟 무료 온라인 도구 모음 사이트.

- **목표**: Google AdSense 수익 + 글로벌 개발자/일반 사용자 트래픽
- **특징**: 서버 없음, 브라우저에서 모든 계산 처리, 로그인 불필요
- **참고**: 한국어 자매 사이트(life-tools.net)가 별도로 존재함 (이 프로젝트와 무관)

---

## 기술 스택

| 항목 | 기술 | 버전 |
|------|------|------|
| Framework | Next.js (App Router) | ^16.1.6 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | ^3.4.1 |
| Runtime | React | ^19.0.0 |
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
> 수동 배포가 필요하면: `vercel --prod`

---

## 광고 / 수익화

| 항목 | 값 |
|------|-----|
| AdSense Publisher ID | `ca-pub-6229200956587599` |
| 광고 슬롯 위치 | `components/AdSlot.tsx` |
| 실제 광고 슬롯 ID | **TODO**: AdSense에서 새 도메인 승인 후 실제 slot ID로 교체 필요 |
| AdSense 스크립트 로딩 | `app/layout.tsx` — `next/script` `afterInteractive` 전략 사용 |

**현재 `ToolLayout.tsx`의 Ad slot ID는 플레이스홀더 값:**
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
| 카테고리 | `Announcements` |
| Category ID | `DIC_kwDORVbF2c4C262O` |
| Mapping | `specific` (도구 slug 기준) |
| 테마 | `dark` |
| 설정 파일 | `components/GiscusComments.tsx` |

> **중요**: Giscus GitHub App이 `hasune/tools-shed` 저장소에 설치되어 있어야 작동함.
> 미설치 시 → https://github.com/apps/giscus/installations/new 에서 설치.

---

## 프로젝트 구조

```
tools-shed/
├── app/
│   ├── layout.tsx                    # 루트 레이아웃 (Header, Footer, AdSense 스크립트)
│   ├── page.tsx                      # 메인 페이지 (히어로 + 카테고리 카드 그리드)
│   ├── not-found.tsx                 # 커스텀 404 페이지
│   ├── globals.css                   # Tailwind 지시문 + 전역 스타일 (다크 배경)
│   ├── sitemap.ts                    # 자동 sitemap.xml 생성
│   ├── robots.ts                     # 자동 robots.txt 생성
│   ├── [category]/
│   │   └── page.tsx                  # 카테고리 인덱스 페이지 (동적 라우트)
│   ├── developer/
│   │   ├── json-formatter/page.tsx
│   │   ├── uuid-generator/page.tsx
│   │   ├── base64/page.tsx
│   │   ├── url-encoder/page.tsx
│   │   ├── hash-generator/page.tsx
│   │   └── jwt-decoder/page.tsx
│   ├── converters/
│   │   ├── length-converter/page.tsx
│   │   ├── weight-converter/page.tsx
│   │   └── temperature-converter/page.tsx
│   ├── text/
│   │   ├── word-counter/page.tsx
│   │   ├── case-converter/page.tsx
│   │   └── password-generator/page.tsx
│   ├── finance/
│   │   ├── compound-interest/page.tsx
│   │   └── percentage-calculator/page.tsx
│   ├── health/
│   │   └── bmi-calculator/page.tsx
│   └── time/
│       ├── age-calculator/page.tsx
│       └── timezone-converter/page.tsx
│
├── components/
│   ├── Header.tsx                    # 네비게이션 헤더 (모바일 반응형)
│   ├── Footer.tsx                    # 푸터 (도구 링크 모음)
│   ├── AdSlot.tsx                    # Google AdSense 슬롯 컴포넌트
│   ├── GiscusComments.tsx            # Giscus 댓글 컴포넌트
│   ├── ToolLayout.tsx                # 도구 페이지 공통 레이아웃 (빵부스러기 + 광고 + 댓글)
│   └── tools/                        # 각 도구 UI 컴포넌트 (모두 "use client")
│       ├── JsonFormatter.tsx
│       ├── UuidGenerator.tsx
│       ├── Base64Tool.tsx
│       ├── UrlEncoderDecoder.tsx
│       ├── HashGenerator.tsx
│       ├── JwtDecoder.tsx
│       ├── UnitConverter.tsx         # length/weight 타입 공유 컴포넌트
│       ├── TemperatureConverter.tsx
│       ├── WordCounter.tsx
│       ├── CaseConverter.tsx
│       ├── PasswordGenerator.tsx
│       ├── CompoundInterest.tsx
│       ├── PercentageCalculator.tsx
│       ├── BmiCalculator.tsx
│       ├── AgeCalculator.tsx
│       └── TimezoneConverter.tsx
│
└── lib/
    └── tools.ts                      # 도구 메타데이터 레지스트리 (Tool, Category 타입 + 배열)
```

---

## 현재 구현된 도구 목록 (17개)

### Developer Tools (`/developer`)
| slug | 도구명 | 설명 |
|------|--------|------|
| `json-formatter` | JSON Formatter | 포맷/검증/최소화 |
| `uuid-generator` | UUID Generator | v4 UUID 생성 (bulk 지원) |
| `base64` | Base64 Encoder/Decoder | Unicode 지원 |
| `url-encoder` | URL Encoder/Decoder | encodeURIComponent / encodeURI |
| `hash-generator` | Hash Generator | MD5, SHA-256, SHA-512 |
| `jwt-decoder` | JWT Decoder | 페이로드 디코딩 (서명 검증 없음) |

### Unit Converters (`/converters`)
| slug | 도구명 |
|------|--------|
| `length-converter` | 길이 변환 (9개 단위) |
| `weight-converter` | 무게 변환 (8개 단위) |
| `temperature-converter` | 온도 변환 (°C, °F, K) |

### Text Tools (`/text`)
| slug | 도구명 |
|------|--------|
| `word-counter` | 단어/글자/문장/단락/읽기 시간 |
| `case-converter` | 8가지 케이스 변환 |
| `password-generator` | 보안 비밀번호 생성기 |

### Finance Tools (`/finance`)
| slug | 도구명 |
|------|--------|
| `compound-interest` | 복리 계산기 |
| `percentage-calculator` | 퍼센트 계산기 (4가지 모드) |

### Health Tools (`/health`)
| slug | 도구명 |
|------|--------|
| `bmi-calculator` | BMI 계산기 (metric/imperial) |

### Time Tools (`/time`)
| slug | 도구명 |
|------|--------|
| `age-calculator` | 나이 계산기 |
| `timezone-converter` | 시간대 변환 (15개 주요 도시) |

---

## 새 도구 추가 방법

새 도구를 추가할 때는 **반드시 이 순서**를 따를 것:

### Step 1: `lib/tools.ts`에 메타데이터 등록
```ts
{
  slug: "new-tool-slug",
  name: "Tool Name",
  description: "한 줄 설명",
  category: "Developer Tools",       // 카테고리 표시명
  categorySlug: "developer",         // URL에 사용되는 slug
  icon: "🔧",
  keywords: ["keyword1", "keyword2"],
}
```

### Step 2: 도구 컴포넌트 생성 (`components/tools/NewTool.tsx`)
```tsx
"use client";   // ← 반드시 필요 (브라우저 계산)

import { useState } from "react";

export default function NewTool() {
  // 로직 구현
}
```

### Step 3: 페이지 파일 생성 (`app/{categorySlug}/{tool-slug}/page.tsx`)
```tsx
import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import NewTool from "@/components/tools/NewTool";

export const metadata: Metadata = {
  title: "Tool Name",
  description: "SEO 설명 (150자 이내)",
  keywords: ["keyword1", "keyword2"],
};

export default function NewToolPage() {
  return (
    <ToolLayout
      toolName="Tool Name"
      toolSlug="new-tool-slug"
      categoryName="Developer Tools"
      categorySlug="developer"
      description="페이지 상단에 표시될 설명"
    >
      <NewTool />
    </ToolLayout>
  );
}
```

> ⚠️ **주의**: Server Component(page.tsx)에서 Client Component로 **함수를 props로 전달하지 말 것**.
> 함수가 포함된 데이터는 Client Component 내부에서 정의해야 함.
> (UnitConverter.tsx의 UNIT_SETS 패턴 참조)

---

## 아키텍처 핵심 원칙

1. **모든 계산은 클라이언트 사이드** — 서버 API 없음, DB 없음
2. **SSG(Static Site Generation)** — 모든 페이지가 빌드 시 정적 HTML로 생성됨
3. **`"use client"` 디렉티브** — 상태(useState)가 있는 컴포넌트는 반드시 붙여야 함
4. **Server Component는 metadata만 export** — page.tsx는 Server Component 유지
5. **도구 컴포넌트는 ToolLayout으로 감쌈** — 광고/댓글/빵부스러기 자동 포함

---

## SEO 설정

- **sitemap.xml**: `app/sitemap.ts` → 빌드 시 자동 생성
- **robots.txt**: `app/robots.ts` → 빌드 시 자동 생성
- **BASE_URL**: 현재 `"https://tools-shed.com"` (플레이스홀더)
  → 실제 도메인 확정 후 `sitemap.ts`, `robots.ts` 두 파일 모두 수정 필요
- **페이지별 메타**: 각 `page.tsx`의 `generateMetadata()` 또는 `metadata` export로 관리
- **OG 태그**: `app/layout.tsx`에서 기본값 설정, 각 도구 페이지에서 오버라이드

---

## 디자인 시스템

- **테마**: 다크 모드 전용
- **배경**: `bg-gray-950` (최상위), `bg-gray-900` (카드), `bg-gray-800` (중첩 요소)
- **강조색**: `indigo-400` / `indigo-500` / `indigo-600`
- **텍스트**: `text-white` (제목), `text-gray-300` (본문), `text-gray-400` (설명), `text-gray-500` (보조)
- **보더**: `border-gray-700` / `border-gray-800`
- **호버**: `hover:border-indigo-500/50` 패턴
- **폰트**: 시스템 폰트 (별도 커스텀 폰트 없음)
- **반응형**: Tailwind 기본 breakpoint (`sm:`, `md:`, `lg:`)

---

## 개발 명령어

```bash
npm run dev       # 로컬 개발 서버 (localhost:3000)
npm run build     # 프로덕션 빌드 (오류 확인용)
npm run lint      # ESLint 검사
vercel --prod     # 수동 프로덕션 배포
```

---

## TODO / Phase 2 작업

### 즉시 해야 할 것
- [x] 커스텀 도메인 연결 (`tools-shed.com` ✅)
- [x] `sitemap.ts`, `robots.ts`의 BASE_URL을 실제 도메인으로 교체
- [ ] Google AdSense 새 도메인 승인 신청
- [ ] AdSense 승인 후 `ToolLayout.tsx`의 실제 slot ID 입력
- [ ] Giscus GitHub App 설치 확인 (https://github.com/apps/giscus)

### 추가 예정 도구 (계획)
- [ ] RegEx Tester
- [ ] Diff Checker (텍스트 비교)
- [ ] Markdown Preview
- [ ] Unix Timestamp Converter
- [ ] CSV ↔ JSON Converter
- [ ] Color Converter (HEX/RGB/HSL)
- [ ] Loan / Mortgage Calculator
- [ ] TDEE / Calorie Calculator
- [ ] Running Pace Calculator

### Phase 3 (장기)
- [ ] Neon DB + Auth.js (즐겨찾기 저장 기능)
- [ ] 다국어 지원 검토

---

## 주요 파일 참조

| 파일 | 용도 |
|------|------|
| `lib/tools.ts` | **새 도구 추가 시 가장 먼저 수정** |
| `components/ToolLayout.tsx` | 모든 도구 페이지의 공통 래퍼 |
| `components/AdSlot.tsx` | 광고 슬롯 (slot ID 교체 필요) |
| `components/GiscusComments.tsx` | 댓글 설정 |
| `app/layout.tsx` | 루트 메타데이터 + AdSense 스크립트 |
| `app/sitemap.ts` | BASE_URL 교체 필요 |
| `app/robots.ts` | BASE_URL 교체 필요 |
