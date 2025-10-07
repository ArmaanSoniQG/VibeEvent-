# Deploy to Vercel

## Quick Deploy (1 command)

```bash
npm install -g vercel
vercel --prod
```

## Step-by-Step

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Done!** Your site will be live at `https://your-project.vercel.app`

## What Gets Deployed

- ✅ **Frontend**: `public/demo.html` (beautiful static mockup)
- ✅ **API**: `/api/events` and `/api/distance` (serverless functions)
- ✅ **No backend needed**: Everything runs on Vercel's edge network

## Local Development

```bash
npm install
vercel dev
# Open http://localhost:3000
```

## Features

- 🎨 Beautiful gradient UI with animations
- 📊 Mock event data (6 events from CSV)
- 🗺️ Distance calculations (Haversine)
- 📍 Route optimization display
- 🚀 Zero-config deployment
- ⚡ Serverless API endpoints

## File Structure

```
VibeEvent-/
├── public/
│   └── demo.html          # Main frontend (static)
├── api/
│   ├── events.js          # GET /api/events (serverless)
│   └── distance.js        # GET /api/distance (serverless)
├── vercel.json            # Vercel config
└── package.json           # Dependencies
```

## No Errors

- ✅ No Node.js server needed
- ✅ No build step required
- ✅ No environment variables needed
- ✅ Works offline (static demo)
- ✅ API endpoints are optional (demo has embedded data)

## Presentation Ready

Open `public/demo.html` directly in any browser - no server needed!
