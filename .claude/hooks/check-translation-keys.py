#!/usr/bin/env python3
"""
check-translation-keys.py

PostToolUse hook: After editing a components/tools/*.tsx file,
checks that every t("key") and tCommon("key") call has a matching
entry in messages/en.json.

This catches the "ComponentName.keyName" raw-string bug that occurred
with RandomNameGenerator and other components.
"""

import json
import re
import sys
import os

# Read hook input from stdin
try:
    input_data = json.load(sys.stdin)
except Exception:
    sys.exit(0)

file_path = input_data.get("tool_input", {}).get("file_path", "")

# Only process tool component files
if not re.search(r"/components/tools/[A-Z][^/]+\.tsx$", file_path):
    sys.exit(0)

if not os.path.exists(file_path):
    sys.exit(0)

project_dir = os.environ.get("CLAUDE_PROJECT_DIR", "")
en_json_path = os.path.join(project_dir, "messages", "en.json")

if not os.path.exists(en_json_path):
    sys.exit(0)

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

with open(en_json_path, "r", encoding="utf-8") as f:
    en = json.load(f)

component_name = os.path.basename(file_path).replace(".tsx", "")

# --- 1. Parse useTranslations calls ---
# Matches: const t = useTranslations("Namespace")
#          const tCommon = useTranslations("Common")
namespace_map = {}
for m in re.finditer(
    r'const\s+(\w+)\s*=\s*useTranslations\(["\']([^"\']+)["\']\)', content
):
    var_name = m.group(1)
    namespace = m.group(2)
    namespace_map[var_name] = namespace

if not namespace_map:
    sys.exit(0)

# --- 2. For each variable, find all t("key") calls ---
missing = []
for var_name, namespace in namespace_map.items():
    # Pattern: varName("key") — captures the first string argument
    pattern = rf'\b{re.escape(var_name)}\(["\']([^"\']+)["\']'
    keys = sorted(set(re.findall(pattern, content)))

    ns_data = en.get(namespace, {})
    for key in keys:
        if key not in ns_data:
            missing.append((namespace, key))

# --- 3. Report ---
if missing:
    print(f"\n⚠️  [{component_name}.tsx] 누락된 번역 키 감지!", flush=True)
    for ns, key in missing:
        print(f'  ✗ messages/en.json → ["{ns}"]["{key}"]', flush=True)
    print(
        f'\n이 키들은 UI에서 "{component_name}.keyName" 형태의 raw string으로 표시됩니다.',
        flush=True,
    )
    print(
        "messages/en.json에 해당 키를 추가하고, 나머지 11개 언어 파일도 업데이트하세요.\n",
        flush=True,
    )

sys.exit(0)
