# CLAUDE.md — ToolsShed 프로젝트 컨텍스트

> 이 파일은 Claude Code가 새 세션을 시작할 때 프로젝트 전체 컨텍스트를 즉시 파악할 수 있도록 작성되었습니다.
> 모든 커뮤니케이션은 **한국어**로 합니다.

---

## 프로젝트 개요

**ToolsShed** — 12개 언어 지원 글로벌 타겟 무료 온라인 도구 모음 사이트.

- **목표**: Google AdSense 수익 + 글로벌 개발자/일반 사용자 트래픽
- **특징**: 서버 없음, 브라우저에서 모든 계산 처리, 로그인 불필요, 12개 언어 지원
- **참고**: 한국어 자매 사이트(life-tools.net)가 별도로 존재함 (이 프로젝트와 무관)

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
> 수동 배포가 필요하면: `vercel --prod`

---

## 광고 / 수익화

| 항목 | 값 |
|------|-----|
| AdSense Publisher ID | `ca-pub-6229200956587599` |
| 광고 슬롯 위치 | `components/AdSlot.tsx` |
| 실제 광고 슬롯 ID | **TODO**: AdSense에서 새 도메인 승인 후 실제 slot ID로 교체 필요 |
| AdSense 스크립트 로딩 | `app/[locale]/layout.tsx` — `next/script` `afterInteractive` 전략 사용 |

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
- 예: `https://tools-shed.com/ja/developer/json-formatter`

### 핵심 i18n 파일

| 파일 | 역할 |
|------|------|
| `i18n/routing.ts` | 지원 언어 목록 + `localePrefix: "always"` 설정 |
| `i18n/request.ts` | 서버 사이드 메시지 로딩 |
| `i18n/navigation.ts` | locale-aware `Link`, `useRouter`, `usePathname` |
| `proxy.ts` | 미들웨어 (로케일 감지 + 리다이렉트) |
| `messages/en.json` | 번역 파일 (source of truth, ~390개 키) |
| `messages/{locale}.json` | 각 언어 번역 파일 (11개) |

### 번역 방식
- **Server Component** (`page.tsx`, `ToolLayout.tsx`, `Footer.tsx`): `await getTranslations({ locale, namespace: "..." })`
- **Client Component** (도구 컴포넌트, `Header.tsx`, `LocaleSwitcher.tsx`): `useTranslations("...")`
- **Link**: `next/link` 대신 반드시 `@/i18n/navigation`의 `Link` 사용

### 언어 추가 방법 (매우 간단)
1. `messages/{new-locale}.json` 생성 (en.json 구조 복사 + 번역)
2. `i18n/routing.ts`의 `locales` 배열에 추가
3. `app/sitemap.ts`의 `LOCALES` 배열에 추가

→ 나머지(URL, hreflang, 드롭다운, sitemap)는 **자동** 처리됨

---

## 프로젝트 구조

