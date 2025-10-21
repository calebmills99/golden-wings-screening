# How to Edit Your Golden Wings Site

Your simple, beautiful site is back! Just edit JSON files to change text and colors.

## 📝 Edit Text & Content

Edit this file: **`src/_data/site.json`**

```json
{
  "hero": {
    "title": "Golden Wings",           ← Change hero title
    "subtitle": "A 50-Year Journey...",  ← Change subtitle
    "date": "October 26, 2025",         ← Change date
    "time": "4:30 PM PST...",           ← Change time
    "ctaText": "RSVP Now"               ← Change button text
  },
  "about": {
    "heading": "About the Film",        ← Change section heading
    "paragraphs": [
      "First paragraph here...",         ← Edit paragraphs
      "Second paragraph here..."
    ]
  },
  "rsvp": {
    "heading": "Reserve Your Seat",     ← Change form heading
    "submitButton": "Confirm RSVP"      ← Change button text
  },
  "contact": {
    "email": "info@golden-wings-robyn.com"  ← Your email
  },
  "webhookUrl": "your-webhook-url"      ← Don't change unless needed!
}
```

## 🎨 Edit Colors (Coming Soon)

Edit this file: **`src/_data/colors.json`**

```json
{
  "primary": "#1e3a8a",        ← Main blue color
  "primaryLight": "#3b82f6",   ← Lighter blue
  "accent": "#60a5fa",         ← Accent color
  "background": "#f8fafc"      ← Background color
}
```

*Note: Colors are defined but need to be wired up to Tailwind. Using Tailwind classes for now.*

## 🎥 Your Clouds Video

Your beautiful aerial clouds video is back! It's in:
- `src/videos/clouds-aerial.mp4`
- Plays automatically in the hero section
- Works on mobile too!

## 🚀 Deploy to DigitalOcean

1. Edit `src/_data/site.json` with your changes
2. Commit and push:
```bash
git add src/_data/site.json
git commit -m "Update event details"
git push origin main
```
3. DigitalOcean auto-deploys in 1-2 minutes!

## 🧪 Test Locally

```bash
npm start
```

Visit http://localhost:8080

## ✅ What's Back

✅ Simple, clean design
✅ Clouds video background
✅ Tailwind CSS styling
✅ Easy JSON editing
✅ RSVP form (same webhook)

## ❌ What's Gone (Copilot's Mess)

❌ Backend API
❌ Admin panel
❌ Theme switcher
❌ Design system
❌ Overly complex code

## 📁 Simple Structure

```
src/
├── _data/
│   ├── site.json      ← EDIT THIS for content
│   └── colors.json    ← EDIT THIS for colors
├── _layouts/
│   └── base.njk       (main layout)
├── index.njk          (homepage)
├── confirmation.njk   (thank you page)
└── videos/
    └── clouds-aerial.mp4 (your beautiful video!)
```

That's it! No complexity. Just simple edits.
