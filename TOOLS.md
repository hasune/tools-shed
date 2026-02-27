# ToolsShed — 도구 인벤토리

> **이 파일은 현재 구현된 모든 도구의 공식 목록입니다.**
> - 새 도구를 추가하기 전에 **반드시 이 파일을 확인**해 중복을 방지할 것
> - 도구 추가/삭제 시 이 파일을 함께 업데이트할 것
> - 총 **155개** 도구 (2026-02-27 기준)

---

## Developer Tools (`/developer`) — 42개

| slug | 도구명 | 비고 |
|------|--------|------|
| `json-formatter` | JSON Formatter | 포맷/검증/최소화, 들여쓰기 옵션 |
| `uuid-generator` | UUID Generator | v4 UUID, bulk 생성 지원 |
| `base64` | Base64 Encoder / Decoder | Unicode 지원 |
| `url-encoder` | URL Encoder / Decoder | encodeURIComponent / encodeURI |
| `hash-generator` | Hash Generator | MD5, SHA-256, SHA-512 |
| `jwt-decoder` | JWT Decoder | 페이로드 디코딩 (서명 검증 없음) |
| `jwt-generator` | JWT Generator | HS256 서명 생성 (SubtleCrypto) |
| `color-converter` | Color Converter | HEX↔RGB↔HSL, 컬러 피커 |
| `color-palette` | Color Palette Generator | 보색/유사색/삼각색/단색 팔레트 |
| `color-gradient-generator` | CSS Gradient Generator | linear/radial 그래디언트 시각 편집 |
| `number-base-converter` | Number Base Converter | 2/8/10/16진수 실시간 변환 |
| `regex-tester` | RegEx Tester | 라이브 매치 하이라이팅, 플래그 토글 |
| `csv-json` | CSV ↔ JSON Converter | 구분자 옵션, 헤더 행 토글 |
| `diff-checker` | Diff Checker | LCS 알고리즘 기반 줄별 비교 |
| `lorem-ipsum` | Lorem Ipsum Generator | 단락/문장/단어 생성 |
| `html-encoder` | HTML Encoder / Decoder | HTML 엔티티 인코딩/디코딩 |
| `yaml-json` | YAML ↔ JSON Converter | js-yaml 라이브러리 사용 |
| `xml-formatter` | XML Formatter | 포맷/검증/최소화, DOMParser 사용 |
| `cron-parser` | Cron Expression Parser | Cron 설명 + 다음 5회 실행 시각 |
| `json-to-typescript` | JSON to TypeScript | JSON → TypeScript 인터페이스 자동 생성 |
| `sql-formatter` | SQL Formatter | 키워드 대소문자/들여쓰기 정리 |
| `string-escape` | String Escape / Unescape | JSON/JS/HTML 이스케이프 |
| `favicon-generator` | Favicon Generator | 텍스트/이모지/이니셜 → PNG |
| `http-status-codes` | HTTP Status Code Reference | 코드 검색/설명/카테고리 |
| `markdown-table-generator` | Markdown Table Generator | 시각적 테이블 빌더 |
| `image-base64` | Image to Base64 | 이미지 → Base64 Data URL |
| `css-unit-converter` | CSS Unit Converter | px/em/rem/vw/vh/pt/cm 상호 변환 |
| `chmod-calculator` | Chmod Calculator | 8진수 ↔ rwx 심볼릭 퍼미션 |
| `number-to-words` | Number to Words | 숫자 → 영어 표기 |
| `qr-code-generator` | QR Code Generator | 텍스트/URL → QR 코드 |
| `aspect-ratio-calculator` | Aspect Ratio Calculator | 비율 계산 + 치수 스케일링 |
| `morse-code-converter` | Morse Code Converter | 텍스트 ↔ 모스 부호 |
| `ip-subnet-calculator` | IP Subnet Calculator | CIDR 서브넷 마스크/네트워크/호스트 범위 |
| `ascii-art` | ASCII Art Generator | FIGlet 스타일 블록 폰트 |
| `cipher-tool` | Cipher Tool | Caesar/ROT13/Vigenère 암호화·복호화 |
| `mime-type-lookup` | MIME Type Lookup | 확장자↔MIME 타입 조회, 약 70개 항목 |
| `color-blindness-simulator` | Color Blindness Simulator | Canvas API 기반, 5가지 색각 이상 시뮬레이션 |
| `json-diff` | JSON Diff | flat key 기반 추가/삭제/변경 비교 |
| `number-formatter` | Number Formatter | Intl.NumberFormat, 통화/백분율/지수 |
| `markdown-to-html` | Markdown to HTML | Markdown 소스 → HTML 코드 변환 |
| `css-minifier` | CSS Minifier / Beautifier | CSS 압축 및 정렬 |
| `color-name-lookup` | Color Name Lookup | HEX/RGB → CSS 색상 이름 검색, 140개 |