```
tools-shed/
├── app/
│   ├── layout.tsx                    # 루트 레이아웃 (children만 렌더링)
│   ├── globals.css                   # Tailwind 지시문 + 전역 스타일 (다크 배경)
│   ├── sitemap.ts                    # 자동 sitemap.xml 생성 (12개 언어 × 도구/카테고리)
│   ├── robots.ts                     # 자동 robots.txt 생성
│   ├── opengraph-image.tsx           # 홈 OG 이미지 (정적)
│   └── [locale]/                     # ← 모든 페이지가 여기에 있음
│       ├── layout.tsx                # html lang={locale} + NextIntlClientProvider + AdSense
│       ├── page.tsx                  # 홈페이지
│       ├── not-found.tsx             # 404 페이지
│       ├── about/page.tsx
│       ├── privacy/page.tsx
│       ├── [category]/page.tsx       # 카테고리 인덱스 (동적)
│       ├── developer/
│       │   ├── json-formatter/page.tsx
│       │   ├── uuid-generator/page.tsx
│       │   ├── base64/page.tsx
│       │   ├── url-encoder/page.tsx
│       │   ├── hash-generator/page.tsx
│       │   ├── jwt-decoder/page.tsx
│       │   ├── color-converter/page.tsx
│       │   ├── number-base-converter/page.tsx
│       │   ├── regex-tester/page.tsx
│       │   ├── csv-json/page.tsx
│       │   ├── diff-checker/page.tsx
│       │   ├── lorem-ipsum/page.tsx
│       │   ├── html-encoder/page.tsx
│       │   ├── yaml-json/page.tsx
│       │   ├── cron-parser/page.tsx
│       │   ├── json-to-typescript/page.tsx
│       │   ├── sql-formatter/page.tsx
│       │   └── string-escape/page.tsx
│       ├── converters/
│       │   ├── length-converter/page.tsx
│       │   ├── weight-converter/page.tsx
│       │   ├── temperature-converter/page.tsx
│       │   ├── data-storage-converter/page.tsx
│       │   ├── speed-converter/page.tsx
│       │   ├── area-converter/page.tsx
│       │   └── volume-converter/page.tsx
│       ├── text/
│       │   ├── word-counter/page.tsx
│       │   ├── case-converter/page.tsx
│       │   ├── password-generator/page.tsx
│       │   ├── markdown-preview/page.tsx
│       │   ├── slug-generator/page.tsx
│       │   ├── text-repeater/page.tsx
│       │   ├── text-to-binary/page.tsx
│       │   └── random-name-generator/page.tsx
│       ├── finance/
│       │   ├── compound-interest/page.tsx
│       │   ├── percentage-calculator/page.tsx
│       │   ├── discount-calculator/page.tsx
│       │   ├── loan-calculator/page.tsx
│       │   ├── roi-calculator/page.tsx
│       │   └── tip-calculator/page.tsx
│       ├── health/
│       │   ├── bmi-calculator/page.tsx
│       │   ├── tdee-calculator/page.tsx
│       │   ├── ideal-weight/page.tsx
│       │   ├── body-fat/page.tsx
│       │   ├── running-pace/page.tsx
│       │   └── water-intake/page.tsx
│       ├── time/
│       │   ├── age-calculator/page.tsx
│       │   ├── timezone-converter/page.tsx
│       │   ├── unix-timestamp/page.tsx
│       │   ├── date-difference/page.tsx
│       │   └── time-duration/page.tsx
│       └── math/
│           ├── scientific-calculator/page.tsx
│           ├── gcd-lcm/page.tsx
│           └── quadratic-solver/page.tsx
│
├── components/
│   ├── Header.tsx                    # 네비게이션 헤더 (useTranslations + LocaleSwitcher 포함)
│   ├── Footer.tsx                    # 푸터 (getTranslations — Server Component)
│   ├── LocaleSwitcher.tsx            # 언어 전환 드롭다운 (Client Component)
│   ├── AdSlot.tsx                    # Google AdSense 슬롯 컴포넌트
│   ├── GiscusComments.tsx            # Giscus 댓글 컴포넌트
│   ├── ToolLayout.tsx                # 도구 페이지 공통 레이아웃 (getTranslations — Server Component)
│   └── tools/                        # 각 도구 UI 컴포넌트 (모두 "use client" + useTranslations)
│       ├── JsonFormatter.tsx
│       ├── UuidGenerator.tsx
│       ├── Base64Tool.tsx
│       ├── UrlEncoderDecoder.tsx
│       ├── HashGenerator.tsx
│       ├── JwtDecoder.tsx
│       ├── ColorConverter.tsx
│       ├── NumberBaseConverter.tsx
│       ├── RegexTester.tsx
│       ├── CsvJson.tsx
│       ├── DiffChecker.tsx
│       ├── LoremIpsum.tsx
│       ├── HtmlEncoder.tsx
│       ├── YamlJson.tsx              # js-yaml 라이브러리 사용
│       ├── UnitConverter.tsx         # length/weight/data-storage/speed/area/volume 공유 컴포넌트
│       ├── TemperatureConverter.tsx
│       ├── WordCounter.tsx
│       ├── CaseConverter.tsx
│       ├── PasswordGenerator.tsx
│       ├── MarkdownPreview.tsx       # 커스텀 정규식 기반 마크다운 파서 (외부 deps 없음)
│       ├── SlugGenerator.tsx
│       ├── TextRepeater.tsx
│       ├── CompoundInterest.tsx
│       ├── PercentageCalculator.tsx
│       ├── DiscountCalculator.tsx
│       ├── LoanCalculator.tsx
│       ├── RoiCalculator.tsx
│       ├── BmiCalculator.tsx
│       ├── TdeeCalculator.tsx        # Mifflin-St Jeor BMR 공식
│       ├── IdealWeight.tsx           # Robinson/Miller/Devine/Hamwi 4가지 공식
│       ├── BodyFat.tsx               # U.S. Navy 방법
│       ├── AgeCalculator.tsx
│       ├── TimezoneConverter.tsx
│       ├── UnixTimestamp.tsx
│       ├── DateDifference.tsx
│       ├── TimeDuration.tsx
│       ├── ScientificCalculator.tsx
│       ├── GcdLcm.tsx
│       ├── QuadraticSolver.tsx
│       ├── CronParser.tsx
│       ├── JsonToTypescript.tsx
│       ├── SqlFormatter.tsx
│       ├── StringEscape.tsx
│       ├── TextToBinary.tsx
│       ├── RandomNameGenerator.tsx
│       ├── TipCalculator.tsx
│       ├── RunningPace.tsx
│       └── WaterIntake.tsx
│
├── i18n/
│   ├── routing.ts                    # 지원 언어 + localePrefix 설정
│   ├── request.ts                    # 서버 사이드 메시지 로딩
│   └── navigation.ts                 # locale-aware Link/useRouter/usePathname
│
├── messages/
│   ├── en.json                       # Source of truth (~390 키)
│   ├── ja.json
│   ├── ko.json
│   ├── zh-CN.json
│   ├── es.json
│   ├── pt-BR.json
│   ├── fr.json
│   ├── de.json
│   ├── ru.json
│   ├── it.json
│   ├── tr.json
│   └── id.json
│
├── lib/
│   └── tools.ts                      # 도구 메타데이터 레지스트리 (Tool, Category 타입 + 배열)
│
├── proxy.ts                          # next-intl 미들웨어 (미들웨어 역할)
└── next.config.ts                    # createNextIntlPlugin 래핑
```

