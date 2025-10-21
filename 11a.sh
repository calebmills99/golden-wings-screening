#!/usr/bin/env bash
# -------------------------------------------------------------
# Golden Wings Screening | Auto-fix assets + Deploy Script
# -------------------------------------------------------------
# Ensures logo path correctness, rebuilds with Eleventy,
# verifies logo appears in the correct output, then commits
# and pushes for DigitalOcean auto-deploy.
# -------------------------------------------------------------

set -euo pipefail

echo "🛫 Starting Golden Wings deploy sequence..."

# 1️⃣ Check for logo in correct folder
if [ ! -f "src/assets/gwnewlogosmall.png" ]; then
  echo "⚠️  Logo not found in src/assets/, checking fallback paths..."
  mkdir -p src/assets

  if [ -f "src/images/gwnewlogosmall.png" ]; then
    mv src/images/gwnewlogosmall.png src/assets/
    echo "✅ Moved logo from src/images/ to src/assets/"
  elif [ -f "_site/images/gwnewlogosmall.png" ]; then
    mv _site/images/gwnewlogosmall.png src/assets/
    echo "✅ Moved logo from _site/images/ to src/assets/"
  else
    echo "❌ Logo not found anywhere (src/images or _site/images)."
    echo "Please add gwnewlogosmall.png to src/assets/ before deploying."
    exit 1
  fi
else
  echo "✅ Logo already in src/assets/"
fi

# 2️⃣ Verify .eleventy.js passthroughs
if ! grep -q 'src/assets' .eleventy.js; then
  echo "🛠  Adding src/assets passthrough to .eleventy.js..."
  sed -i.bak '/addPassthroughCopy/ i\
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });' .eleventy.js
fi

# 3️⃣ Clean old build
echo "🧹 Cleaning old build directory..."
rm -rf _site

# 4️⃣ Build with Eleventy
echo "⚙️ Rebuilding site..."
npx @11ty/eleventy --output _site

# 5️⃣ Verify logo in _site/assets
if [ -f "_site/assets/gwnewlogosmall.png" ]; then
  echo "✅ Logo successfully copied to _site/assets/"
else
  echo "❌ Build completed but logo missing from _site/assets/. Check passthrough config."
  exit 1
fi

# 6️⃣ Git commit + push
echo "📦 Committing and pushing changes..."
git add -A
git commit -m "Fix logo path and redeploy (auto script)" || echo "⚠️ No new changes to commit."
git push origin main

# 7️⃣ Wrap up
echo "🚀 Deployment triggered!"
echo "🌐 Visit https://gwingz.com/assets/gwnewlogosmall.png to verify logo visibility."
echo "💫 Done!"