---

## Unit Converters (`/converters`) — 22개

> `length`, `weight`, `data-storage`, `speed`, `area`, `volume`, `angle`, `pressure`, `fuel-efficiency`, `energy`, `power`, `cooking`, `time-unit`은 `UnitConverter.tsx` 공유 컴포넌트 사용

| slug | 도구명 | 단위 수 |
|------|--------|---------|
| `length-converter` | Length Converter | 9개 단위 |
| `weight-converter` | Weight Converter | 8개 단위 |
| `temperature-converter` | Temperature Converter | °C, °F, K (전용 컴포넌트) |
| `data-storage-converter` | Data Storage Converter | Byte~PB, KiB~TiB |
| `speed-converter` | Speed Converter | m/s, km/h, mph, knot, ft/s, Mach |
| `area-converter` | Area Converter | m², km², mi², 에이커, 헥타르 등 |
| `volume-converter` | Volume Converter | L, mL, m³, 갤런, 파인트 등 |
| `angle-converter` | Angle Converter | 도/라디안/그라디안/밀리라디안 |
| `pressure-converter` | Pressure Converter | Pa, bar, PSI, atm, mmHg, kPa |
| `fuel-efficiency-converter` | Fuel Efficiency Converter | km/L, mpg(US/UK), L/100km |
| `energy-converter` | Energy Converter | J, cal, kcal, kWh, BTU, eV |
| `power-converter` | Power Converter | W, kW, MW, hp, BTU/hr |
| `cooking-converter` | Cooking Unit Converter | 컵/tbsp/tsp/mL/g/oz |
| `time-unit-converter` | Time Unit Converter | 초/분/시/일/주/월/년 |
| `torque-converter` | Torque Converter | N·m, ft·lb, kgf·m, dyn·cm 등 |
| `illuminance-converter` | Illuminance Converter | lux, foot-candle, phot, nox |
| `frequency-converter` | Frequency Converter | Hz, kHz, MHz, GHz, THz, RPM |
| `shoe-size-converter` | Shoe Size Converter | US Men/Women, EU, UK, Japan(cm) |
| `pace-converter` | Pace Converter | min/km, min/mile, km/h, mph 상호 변환 |
| `clothing-size-converter` | Clothing Size Converter | US/EU/UK/JP, 상의·하의·드레스 |
| `data-transfer-speed` | Data Transfer Speed Converter | Mbps/MB/s/Gbps/KB/s 등 9개 단위 |
| `pixel-density-converter` | Pixel Density Calculator | PPI/DPI, 화면 해상도+물리 크기 입력 |

---

## Text Tools (`/text`) — 23개

| slug | 도구명 | 비고 |
|------|--------|------|
| `word-counter` | Word & Character Counter | 단어/글자/문장/단락/읽기 시간 |
| `case-converter` | Case Converter | 8가지 케이스 변환 |
| `password-generator` | Password Generator | 길이/문자셋 옵션, 강도 표시 |
| `markdown-preview` | Markdown Preview | 커스텀 정규식 파서 (외부 deps 없음) |
| `slug-generator` | Slug Generator | NFD 악센트 정규화 |
| `text-repeater` | Text Repeater | 구분자 옵션 |
| `text-to-binary` | Text to Binary / Hex | 양방향, Binary/Hex/Octal/Decimal |
| `random-name-generator` | Random Name Generator | 성별/유형 옵션 |
| `text-to-speech` | Text to Speech | 브라우저 Web Speech API |
| `speech-to-text` | Speech to Text | 브라우저 SpeechRecognition API |
| `word-frequency-counter` | Word Frequency Counter | 빈도 순 정렬 |
| `find-replace` | Find & Replace | plain text / regex 모드 |
| `text-cleaner` | Text Cleaner | 공백/빈줄/특수문자/HTML 제거 |
| `text-sorter` | Text Sorter | 알파벳/길이/랜덤 정렬 |
| `emoji-picker` | Emoji Picker | 카테고리 탐색 + 검색 + 복사 |
| `line-deduplicator` | Line Deduplicator | 대소문자 구분 옵션 |
| `anagram-solver` | Anagram Solver | 두 단어/구문 비교 |
| `palindrome-checker` | Palindrome Checker | 단어/구문/숫자 |
| `text-statistics` | Text Readability Analyzer | Flesch/Flesch-Kincaid/Gunning Fog |
| `nato-alphabet` | NATO Phonetic Alphabet | 텍스트 → NATO 음성 알파벳 변환 |
| `unicode-inspector` | Unicode Inspector | 코드 포인트/이름/카테고리/HTML 엔티티 |
| `word-wrap` | Word Wrap | 지정 열 너비 줄 바꿈, 단어/문자 구분 |
| `text-truncator` | Text Truncator | 글자수/단어수 자르기, 말줄임표 커스텀 |