---

## 현재 구현된 도구 목록 (53개)

### Developer Tools (`/developer`) — 18개
| slug | 도구명 | 설명 |
|------|--------|------|
| `json-formatter` | JSON Formatter | 포맷/검증/최소화 |
| `uuid-generator` | UUID Generator | v4 UUID 생성 (bulk 지원) |
| `base64` | Base64 Encoder/Decoder | Unicode 지원 |
| `url-encoder` | URL Encoder/Decoder | encodeURIComponent / encodeURI |
| `hash-generator` | Hash Generator | MD5, SHA-256, SHA-512 |
| `jwt-decoder` | JWT Decoder | 페이로드 디코딩 (서명 검증 없음) |
| `color-converter` | Color Converter | HEX↔RGB↔HSL, 컬러 피커 |
| `number-base-converter` | Number Base Converter | 2진/8진/10진/16진 실시간 변환 |
| `regex-tester` | RegEx Tester | 라이브 매치 하이라이팅, 플래그 토글 |
| `csv-json` | CSV ↔ JSON Converter | 구분자 옵션, 헤더 행 토글 |
| `diff-checker` | Diff Checker | LCS 알고리즘 기반 줄별 비교 |
| `lorem-ipsum` | Lorem Ipsum Generator | 단락/문장/단어 생성 |
| `html-encoder` | HTML Encoder/Decoder | HTML 엔티티 인코딩/디코딩 |
| `yaml-json` | YAML ↔ JSON Converter | js-yaml 라이브러리 사용 |
| `cron-parser` | Cron Expression Parser | Cron 문법 설명 + 다음 5회 실행 시각 |
| `json-to-typescript` | JSON → TypeScript | JSON에서 TypeScript 인터페이스 자동 생성 |
| `sql-formatter` | SQL Formatter | SQL 키워드 대소문자/들여쓰기 정리 |
| `string-escape` | String Escape/Unescape | JSON/JS/HTML 문자열 이스케이프 |

