#!/usr/bin/env bash
# Render blog images with Playwright's headless Chromium and convert them to WebP.
#
#   render.sh diagram <page.html> <out-dir> <frame-id>:<file-name> [...]
#       Each frame is a <section class="frame" id="..."> in a 1200x675 page shown
#       via :target. Output: <out-dir>/<file-name>.webp at 1600x900.
#
#   render.sh cover <source.png|jpg> <out-dir> <file-name> [saturation]
#       Center-crops a generated image to 16:9, mutes colours (default 0.72)
#       and writes <out-dir>/<file-name>.webp at 1600x900.
#
# PNG intermediates are kept next to the WebP files for review; delete them
# before copying finals anywhere. Every final passes through tools/get-low.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/../../../.." && pwd)"
GETLOW="$REPO/tools/get-low"
CHROME="$(find "$HOME/.cache/ms-playwright" -name chrome-headless-shell -type f 2>/dev/null | sort | tail -1)"
[ -x "$CHROME" ] || { echo "chrome-headless-shell not found; run: npx playwright install chromium-headless-shell" >&2; exit 1; }

shot() { # url out.png
  "$CHROME" --headless --no-sandbox --hide-scrollbars --force-device-scale-factor=1.3333333 \
    --window-size=1200,675 --virtual-time-budget=4000 --screenshot="$2" "$1" 2>/dev/null
}

mode="${1:-}"; shift || true
case "$mode" in
  diagram)
    page="$(realpath "$1")"; out="$(realpath -m "$2")"; shift 2; mkdir -p "$out"
    for pair in "$@"; do
      id="${pair%%:*}"; name="${pair#*:}"
      shot "file://$page#$id" "$out/$name.png"
      "$GETLOW" -to webp "$out/$name.png" | tail -1
    done ;;
  cover)
    src="$(realpath "$1")"; out="$(realpath -m "$2")"; name="$3"; sat="${4:-0.72}"; mkdir -p "$out"
    tmp="$(mktemp --suffix=.html)"
    cat > "$tmp" <<HTML
<!doctype html><html><head><style>html,body{margin:0;width:1200px;height:675px;overflow:hidden;background:#000}
img{width:1200px;height:675px;object-fit:cover;filter:saturate($sat)}</style></head>
<body><img src="file://$src"></body></html>
HTML
    shot "file://$tmp" "$out/$name.png"; rm -f "$tmp"
    "$GETLOW" -to webp "$out/$name.png" | tail -1 ;;
  *) sed -n '2,13p' "$0"; exit 1 ;;
esac
