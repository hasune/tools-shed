#!/bin/bash
# translation-reminder.sh
# After editing messages/en.json, reminds Claude to update all 11 other locale files.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only trigger on messages/en.json
if [[ "$(basename "$FILE_PATH")" != "en.json" ]]; then
  exit 0
fi

if [[ "$FILE_PATH" != *"/messages/"* ]]; then
  exit 0
fi

LOCALES=("ja" "ko" "zh-CN" "es" "pt-BR" "fr" "de" "ru" "it" "tr" "id")
MESSAGES_DIR="$CLAUDE_PROJECT_DIR/messages"

MISSING_LOCALES=()
for locale in "${LOCALES[@]}"; do
  if [ ! -f "$MESSAGES_DIR/$locale.json" ]; then
    MISSING_LOCALES+=("$locale")
  fi
done

echo ""
echo "🌍 messages/en.json 수정 감지"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "나머지 11개 언어 파일에도 동일한 키를 추가해야 합니다:"
echo "  ja, ko, zh-CN, es, pt-BR, fr, de, ru, it, tr, id"
echo ""
echo "💡 권장 방법: Python 스크립트로 일괄 업데이트"
echo '  python3 -c "import json; ..." 또는 개별 파일 수정'

if [ ${#MISSING_LOCALES[@]} -gt 0 ]; then
  echo ""
  echo "⚠️  다음 언어 파일이 없습니다: ${MISSING_LOCALES[*]}"
fi

echo ""
exit 0
