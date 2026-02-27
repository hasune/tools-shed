#!/bin/bash
# tools-md-reminder.sh
# After editing lib/tools/*.ts, reminds Claude to update TOOLS.md.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only trigger on lib/tools/*.ts files (excluding types.ts and index.ts)
if [[ "$FILE_PATH" != *"/lib/tools/"* ]]; then
  exit 0
fi

BASENAME=$(basename "$FILE_PATH")
if [[ "$BASENAME" == "types.ts" ]] || [[ "$BASENAME" == "index.ts" ]]; then
  exit 0
fi

if [[ "$BASENAME" != *.ts ]]; then
  exit 0
fi

TOOLS_MD="$CLAUDE_PROJECT_DIR/TOOLS.md"
CURRENT_COUNT=$(grep -oE '총 \*\*[0-9]+개\*\*' "$TOOLS_MD" 2>/dev/null | grep -oE '[0-9]+' | head -1)

echo ""
echo "📋 lib/tools/$BASENAME 수정 감지"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TOOLS.md 업데이트가 필요합니다:"
echo "  1. 해당 카테고리 섹션에 새 도구 행 추가"
echo "  2. 카테고리 도구 수 업데이트 (## Category — N개)"
if [ -n "$CURRENT_COUNT" ]; then
  echo "  3. 총 도구 수 업데이트 (현재: $CURRENT_COUNT 개)"
fi
echo ""
exit 0
