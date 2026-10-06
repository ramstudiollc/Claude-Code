#!/usr/bin/env bash
# Rebuild everything in 08-demos. See 08-demos/README.md for requirements.
#   ENGINE=kokoro      (default) needs KOKORO_MODEL and KOKORO_VOICES
#   ENGINE=elevenlabs  needs ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID and access to api.elevenlabs.io
set -euo pipefail
cd "$(dirname "$0")/../.."
ENGINE=${ENGINE:-kokoro}
declare -A REELS=([D01-R2]=three-boxes [D16-R2]=four-part-prompt [D05-R1]=never-paste-into-ai)
declare -A IMAGES=([D01-I1]=automate-delegate-delete [D06-I2]=angry-customer-replies [D17-I1]=seller-day-before-after)
for id in "${!REELS[@]}"; do
  python3 tools/demo/make_vo.py "$id" --engine "$ENGINE" --out build/demo
  node tools/demo/render_reel.mjs "build/demo/$id" "08-demos/reels/$id-${REELS[$id]}.mp4"
done
node tools/demo/render_images.mjs build/demo/images "${!IMAGES[@]}"
for id in "${!IMAGES[@]}"; do cp "build/demo/images/$id.png" "08-demos/images/$id-${IMAGES[$id]}.png"; done
