#!/bin/bash
# completion-checklist.sh
# Stop hook: Scans for recently modified files and verifies that
# the tool-addition checklist is complete.

LOCALE_DIR="$CLAUDE_PROJECT_DIR/app/[locale]"
MESSAGES_DIR="$CLAUDE_PROJECT_DIR/messages"
TOOLS_MD="$CLAUDE_PROJECT_DIR/TOOLS.md"
COMPONENTS_DIR="$CLAUDE_PROJECT_DIR/components/tools"
LIB_TOOLS_DIR="$CLAUDE_PROJECT_DIR/lib/tools"

LOCALES=("en" "ja" "ko" "zh-CN" "es" "pt-BR" "fr" "de" "ru" "it" "tr" "id")
ISSUES=()

# --- Check 1: Each tool in lib/tools/*.ts has a corresponding page.tsx ---
for ts_file in "$LIB_TOOLS_DIR"/*.ts; do
  basename_ts=$(basename "$ts_file" .ts)
  [[ "$basename_ts" == "types" || "$basename_ts" == "index" ]] && continue

  # Map ts file to category slug
  case "$basename_ts" in
    developer) category="developer" ;;
    converters) category="converters" ;;
    text) category="text" ;;
    finance) category="finance" ;;
    health) category="health" ;;
    time) category="time" ;;
    math) category="math" ;;
    *) continue ;;
  esac

  # Extract slugs from the ts file
  slugs=$(grep -oE '"slug":\s*"([^"]+)"' "$ts_file" | grep -oE '"[^"]+"$' | tr -d '"')

  for slug in $slugs; do
    page_path="$LOCALE_DIR/$category/$slug/page.tsx"
    if [ ! -f "$page_path" ]; then
      ISSUES+=("❌ page.tsx 없음: app/[locale]/$category/$slug/page.tsx")
    fi
  done
done

# --- Check 2: Each tool component has its namespace in en.json ---
if [ -f "$MESSAGES_DIR/en.json" ]; then
  for component_file in "$COMPONENTS_DIR"/*.tsx; do
    component_name=$(basename "$component_file" .tsx)
    # Check if namespace exists in en.json
    has_namespace=$(python3 -c "
import json, sys
try:
  with open('$MESSAGES_DIR/en.json') as f:
    data = json.load(f)
  print('yes' if '$component_name' in data else 'no')
except:
  print('skip')
" 2>/dev/null)
    if [ "$has_namespace" = "no" ]; then
      ISSUES+=("⚠️  en.json에 네임스페이스 없음: $component_name")
    fi
  done
fi

# --- Check 3: en.json has Tools.{slug} for each slug in lib/tools ---
if [ -f "$MESSAGES_DIR/en.json" ]; then
  for ts_file in "$LIB_TOOLS_DIR"/*.ts; do
    basename_ts=$(basename "$ts_file" .ts)
    [[ "$basename_ts" == "types" || "$basename_ts" == "index" ]] && continue

    slugs=$(grep -oE 'slug: "[^"]+"' "$ts_file" | grep -oE '"[^"]+"' | tr -d '"')
    for slug in $slugs; do
      has_meta=$(python3 -c "
import json
try:
  with open('$MESSAGES_DIR/en.json') as f:
    data = json.load(f)
  print('yes' if '$slug' in data.get('Tools', {}) else 'no')
except:
  print('skip')
" 2>/dev/null)
      if [ "$has_meta" = "no" ]; then
        ISSUES+=("⚠️  en.json Tools 섹션에 없음: \"$slug\"")
      fi
    done
  done
fi

# --- Check 4: TOOLS.md tool count matches actual slugs ---
ACTUAL_COUNT=0
for ts_file in "$LIB_TOOLS_DIR"/*.ts; do
  basename_ts=$(basename "$ts_file" .ts)
  [[ "$basename_ts" == "types" || "$basename_ts" == "index" ]] && continue
  count=$(grep -c 'slug:' "$ts_file" 2>/dev/null)
  count=$(echo "$count" | tr -d '[:space:]')
  if [[ "$count" =~ ^[0-9]+$ ]]; then
    ACTUAL_COUNT=$((ACTUAL_COUNT + count))
  fi
done

DOCUMENTED_COUNT=$(grep -oE '총 \*\*[0-9]+개\*\*' "$TOOLS_MD" 2>/dev/null | grep -oE '[0-9]+' | head -1)
if [ -n "$DOCUMENTED_COUNT" ] && [ "$ACTUAL_COUNT" -ne "$DOCUMENTED_COUNT" ]; then
  ISSUES+=("📋 TOOLS.md 도구 수 불일치: 실제 ${ACTUAL_COUNT}개, 문서 ${DOCUMENTED_COUNT}개")
fi

# --- Output ---
if [ ${#ISSUES[@]} -eq 0 ]; then
  echo ""
  echo "✅ 체크리스트 통과: 모든 도구 파일이 올바르게 구성되었습니다. (총 ${ACTUAL_COUNT}개)"
  echo ""
else
  echo ""
  echo "⚠️  완료 체크리스트에서 문제를 발견했습니다:"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  for issue in "${ISSUES[@]}"; do
    echo "  $issue"
  done
  echo ""
  echo "응답을 마치기 전에 위 항목들을 확인해주세요."
  echo ""
fi

exit 0