### Unit Converters (`/converters`) — 7개
| slug | 도구명 | 비고 |
|------|--------|------|
| `length-converter` | 길이 변환 | 9개 단위 |
| `weight-converter` | 무게 변환 | 8개 단위 |
| `temperature-converter` | 온도 변환 | °C, °F, K |
| `data-storage-converter` | 데이터 용량 변환 | Byte~PB, KiB~TiB (10개 단위) |
| `speed-converter` | 속도 변환 | m/s, km/h, mph, knot, ft/s, Mach |
| `area-converter` | 면적 변환 | m², km², mi², 에이커, 헥타르 등 8개 |
| `volume-converter` | 부피 변환 | L, mL, m³, 갤런, 파인트 등 10개 |

> 위 6개 converter는 `UnitConverter.tsx` 컴포넌트 공유 (UNIT_SETS 레코드에 타입별 단위 정의)

### Text Tools (`/text`) — 8개
| slug | 도구명 |
|------|--------|
| `word-counter` | 단어/글자/문장/단락/읽기 시간 |
| `case-converter` | 8가지 케이스 변환 |
| `password-generator` | 보안 비밀번호 생성기 |
| `markdown-preview` | Markdown Preview (커스텀 파서, 외부 deps 없음) |
| `slug-generator` | Slug Generator (NFD 악센트 정규화) |
| `text-repeater` | Text Repeater (구분자 옵션) |
| `text-to-binary` | Text → Binary/Hex/Octal/Decimal 변환 (양방향) |
| `random-name-generator` | 랜덤 영문 이름 생성기 (성별/유형 옵션) |

### Finance Tools (`/finance`) — 6개
| slug | 도구명 |
|------|--------|
| `compound-interest` | 복리 계산기 |
| `percentage-calculator` | 퍼센트 계산기 (4가지 모드) |
| `discount-calculator` | 할인 계산기 |
| `loan-calculator` | 대출 계산기 (월납입금 + 상환 일정표) |
| `roi-calculator` | ROI 계산기 (수익률 + 연환산 ROI) |
| `tip-calculator` | 팁 계산기 (인원별 분할) |

### Health Tools (`/health`) — 6개
| slug | 도구명 |
|------|--------|
| `bmi-calculator` | BMI 계산기 (metric/imperial) |
| `tdee-calculator` | TDEE 계산기 (Mifflin-St Jeor BMR, 5가지 활동 레벨) |
| `ideal-weight` | 적정 체중 계산기 (Robinson/Miller/Devine/Hamwi 4가지 공식) |
| `body-fat` | 체지방률 계산기 (U.S. Navy 방법) |
| `running-pace` | 러닝 페이스 계산기 (페이스/시간/거리 3가지 모드) |
| `water-intake` | 수분 섭취량 계산기 (체중 × 활동량 × 기후) |

### Time Tools (`/time`) — 5개
| slug | 도구명 |
|------|--------|
| `age-calculator` | 나이 계산기 |
| `timezone-converter` | 시간대 변환 (15개 주요 도시) |
| `unix-timestamp` | Unix Timestamp 변환 (라이브 틱, ms/s 자동 감지) |
| `date-difference` | 날짜 차이 계산 (총 일수, 근무일, 주/월/년) |
| `time-duration` | 시간 더하기/빼기 (HH:MM:SS) |

### Math Tools (`/math`) — 3개 ← 신규 카테고리
| slug | 도구명 |
|------|--------|
| `scientific-calculator` | 공학용 계산기 (sin/cos/tan/log/sqrt/π/e, DEG/RAD, 계산 기록) |
| `gcd-lcm` | 최대공약수·최소공배수 (유클리드 알고리즘, 단계별 풀이) |
| `quadratic-solver` | 이차방정식 풀이기 (실수/복소수 근, 꼭짓점, 단계별 풀이) |