---

## Finance Tools (`/finance`) — 19개

| slug | 도구명 | 비고 |
|------|--------|------|
| `compound-interest` | Compound Interest Calculator | 일/월/분기/연 복리 |
| `percentage-calculator` | Percentage Calculator | 4가지 계산 모드 |
| `discount-calculator` | Discount Calculator | 할인가/절약액 |
| `loan-calculator` | Loan Calculator | 월납입금 + 상환 일정표 |
| `roi-calculator` | ROI Calculator | 수익률 + 연환산 ROI |
| `tip-calculator` | Tip Calculator | 인원별 분할 |
| `savings-goal-calculator` | Savings Goal Calculator | 목표 달성 월 저축액 |
| `inflation-calculator` | Inflation Calculator | 실질 구매력 계산 |
| `break-even-calculator` | Break-Even Calculator | 고정비/변동비/매출 |
| `vat-calculator` | VAT Calculator | 세금 포함/제외 가격, 커스텀 세율 |
| `currency-converter` | Currency Converter | 주요 통화 기준 환율 (정적) |
| `net-worth-calculator` | Net Worth Calculator | 자산/부채 목록 입력 |
| `hourly-to-salary` | Hourly to Salary Converter | 시급 ↔ 연/월/주 급여 양방향 |
| `tax-bracket-calculator` | Tax Bracket Calculator | 2024 미국 연방 소득세 (4가지 신고 유형) |
| `stock-profit-calculator` | Stock Profit Calculator | 매수/매도/수수료 → 수익/ROI |
| `fire-calculator` | FIRE Calculator | 4% 룰, FIRE 목표액 + 달성 연수 |
| `dividend-calculator` | Dividend Calculator | 배당수익률/연간·월간·분기 소득 |
| `currency-formatter` | Currency Formatter | Intl.NumberFormat, 28개 통화, 12개 로케일 |
| `budget-calculator` | Budget Calculator (50/30/20) | 50/30/20 규칙, 월/년 자동 분할 |

---

## Health Tools (`/health`) — 18개

| slug | 도구명 | 비고 |
|------|--------|------|
| `bmi-calculator` | BMI Calculator | metric/imperial |
| `tdee-calculator` | TDEE Calculator | Mifflin-St Jeor BMR, 5가지 활동 레벨 |
| `ideal-weight` | Ideal Weight Calculator | Robinson/Miller/Devine/Hamwi 4공식 |
| `body-fat` | Body Fat Calculator | U.S. Navy 방법 |
| `running-pace` | Running Pace Calculator | 페이스/시간/거리 3가지 모드 |
| `water-intake` | Water Intake Calculator | 체중 × 활동량 × 기후 |
| `calorie-burn-calculator` | Calorie Burn Calculator | MET 방식, 30+ 운동 종목 |
| `heart-rate-zone` | Heart Rate Zone Calculator | Karvonen 공식, 5개 훈련 존 |
| `sleep-cycle-calculator` | Sleep Cycle Calculator | 90분 수면 사이클 기반 |
| `protein-calculator` | Protein Intake Calculator | 체중 × 목표 × 활동량 |
| `blood-pressure-checker` | Blood Pressure Checker | AHA 기준 카테고리 분류 |
| `macro-calculator` | Macro Calculator | 식단 프리셋 (balanced/low-carb/keto 등) |
| `menstrual-cycle-calculator` | Menstrual Cycle Calculator | 다음 4사이클 예측, 가임 기간 |
| `due-date-calculator` | Pregnancy Due Date Calculator | Naegele's rule, 삼분기·마일스톤 |
| `one-rep-max-calculator` | One Rep Max Calculator | Epley/Brzycki/Lander/Lombardi 4공식 |
| `waist-to-hip-ratio` | Waist-to-Hip Ratio Calculator | WHO 기준 4단계 위험도 분류 |
| `vo2max-calculator` | VO2 Max Calculator | Cooper 12분 / Rockport 걷기 테스트 |
| `smoking-cost-calculator` | Smoking Cost Calculator | 일/월/년 비용 + 금연 절약 효과 |

