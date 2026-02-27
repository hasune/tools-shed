#!/bin/bash
# protect-files.sh
# Blocks Claude from editing files that should never be modified.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Normalize to relative path for matching
RELATIVE=$(echo "$FILE_PATH" | sed "s|$CLAUDE_PROJECT_DIR/||")

BLOCKED_EXACT=(
  "package-lock.json"
  "next-env.d.ts"
)

BLOCKED_PATTERNS=(
  ".env"
  ".env.local"
  ".env.production"
  ".git/"
)

# Exact filename matches
for name in "${BLOCKED_EXACT[@]}"; do
  if [[ "$(basename "$FILE_PATH")" == "$name" ]]; then
    echo "🔒 보호된 파일: $RELATIVE" >&2
    echo "이 파일은 직접 수정하면 안 됩니다. 다른 방법을 사용하세요." >&2
    exit 2
  fi
done

# Pattern matches
for pattern in "${BLOCKED_PATTERNS[@]}"; do
  if [[ "$RELATIVE" == *"$pattern"* ]]; then
    echo "🔒 보호된 파일: $RELATIVE" >&2
    echo "환경 변수 파일과 .git 디렉터리는 수정할 수 없습니다." >&2
    exit 2
  fi
done

exit 0
