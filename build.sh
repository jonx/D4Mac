#!/usr/bin/env bash
# Assemble D4Mac.app bundle from Swift sources + wine-cx26.1 runtime.
#
# Layout produced:
#   build/D4Mac.app/Contents/
#     Info.plist
#     MacOS/D4Mac                          (Swift binary)
#     Resources/AppIcon.icns               (placeholder until icon exists)
#     Resources/Apple-GPTK-License.pdf     (if available)
#     SharedSupport/Wine/                  (copy of wine-cx26.1)
#
# Args:
#   --release    swift build -c release (slower, optimised)
#   --notarize   after build, codesign + notarize via stored credentials
#                (requires APPLE_DEV_ID + altool keychain profile already set)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
WINE_RUNTIME="$ROOT/wine-cx26.1"
BUILD="$SCRIPT_DIR/build"
APP="$BUILD/D4Mac.app"

CONFIG="debug"
NOTARIZE=0
for arg in "$@"; do
  case "$arg" in
    --release)  CONFIG="release" ;;
    --notarize) NOTARIZE=1; CONFIG="release" ;;
    -h|--help)  sed -n '1,20p' "$0"; exit 0 ;;
  esac
done

[ -d "$WINE_RUNTIME" ] || { echo "error: $WINE_RUNTIME missing" >&2; exit 1; }
[ -f "$WINE_RUNTIME/bin/wine" ] || { echo "error: wine binary missing in runtime" >&2; exit 1; }

echo "==> swift build ($CONFIG)"
cd "$SCRIPT_DIR"
swift build -c "$CONFIG"
BIN_PATH=$(swift build -c "$CONFIG" --show-bin-path)
SWIFT_BIN="$BIN_PATH/D4Mac"
[ -f "$SWIFT_BIN" ] || { echo "error: built binary missing at $SWIFT_BIN" >&2; exit 1; }

echo "==> assemble bundle at $APP"
rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources" "$APP/Contents/SharedSupport"

cp -p "$SCRIPT_DIR/Resources/Info.plist" "$APP/Contents/Info.plist"
cp -p "$SWIFT_BIN" "$APP/Contents/MacOS/D4Mac"

# Optional license artifacts (skipped silently if absent for now).
for f in "$SCRIPT_DIR/LICENSES/Apple-GPTK-License.pdf" \
         "$SCRIPT_DIR/Resources/AppIcon.icns"; do
  if [ -f "$f" ]; then cp -p "$f" "$APP/Contents/Resources/"; fi
done

# Bundled Windows prerequisites (run silently before any user installer).
PREREQ_SRC="$SCRIPT_DIR/Prereqs"
PREREQ_DST="$APP/Contents/Resources/Prereqs"
mkdir -p "$PREREQ_DST"
for f in vc_redist.x64.exe vc_redist.x86.exe; do
  if [ -f "$PREREQ_SRC/$f" ]; then
    cp -p "$PREREQ_SRC/$f" "$PREREQ_DST/$f"
    echo "bundled prereq: $f"
  else
    echo "warning: missing $PREREQ_SRC/$f — bottle setup will skip $f"
  fi
done

# Bundled fonts — copied as-is into bottle/drive_c/windows/Fonts at install
# time. Set mirrors what CrossOver ships in their BNet bottle: MS Core Fonts
# For The Web with the original Windows-expected filenames, plus Source Han
# Sans for CJK rendering. APFS clone keeps the build cheap.
FONTS_SRC="$SCRIPT_DIR/Resources/Fonts"
FONTS_DST="$APP/Contents/Resources/Fonts"
if [ -d "$FONTS_SRC" ]; then
  cp -cR "$FONTS_SRC" "$FONTS_DST"
  echo "bundled fonts ($(ls "$FONTS_DST" | wc -l | tr -d ' ') files, $(du -sh "$FONTS_DST" | awk '{print $1}'))"
else
  echo "warning: missing $FONTS_SRC — bottle setup will skip font deploy"
fi

echo "==> copy Wine runtime ($(du -sh "$WINE_RUNTIME" | awk '{print $1}'))"
# clone-on-write copy; on APFS this is instant + zero extra disk.
cp -cR "$WINE_RUNTIME" "$APP/Contents/SharedSupport/Wine"

# Make sure binaries are executable post-copy.
chmod +x "$APP/Contents/MacOS/D4Mac"
find "$APP/Contents/SharedSupport/Wine/bin" -type f -exec chmod +x {} +

# Ad-hoc sign so Gatekeeper allows local launch in debug.
echo "==> ad-hoc codesign"
codesign --force --deep --sign - "$APP" 2>&1 | head -5 || true

echo
echo "✓ built $APP"
echo "  size: $(du -sh "$APP" | awk '{print $1}')"
echo
echo "to launch:"
echo "  open '$APP'"
echo

if [ "$NOTARIZE" = "1" ]; then
  : "${APPLE_DEV_ID:?APPLE_DEV_ID env var must hold the Developer ID Application identity}"
  : "${APPLE_NOTARY_PROFILE:?APPLE_NOTARY_PROFILE must name a stored notarytool keychain profile}"

  echo "==> Developer ID codesign + notarize"
  codesign --force --deep --options runtime \
    --sign "$APPLE_DEV_ID" \
    --entitlements "$SCRIPT_DIR/Resources/D4Mac.entitlements" \
    "$APP"

  ZIP="$BUILD/D4Mac.zip"
  /usr/bin/ditto -c -k --keepParent "$APP" "$ZIP"
  xcrun notarytool submit "$ZIP" --keychain-profile "$APPLE_NOTARY_PROFILE" --wait
  xcrun stapler staple "$APP"
  echo "✓ notarized"
fi