---

## Time Tools (`/time`) — 12개

| slug | 도구명 | 비고 |
|------|--------|------|
| `age-calculator` | Age Calculator | 년/월/일 정확한 나이 |
| `timezone-converter` | Timezone Converter | 15개 주요 도시 |
| `unix-timestamp` | Unix Timestamp Converter | 라이브 틱, ms/s 자동 감지 |
| `date-difference` | Date Difference Calculator | 총 일수, 근무일, 주/월/년 |
| `time-duration` | Time Duration Calculator | HH:MM:SS 더하기/빼기 |
| `pomodoro-timer` | Pomodoro Timer | 25분 집중 + 5/15분 휴식 |
| `working-hours-calculator` | Working Hours Calculator | 출퇴근 시간 + 휴식 공제 |
| `countdown-timer` | Countdown Timer | 미래 날짜/시간 카운트다운 |
| `meeting-planner` | Meeting Time Zone Planner | 다중 시간대 동시 표시 |
| `year-progress` | Year Progress | 올해 경과/잔여 비율 |
| `date-calculator` | Date Calculator | 날짜 ± 일/주/월/년, 요일 + 오늘 기준 일수 |
| `business-days-calculator` | Business Days Calculator | 두 날짜 사이 영업일 수 (주말 제외) |

---

## Math Tools (`/math`) — 19개

| slug | 도구명 | 비고 |
|------|--------|------|
| `scientific-calculator` | Scientific Calculator | sin/cos/tan/log/sqrt/π/e, DEG/RAD, 기록 |
| `gcd-lcm` | GCD & LCM Calculator | 유클리드 알고리즘, 단계별 풀이 |
| `quadratic-solver` | Quadratic Equation Solver | 실수/복소수 근, 꼭짓점, 단계별 풀이 |
| `statistics-calculator` | Statistics Calculator | 평균/중앙값/최빈값/표준편차/분산 |
| `fraction-calculator` | Fraction Calculator | 사칙연산 + 단계별 풀이 |
| `roman-numeral-converter` | Roman Numeral Converter | 아라비아 ↔ 로마 숫자 |
| `triangle-calculator` | Triangle Calculator | SSS/SAS/ASA/AAS 해법, 넓이/둘레 |
| `prime-checker` | Prime Number Checker | 소수 판별 + 에라토스테네스 체 |
| `combinations-permutations` | Combinations & Permutations | nCr/nPr, 팩토리얼, 단계별 풀이 |
| `prime-factorizer` | Prime Checker & Factorizer | 소수 판별 + 소인수분해 |
| `matrix-calculator` | Matrix Calculator | 2×2/3×3 행렬 덧셈/곱셈/전치/행렬식 |
| `number-sequence` | Number Sequence Generator | 등차/등비/피보나치/소수 수열 |
| `proportion-solver` | Proportion Solver | a/b = c/d 비례식 미지수 풀기 |
| `unit-price-calculator` | Unit Price Calculator | 단위 가격 비교 (최선 구매 선택) |
| `log-calculator` | Logarithm Calculator | 자연로그/상용로그/임의 밑 |
| `binary-calculator` | Binary Calculator | 산술/비트 연산 (AND/OR/XOR/NOT/SHIFT) |
| `vector-calculator` | Vector Calculator | 2D/3D 벡터 연산, 내적/외적/크기/각도 |
| `geometry-calculator` | Geometry Calculator | 9개 도형 면적/둘레/부피 (2D·3D) |
| `ohm-law-calculator` | Ohm's Law Calculator | V/I/R/P 중 2값 입력 → 나머지 계산 |

---

## 새 도구 추가 시 체크리스트

1. 이 파일에서 유사 도구가 있는지 확인 (중복 방지)
2. `lib/tools/{category}.ts`에 메타데이터 추가
3. `messages/en.json`에 번역 키 추가 (`Tools.{slug}` + `{ComponentName}` 네임스페이스)
4. 나머지 11개 언어 파일에 번역 추가
5. `components/tools/{ComponentName}.tsx` 컴포넌트 생성
6. `app/[locale]/{category}/{slug}/page.tsx` 페이지 생성
7. **이 파일(TOOLS.md) 업데이트** ← 잊지 말 것
