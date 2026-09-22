#!/usr/bin/env bash
# px.sh <nodeId> <outName> — run parity-extract.js against one node id.
set -e
cd "$(dirname "$0")/../.."
{ echo "const TARGET = \"$1\";"; cat scripts/figma/parity-extract.js; } \
  | node scripts/figma/fig.mjs - --out "audit/raw/parity/$2.json"
