#!/bin/bash

# Quick Setup Script for GitHub Actions Deployment
# This script helps you choose and configure the deployment method

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   Golden Wings Screening - GitHub Actions Setup               ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the repository root."
    exit 1
fi

echo "Choose your deployment method:"
echo ""
echo "1) Cloudflare Pages (Recommended)"
echo "   ✅ Global CDN, best performance"
echo "   ✅ Preview deployments for PRs"
echo "   ✅ Integrates with Cloudflare Worker"
echo "   ⚙️  Requires: API token setup"
echo ""
echo "2) GitHub Pages"
echo "   ✅ Simplest setup, no secrets needed"
echo "   ✅ Free SSL, custom domain support"
echo "   ✅ Directly from GitHub ecosystem"
echo "   ℹ️  Requires: GitHub Pages enabled in settings"
echo ""
echo "3) Both (Cloudflare for production, GitHub for staging)"
echo ""
echo "4) Just validate build (no deployment)"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Setting up Cloudflare Pages deployment..."
        echo ""
        echo "You'll need to add these secrets to your GitHub repository:"
        echo "  Settings → Secrets and variables → Actions → New repository secret"
        echo ""
        echo "  1. CLOUDFLARE_API_TOKEN"
        echo "     Get from: https://dash.cloudflare.com/profile/api-tokens"
        echo "     Permission: Cloudflare Pages — Edit"
        echo ""
        echo "  2. CLOUDFLARE_ACCOUNT_ID"
        echo "     Get from: Cloudflare Dashboard URL or Account Home"
        echo ""

        # Keep only Cloudflare workflow active
        if [ -f ".github/workflows/deploy-github-pages.yml" ]; then
            mv .github/workflows/deploy-github-pages.yml .github/workflows/deploy-github-pages.yml.disabled
            echo "✅ Disabled GitHub Pages workflow"
        fi

        echo ""
        echo "Next steps:"
        echo "1. Add the secrets mentioned above to GitHub"
        echo "2. Commit and push your changes"
        echo "3. Check the Actions tab to monitor deployment"
        echo "4. Configure gwingz.com custom domain in Cloudflare Pages"
        ;;

    2)
        echo ""
        echo "🚀 Setting up GitHub Pages deployment..."
        echo ""

        # Keep only GitHub Pages workflow active
        if [ -f ".github/workflows/deploy-cloudflare-pages.yml" ]; then
            mv .github/workflows/deploy-cloudflare-pages.yml .github/workflows/deploy-cloudflare-pages.yml.disabled
            echo "✅ Disabled Cloudflare Pages workflow"
        fi

        echo ""
        echo "Next steps:"
        echo "1. Go to Settings → Pages"
        echo "2. Source: Select 'GitHub Actions'"
        echo "3. (Optional) Add custom domain: gwingz.com"
        echo "4. Commit and push your changes"
        echo "5. Check the Actions tab to monitor deployment"
        ;;

    3)
        echo ""
        echo "🚀 Setting up both deployment methods..."
        echo ""
        echo "Cloudflare Pages setup (production - gwingz.com):"
        echo "  1. Add CLOUDFLARE_API_TOKEN secret to GitHub"
        echo "  2. Add CLOUDFLARE_ACCOUNT_ID secret to GitHub"
        echo "  3. Configure gwingz.com in Cloudflare Pages"
        echo ""
        echo "GitHub Pages setup (staging - beta.gwingz.com or GitHub domain):"
        echo "  1. Go to Settings → Pages"
        echo "  2. Source: Select 'GitHub Actions'"
        echo "  3. (Optional) Add custom domain: beta.gwingz.com"
        echo ""
        echo "Next steps:"
        echo "1. Complete both setups above"
        echo "2. Commit and push your changes"
        echo "3. Both workflows will run automatically"
        ;;

    4)
        echo ""
        echo "✅ Build validation is already set up!"
        echo ""

        # Disable deployment workflows
        if [ -f ".github/workflows/deploy-cloudflare-pages.yml" ]; then
            mv .github/workflows/deploy-cloudflare-pages.yml .github/workflows/deploy-cloudflare-pages.yml.disabled
            echo "✅ Disabled Cloudflare Pages workflow"
        fi

        if [ -f ".github/workflows/deploy-github-pages.yml" ]; then
            mv .github/workflows/deploy-github-pages.yml .github/workflows/deploy-github-pages.yml.disabled
            echo "✅ Disabled GitHub Pages workflow"
        fi

        echo ""
        echo "Only build validation will run on PRs and non-main branches."
        echo "To deploy manually, run: npm run build"
        ;;

    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "📝 Don't forget to:"
echo "   • Test locally first: npm install && npm run build"
echo "   • Review the workflow files in .github/workflows/"
echo "   • Read .github/workflows/README.md for detailed instructions"
echo ""
echo "✨ You're all set! Good luck with your deployment!"
echo ""
