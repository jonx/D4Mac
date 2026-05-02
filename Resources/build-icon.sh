#!/usr/bin/env bash
# Render AppIcon.svg → AppIcon.icns at all macOS-required sizes.
#
# Requires `rsvg-convert` (from `brew install librsvg`) for SVG→PNG.
# Uses macOS-builtin `iconutil` for PNG→ICNS.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SVG="$SCRIPT_DIR/AppIcon.svg"
OUT="$SCRIPT_DIR/AppIcon.icns"
ICONSET="$(mktemp -d)/AppIcon.iconset"

[ -f "$SVG" ] || { echo "error: $SVG missing" >&2; exit 1; }
command -v rsvg-convert >/dev/null || { echo "error: rsvg-convert missing — run 'brew install librsvg'" >&2; exit 1; }

mkdir -p "$ICONSET"

# Apple's required iconset sizes (1x and @2x for each base size)
declare -a SIZES=(
  "16:icon_16x16.png"
  "32:icon_16x16@2x.png"
  "32:icon_32x32.png"
  "64:icon_32x32@2x.png"
  "128:icon_128x128.png"
  "256:icon_128x128@2x.png"
  "256:icon_256x256.png"
  "512:icon_256x256@2x.png"
  "512:icon_512x512.png"
  "1024:icon_512x512@2x.png"
)

for entry in "${SIZES[@]}"; do
  IFS=":" read -r size name <<< "$entry"
  rsvg-convert -w "$size" -h "$size" "$SVG" -o "$ICONSET/$name"
  echo "rendered $name (${size}x${size})"
done

iconutil -c icns "$ICONSET" -o "$OUT"
echo "✓ wrote $OUT ($(du -h "$OUT" | awk '{print $1}'))"
