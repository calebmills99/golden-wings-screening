# Golden Wings Documentary Screening - RSVP System

Cloudflare-based RSVP system for managing screening registrations for the Golden Wings documentary.

## 📽️ About Golden Wings

A powerful documentary following Robyn Stewart's remarkable 50+ year career as an American Airlines flight attendant, directed by her son Caleb Mills Stewart. The film captures stories of courage, dedication, and the evolution of aviation through one woman's extraordinary journey.

## 🎯 Screening Details

- **Date**: Free screening through the winter until springtime
- **Time**: 4:30 PM PST / 6:30 PM CST / 7:30 PM EST
- **Duration**: 90 minutes
- **Admin Email**: info@gwings.studio

## 🚀 What's Included

### Backend System
- **`gwingz-worker.js`** - Cloudflare Worker RSVP API
- **`wrangler.toml`** - Cloudflare Worker configuration
- **`webflow-form-integration.html`** - Webflow-ready RSVP form posting to Worker
- **`admin-dashboard.html`** - Admin dashboard for managing RSVPs

### Documentation
- **`setup-instructions.md`** - Step-by-step deployment guide
- **`deployment-checklist.md`** - Complete feature overview and deployment steps

## ✨ Features

- ✅ Automated confirmation emails
- ✅ Cloudflare Worker RSVP endpoint
- ✅ Calendar integration (Google, Outlook, .ics)
- ✅ Real-time admin dashboard
- ✅ Weekly RSVP reports
- ✅ Export capabilities (CSV, PDF)
- ✅ Mobile-responsive design
- ✅ Special accommodations tracking

## 📦 Quick Start

1. **Deploy Cloudflare Worker** (see `setup-instructions.md`)
2. **Set Worker secrets (`RESEND_API_KEY`)**
3. **Configure form/webflow webhook to `/api/rsvp`**
4. **Deploy static site/admin dashboard**

Full deployment time: ~40 minutes

## 🔧 Technology Stack

- Cloudflare Workers (Backend API)
- Google Workspace (Email)
- Webflow (Forms)
- JavaScript/HTML/CSS (Frontend)

## 📞 Support

For questions or issues, contact: info@gwings.studio

## 🎬 Ready to Launch!

This system provides a complete, professional RSVP management solution for your documentary screening.

---

*Generated with Claude Code*