---

## 새 도구 추가 방법 (i18n 포함 전체 절차)

새 도구를 추가할 때는 **반드시 이 순서**를 따를 것:

### Step 1: `lib/tools.ts`에 메타데이터 등록
```ts
{
  slug: "new-tool-slug",
  name: "Tool Name",          // 영어 고정 (URL 안정성)
  description: "한 줄 설명",
  category: "Developer Tools",
  categorySlug: "developer",
  icon: "🔧",
  keywords: ["keyword1", "keyword2"],
}
```

### Step 2: `messages/en.json`에 번역 키 추가
`"Tools"` 섹션에 추가:
```json
"new-tool-slug": {
  "name": "New Tool Name",
  "description": "Short description.",
  "metaTitle": "New Tool Name",
  "metaDescription": "SEO description under 150 chars."
}
```

도구 UI 전용 네임스페이스도 추가 (컴포넌트에서 사용할 문자열):
```json
"NewTool": {
  "inputLabel": "Input",
  "button": "Process"
}
```

### Step 3: 나머지 11개 언어 파일에 동일 키 번역 추가
`messages/ja.json`, `ko.json`, `zh-CN.json` ... 동일 구조로 추가.

### Step 4: 도구 컴포넌트 생성 (`components/tools/NewTool.tsx`)
```tsx
"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function NewTool() {
  const t = useTranslations("NewTool");
  // 로직 구현
}
```

### Step 5: 페이지 파일 생성 (`app/[locale]/developer/new-tool-slug/page.tsx`)
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
    <ToolLayout
      toolName={tTools("name")}
      toolSlug="new-tool-slug"
      categoryName={tCat("name")}
      categorySlug="developer"
      description={tTools("description")}
    >
      <NewTool />
    </ToolLayout>
  );
}
```

> ⚠️ **주의**: `toolSlug`는 영어 slug 고정. `toolName`은 번역된 값 전달.
> ⚠️ **주의**: Server Component(page.tsx)에서 Client Component로 **함수를 props로 전달하지 말 것**.

---

## 아키텍처 핵심 원칙

1. **모든 계산은 클라이언트 사이드** — 서버 API 없음, DB 없음
2. **SSG(Static Site Generation)** — 모든 페이지가 빌드 시 정적 HTML로 생성됨
3. **`"use client"` 디렉티브** — 상태(useState)가 있는 컴포넌트는 반드시 붙여야 함
4. **Server Component는 metadata만 export** — page.tsx는 Server Component 유지
5. **도구 컴포넌트는 ToolLayout으로 감쌈** — 광고/댓글/빵부스러기 자동 포함
6. **i18n Link 사용** — `next/link` 대신 `@/i18n/navigation`의 `Link` 사용
7. **번역 키 네이밍** — 도구 메타: `Tools.{slug}.name`, UI 문자열: `{ComponentName}.{key}`

---

## SEO 설정 현황

### 적용 완료
- **metadataBase**: `https://tools-shed.com`
- **hreflang**: 모든 도구 페이지에 12개 언어 alternate 태그 자동 삽입
- **html lang**: 언어별 동적 설정 (`<html lang="ja">` 등)
- **sitemap.xml**: `app/sitemap.ts` → 빌드 시 자동 생성 (12개 언어 × 전체 페이지) — **Google Search Console 제출 완료**
- **robots.txt**: `app/robots.ts`
- **JSON-LD 구조화 데이터**: `ToolLayout.tsx`에서 모든 도구 페이지에 `WebApplication` 스키마 자동 삽입
- **Favicon**: SVG data URI emoji 방식 (`🛠️`)
- **Breadcrumb**: `aria-label`, `aria-current` 접근성 마크업 적용
- **Google Search Console**: 등록 완료, sitemap 제출 완료
- **Google Analytics 4**: G-3N423K0N2Q (`@next/third-parties` 사용)
- **OG 이미지**: `app/opengraph-image.tsx` (홈 정적) + `app/[locale]/[category]/[tool]/opengraph-image.tsx` 예정

