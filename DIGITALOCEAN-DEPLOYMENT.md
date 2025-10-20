# DigitalOcean Deployment Guide (GitHub Student Pack)

## 🎓 Using Your Student Credits

Your GitHub Student Developer Pack includes **$200 in DigitalOcean credits** - perfect for hosting this project!

## 🚀 Quick Deploy to DigitalOcean App Platform

### Step 1: Access DigitalOcean
1. Go to https://www.digitalocean.com/github-students
2. Sign up/login with your GitHub account (this activates your $200 credit)
3. Navigate to: https://cloud.digitalocean.com/apps

### Step 2: Create New App
1. Click **Create App**
2. Select **GitHub** as the source
3. Authorize DigitalOcean to access your GitHub repos (if first time)
4. Select repository: **calebmills99/golden-wings-screening**
5. Select branch: **main**
6. Click **Next**

### Step 3: Configure App Settings
**App Type:**
- Type: **Static Site**

**Build Settings:**
- Build Command: (leave empty - no build needed)
- Output Directory: `/` (root)
- HTTP Port: (leave default)

**Environment:**
- Keep defaults

Click **Next**

### Step 4: App Info
- App Name: `golden-wings-screening` (or customize)
- Region: Choose closest to your audience
  - New York (nyc1/nyc3) - East Coast
  - San Francisco (sfo3) - West Coast
  - Toronto (tor1) - Canada

Click **Next**

### Step 5: Select Plan
**Starter Plan (Free Tier):**
- ✅ Free for static sites
- ✅ 3 static sites included
- ✅ Automatic SSL
- ✅ Global CDN
- ✅ Custom domains

Click **Launch App**

### Step 6: Wait for Deployment
- Initial deployment: 1-2 minutes
- You'll see build logs in real-time
- Once complete, you'll get a live URL

## 🌐 Your Live URL

Your app will be deployed at:
```
https://golden-wings-screening-xxxxx.ondigitalocean.app
```

The URL will be shown in your app dashboard.

## 🔧 Custom Domain (Optional)

### Add Your Own Domain
1. In your app dashboard, go to **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `screening.golden-wings-robyn.com`)
4. DigitalOcean will provide DNS records
5. Add these records to your domain registrar:
   ```
   Type: CNAME
   Name: screening (or @)
   Value: golden-wings-screening-xxxxx.ondigitalocean.app
   ```
6. Wait for DNS propagation (5-30 minutes)
7. SSL certificate auto-generates

## 🔄 Auto-Deployment

Every time you push to `main` branch:
- ✅ DigitalOcean automatically rebuilds
- ✅ Changes go live in ~1 minute
- ✅ Zero downtime deployments
- ✅ Rollback available if needed

## 📊 Benefits vs GitHub Pages

| Feature | GitHub Pages | DigitalOcean App Platform |
|---------|--------------|---------------------------|
| Cost | Free | Free (Starter) + $200 credit |
| Build Time | 2-3 minutes | 30-60 seconds |
| SSL | ✅ Auto | ✅ Auto |
| Custom Domain | ✅ Free | ✅ Free |
| CDN | ✅ GitHub CDN | ✅ Global CDN |
| Analytics | ❌ No | ✅ Basic traffic stats |
| Environment Variables | ❌ No | ✅ Yes |
| Deploy Previews | ❌ No | ✅ Yes (Pro) |

## 🎯 Recommended Setup

Since you have $200 in credits, I recommend:

**Phase 1: Use DigitalOcean App Platform (Free Tier)**
- Deploy the static site (costs: $0/month)
- Save your $200 credits for future projects
- Get faster deployments and better analytics

**Phase 2: If You Need More Later**
Use your credits for:
- Database hosting (for future RSVP features)
- Backend API server (if you want to move off Google Apps Script)
- Multiple environments (staging + production)

## 🔐 Environment Variables (Future Use)

If you ever want to move your webhook URL to an environment variable:

1. In DigitalOcean app settings → **App-Level Environment Variables**
2. Add: `WEBHOOK_URL` = `your-google-script-url`
3. Update `index.html` line 283:
   ```javascript
   const WEBHOOK_URL = window.WEBHOOK_URL || 'fallback-url';
   ```

## 📈 Monitoring

View your app metrics:
- Go to your app dashboard
- Click **Insights** tab
- See: Bandwidth, Requests, Response times

## 🐛 Troubleshooting

### Deployment Failed?
- Check **Runtime Logs** in app dashboard
- Verify `index.html` is in root directory
- Ensure no build command is specified

### Site Not Loading?
- Check app URL in dashboard
- Verify deployment status is "Active"
- Clear browser cache and try again

### Form Not Submitting?
- Webhook is external (Google Apps Script)
- DigitalOcean doesn't block outbound requests
- Check browser console for CORS messages (normal with no-cors mode)

## 💰 Cost Breakdown

**Your Setup (Static Site Only):**
- Hosting: **$0/month** (included in free tier)
- SSL Certificate: **$0/month** (automatic)
- Bandwidth: **100GB/month free**, then $0.01/GB
- Custom Domain: **$0** (bring your own)

**Estimated Monthly Cost:** $0

Your $200 credit remains untouched for future projects!

## 🎬 Deploy Now

Ready to deploy? Here's the link:
👉 https://cloud.digitalocean.com/apps/new

Select GitHub → golden-wings-screening → main → Static Site → Launch

Your site will be live in under 2 minutes!

## 📚 Additional Resources

- [DigitalOcean App Platform Docs](https://docs.digitalocean.com/products/app-platform/)
- [Static Sites Guide](https://docs.digitalocean.com/products/app-platform/how-to/manage-static-sites/)
- [GitHub Student Pack Benefits](https://education.github.com/pack)
- [DigitalOcean Community Tutorials](https://www.digitalocean.com/community/tutorials)

## Support

Questions about deployment? Check the DigitalOcean dashboard logs or contact info@golden-wings-robyn.com
