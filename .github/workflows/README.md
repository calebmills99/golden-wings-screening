# GitHub Actions Deployment Workflows

This repository includes automated CI/CD workflows to build and deploy the Golden Wings screening website.

## Available Workflows

### 1. Deploy to Cloudflare Pages (Recommended)
**File**: `.github/workflows/deploy-cloudflare-pages.yml`

**Purpose**: Automatically builds and deploys the site to Cloudflare Pages on every push to `main`.

**Triggers**:
- Push to `main` branch
- Pull requests to `main` (preview deployments)
- Manual trigger via workflow_dispatch

**Setup Required**:
1. Go to your Cloudflare dashboard
2. Navigate to Account → API Tokens
3. Create API token with "Cloudflare Pages — Edit" permissions
4. Add the following secrets to your GitHub repository (Settings → Secrets → Actions):
   - `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token
   - `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare Account ID (found in dashboard URL)

**Features**:
- Automatic builds on push
- Preview deployments for PRs
- Uploads build artifacts for debugging
- Custom domain support (gwingz.com)

**Deployment URL**:
- Production: `https://gwingz.com` (after custom domain setup)
- Preview: `https://gwingz-screening.pages.dev`

---

### 2. Deploy to GitHub Pages
**File**: `.github/workflows/deploy-github-pages.yml`

**Purpose**: Builds and deploys the site to GitHub Pages from the `/docs` directory.

**Triggers**:
- Push to `main` branch
- Manual trigger via workflow_dispatch

**Setup Required**:
1. Go to repository Settings → Pages
2. Source: "GitHub Actions" (not "Deploy from a branch")
3. Custom domain: Enter `gwingz.com` (optional)
4. Enforce HTTPS: Enable

**DNS Configuration** (if using custom domain):
Add these DNS records in your domain registrar or Cloudflare DNS:
```
Type    Name    Value
CNAME   www     gwingz-studio.github.io
A       @       185.199.108.153
A       @       185.199.109.153
A       @       185.199.110.153
A       @       185.199.111.153
```

**Features**:
- Automatic builds and commits to `/docs`
- Custom domain support
- Free SSL certificate
- Commit skips CI to avoid loops `[skip ci]`

**Deployment URL**:
- Default: `https://gwingz-studio.github.io/gwingz-screening/`
- Custom domain: `https://gwingz.com`

---

### 3. Build Validation
**File**: `.github/workflows/build-validation.yml`

**Purpose**: Validates that the site builds correctly without deploying.

**Triggers**:
- Pull requests to `main`
- Pushes to non-main branches

**No Setup Required** - Works out of the box!

**Features**:
- Runs build process
- Verifies required files exist
- Basic HTML validation
- Uploads artifacts for review
- Fast feedback on PRs

---

## Which Workflow Should You Use?

### Use Cloudflare Pages if:
✅ You want the best performance (global CDN)
✅ You're already using Cloudflare Workers/Stream
✅ You want preview deployments for PRs
✅ You need serverless functions at the edge

### Use GitHub Pages if:
✅ You want the simplest setup
✅ You prefer everything in one ecosystem
✅ You don't need preview deployments
✅ You want built files committed to Git

### Use Both?
You can enable both! Just use different custom domains or subdomains:
- `gwingz.com` → Cloudflare Pages (production)
- `beta.gwingz.com` → GitHub Pages (staging)

---

## Build Process

All workflows run the same build steps:

```bash
npm ci                    # Install dependencies (clean install)
npm run build:css        # Build Tailwind CSS
npm run build:11ty       # Build Eleventy site
echo "gwingz.com" > docs/CNAME  # Add custom domain
```

**Build outputs to**: `/docs/` directory

**Build includes**:
- Compiled HTML from Nunjucks templates
- Minified Tailwind CSS
- Static assets (images, videos)
- CNAME file for custom domain

---

## Manual Deployment

You can manually trigger any deployment workflow:

1. Go to **Actions** tab in GitHub
2. Select the workflow (e.g., "Deploy to Cloudflare Pages")
3. Click "Run workflow"
4. Select branch (usually `main`)
5. Click "Run workflow" button

---

## Secrets Configuration

### Required for Cloudflare Pages Deployment

Add these in **Settings → Secrets and variables → Actions → New repository secret**:

| Secret Name | Description | Where to Find |
|------------|-------------|---------------|
| `CLOUDFLARE_API_TOKEN` | API token with Pages edit permission | Cloudflare Dashboard → Profile → API Tokens |
| `CLOUDFLARE_ACCOUNT_ID` | Your account identifier | Cloudflare Dashboard URL or Account Home |

### Auto-provided by GitHub

These secrets are automatically available (no setup needed):
- `GITHUB_TOKEN` - For GitHub API access

---

## Troubleshooting

### Build fails with "npm ERR! missing script"
**Solution**: Make sure `package.json` has all required scripts:
```json
{
  "scripts": {
    "build:css": "npx tailwindcss -i ./src/css/styles.css -o ./docs/css/styles.css --minify",
    "build:11ty": "eleventy"
  }
}
```

### Cloudflare Pages deployment fails
**Check**:
1. Are secrets set correctly? (Check Settings → Secrets)
2. Is the API token still valid?
3. Does the project name match in Cloudflare dashboard?

### GitHub Pages shows 404
**Check**:
1. Settings → Pages → Source is set to "GitHub Actions"
2. Workflow completed successfully (check Actions tab)
3. CNAME file exists in `/docs` directory
4. DNS records are configured correctly

### Custom domain not working
**Wait**: DNS propagation can take up to 48 hours
**Verify**:
```bash
dig gwingz.com
nslookup gwingz.com
```

### Build succeeds but site looks broken
**Check**:
1. CSS file generated: `docs/css/styles.css`
2. Images copied: `docs/images/`
3. Videos copied: `docs/videos/`
4. Check browser console for 404 errors

---

## Workflow Status Badges

Add these to your `README.md` to show workflow status:

```markdown
![Cloudflare Pages](https://github.com/Gwingz-Studio/gwingz-screening/actions/workflows/deploy-cloudflare-pages.yml/badge.svg)
![GitHub Pages](https://github.com/Gwingz-Studio/gwingz-screening/actions/workflows/deploy-github-pages.yml/badge.svg)
![Build Validation](https://github.com/Gwingz-Studio/gwingz-screening/actions/workflows/build-validation.yml/badge.svg)
```

---

## Local Development

To test the build process locally:

```bash
# Install dependencies
npm install

# Build and watch CSS changes
npm run watch:css

# Start development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:8080` to preview the site.

---

## Disabling a Workflow

To disable a workflow without deleting it:

1. Go to **Actions** tab
2. Select the workflow
3. Click "..." menu → "Disable workflow"

Or, rename the file to add `.disabled`:
```bash
mv .github/workflows/deploy-cloudflare-pages.yml \
   .github/workflows/deploy-cloudflare-pages.yml.disabled
```

---

## Next Steps

1. **Choose your deployment method** (Cloudflare Pages or GitHub Pages)
2. **Add required secrets** (if using Cloudflare)
3. **Configure custom domain** (gwingz.com)
4. **Push to main branch** to trigger deployment
5. **Monitor in Actions tab** to verify success
6. **Visit your site** at the deployed URL

---

## Support

For issues with:
- **GitHub Actions**: Check the [Actions documentation](https://docs.github.com/en/actions)
- **Cloudflare Pages**: Check the [Pages documentation](https://developers.cloudflare.com/pages/)
- **Eleventy**: Check the [Eleventy documentation](https://www.11ty.dev/)
