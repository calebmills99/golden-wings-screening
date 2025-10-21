#!/usr/bin/env bash
# -------------------------------------------------------------
# Golden Wings Eleventy Deploy Script
# -------------------------------------------------------------
# Moves logo into src/images if needed,
# rebuilds the _site folder,
# commits, and pushes to main for auto-deploy on DigitalOcean.
# -------------------------------------------------------------

set -e  # Stop on first error

echo "🛫 Starting Golden Wings static site deployment..."

# 1️⃣ Ensure correct image path
if [ ! -f "src/images/gwnewlogosmall.png" ]; then
  echo "⚠️  gwnewlogosmall.png not found in src/images/"
  if [ -f "_site/images/gwnewlogosmall.png" ]; then
    echo "🔁 Moving from _site/images to src/images/"
    mkdir -p src/images
    mv _site/images/gwnewlogosmall.png src/images/
  else
    echo "❌ Logo missing entirely. Please add it to src/images/ before deploying."
    exit 1
  fi
else
  echo "✅ Logo already in src/images/"
fi

# 2️⃣ Clean previous build
echo "🧹 Cleaning old _site directory..."
rm -rf _site

# 3️⃣ Rebuild with Eleventy
echo "⚙️ Building site with Eleventy..."
npx @11ty/eleventy --output _site

# 4️⃣ Verify image output
if [ ! -f "_site/images/gwnewlogosmall.png" ]; then
  echo "❌ Build failed to copy image to _site/images/"
  exit 1
else
  echo "✅ Image successfully copied to _site/images/"
fi

# 5️⃣ Commit & push changes to trigger redeploy
echo "📦 Committing and pushing to main branch..."
git add -A
git commit -m "Rebuild and deploy Eleventy site with logo and passthrough assets" || echo "⚠️  No new changes to commit."
git push origin main

echo "🚀 Deployment pushed!"
echo "🌐 Once the build completes, visit https://gwingz.com to confirm the logo under the 'About the Film' section."