### 남은 SEO 과제
- **관련 도구 내부 링크**: 도구 페이지 하단에 같은 카테고리의 다른 도구 링크 추가
- **www → non-www 리다이렉트**: Vercel 대시보드에서 primary domain 설정 확인 권장

### SEO 원칙
- 새 page.tsx 작성 시 `metaTitle`은 60자 이내, `metaDescription`은 150자 이내로 작성
- 모든 `h1`은 페이지당 하나, 도구명과 일치시킬 것

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
npm run dev       # 로컬 개발 서버 (localhost:3000 → /en/ 리다이렉트)
npm run build     # 프로덕션 빌드
npm run lint      # ESLint 검사
vercel --prod     # 수동 프로덕션 배포
```

---

## TODO / 다음 작업

### 즉시 해야 할 것
- [x] 커스텀 도메인 연결 (`tools-shed.com` ✅)
- [x] Google Search Console 등록 + sitemap 제출 ✅
- [x] Google Analytics 4 설치 (G-3N423K0N2Q) ✅
- [x] Privacy Policy 페이지 추가 ✅
- [x] About 페이지 추가 ✅
- [x] SEO 개선 (metadataBase, JSON-LD, favicon, OG 이미지) ✅
- [x] **next-intl i18n 구현 — 12개 언어 지원** ✅
- [x] **sitemap 316개 항목 (12개 언어) — Google Search Console 재제출 완료** ✅
- [ ] Google AdSense 승인 신청 (도구 추가 2~4주 후)
- [ ] AdSense 승인 후 `ToolLayout.tsx`의 실제 slot ID 입력
- [ ] Giscus GitHub App 설치 확인 (https://github.com/apps/giscus)

### 추가 예정 도구
- [ ] Aspect Ratio Calculator
- [ ] Number to Words Converter
- [ ] Roman Numeral Converter
- [ ] Fraction Calculator
- [ ] Statistics Calculator (mean, median, mode, std dev)

### 검토 중
- [ ] 아랍어(`ar`) — RTL 레이아웃 추가 CSS 작업 필요

### Phase 3 (장기)
- [ ] Neon DB + Auth.js (즐겨찾기 저장 기능)

---

## 보안 주의사항

### GitHub Public 저장소여도 안전한 값들
| 값 | 위치 | 이유 |
|----|------|------|
| AdSense Publisher ID (`ca-pub-...`) | `AdSlot.tsx` | HTML 소스에 항상 노출됨 |
| GA 측정 ID (`G-3N423K0N2Q`) | `[locale]/layout.tsx` | 프론트엔드 식별자, 공개 정보 |
| Giscus Repo ID / Category ID | `GiscusComments.tsx` | giscus.app에서 누구나 조회 가능 |

### 절대로 코드에 직접 쓰면 안 되는 값들
Phase 3에서 DB/인증 추가 시 반드시 **Vercel 환경변수**로 관리:
```
DATABASE_URL=postgres://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://tools-shed.com
```

### 현재 이 프로젝트의 보안 위험도: **낮음**
서버/DB가 없는 순수 정적 사이트이므로 코드가 전부 공개되어도 악용 불가.

---

## 주요 파일 참조

| 파일 | 용도 |
|------|------|
| `lib/tools.ts` | **새 도구 추가 시 가장 먼저 수정** |
| `messages/en.json` | **번역 키 추가 시 먼저 수정 (source of truth, ~900+ 키)** |
| `i18n/routing.ts` | 언어 추가 시 수정 |
| `components/ToolLayout.tsx` | 모든 도구 페이지의 공통 래퍼 |
| `components/AdSlot.tsx` | 광고 슬롯 (slot ID 교체 필요) |
| `components/GiscusComments.tsx` | 댓글 설정 |
| `app/[locale]/layout.tsx` | 로케일 레이아웃 (AdSense 스크립트 포함) |
| `app/sitemap.ts` | 사이트맵 (언어 추가 시 LOCALES 배열 수정) |
| `proxy.ts` | next-intl 미들웨어 |
