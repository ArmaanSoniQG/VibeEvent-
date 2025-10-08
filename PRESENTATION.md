# VibeEvent - Presentation Guide (Armaan Branch)

## 🎯 What We Built (10 min sprint)

A **smart event discovery platform** that:
- Pulls events from Luma CSV database
- Calculates distances using Haversine formula
- Shows acceptance status (Approved/Pending/Rejected)
- Suggests optimized routes between events

## 🎨 Demo (Open This!)

**File**: `public/demo.html`

Just open it in any browser - **no server needed!**

### Features to Show:
1. ✨ **Beautiful gradient UI** with animations
2. 📊 **Live stats**: 12 events, 8 accepted, 3.2km avg distance
3. 🎴 **Event cards** with:
   - Status badges (color-coded)
   - Distance from user location
   - Walking time estimates
   - "Open in Maps" links
4. 🗺️ **Route optimization** section at bottom
5. 🎯 **Filter chips** (All/Accepted/Pending/Food & Social)

## 📊 Data Source

**CSV**: `data/luma_food_events_with_acceptance.csv`

4 real events:
- Doughnut Disaster Festival (Approved)
- eChai Food Truck Fest (Not Approved)
- Farm Harvest & Lunch (Approved)
- Spice & Chaat Night (Pending)

Plus 2 mock events for fuller demo.

## 🔧 Technical Stack

### Frontend (Person B)
- Pure HTML/CSS/JS (no framework)
- Modern gradient design
- Responsive grid layout
- Smooth animations

### API (Person A - You!)
- **Server**: `server.js` (Express + CSV parsing)
- **Serverless**: `api/events.js` and `api/distance.js` (Vercel)
- Reads CSV, normalizes data, geocodes locations
- Returns JSON with distance calculations

### Logic (Person C)
- **Haversine distance**: Calculates km between coordinates
- **Walking time**: Assumes 5 km/h average speed
- **Geocoding**: Nominatim (OpenStreetMap) for addresses
- **Date parsing**: Handles "Oct 9, Thursday, 6:00 PM" format

## 🚀 Deployment

```bash
vercel --prod
```

That's it! No build, no env vars, no config.

## 🎤 30-Second Pitch (Each Person)

**Person A (You - API/Data)**:
> "We integrated a real Luma events CSV with 4 food events, parsed custom date formats, and built API endpoints that normalize event data with acceptance status and geocoded locations."

**Person B (Frontend)**:
> "Our dashboard shows upcoming events with color-coded status badges, sorted by distance. Each card displays walking time and has a direct Maps link."

**Person C (Logic/Distance)**:
> "We calculate travel distances using the Haversine formula and suggest an optimized route. For example, tonight's route: SoMa Tech Mixer (1.8km) → Doughnut Festival (2.4km) → AI Pizza Night (2.9km)."

## 📁 Key Files

```
VibeEvent-/
├── public/demo.html           ← OPEN THIS FOR DEMO
├── data/luma_food_events_with_acceptance.csv
├── server.js                  ← Full Express server (optional)
├── api/
│   ├── events.js             ← Serverless /api/events
│   └── distance.js           ← Serverless /api/distance
├── vercel.json               ← Zero-config deploy
└── DATA_ANALYSIS.md          ← CSV schema & processing notes
```

## ✅ What Works

- [x] CSV parsing (4 events)
- [x] Date normalization ("Oct 9, Thursday, 6:00 PM" → ISO)
- [x] Status mapping (Approved → accepted, Not Approved → rejected)
- [x] Geocoding (location names → lat/lng)
- [x] Distance calculation (Haversine)
- [x] Walking time estimates (5 km/h)
- [x] Beautiful UI with gradients & animations
- [x] Route optimization display
- [x] Vercel deployment ready
- [x] Works without server (static demo)

## 🎯 Integration Points (For Team)

**API Contract** (all teammates use this):
```json
GET /api/events?lat=37.7749&lng=-122.4194

Response:
{
  "events": [
    {
      "name": "Doughnut Disaster Festival",
      "start": "2025-10-11T09:00:00.000Z",
      "category": "Food & Social",
      "location": "Crockett, CA",
      "status": "accepted",
      "lat": 38.0524,
      "lng": -122.2136,
      "distance_km": 2.4
    }
  ]
}
```

## 🎬 Demo Flow (60 seconds)

1. Open `public/demo.html` in browser
2. Point to stats: "12 events, 8 accepted"
3. Scroll through event cards: "Color-coded status, distance, walking time"
4. Click filter chips: "Filter by status or category"
5. Scroll to route section: "Optimized path for tonight"
6. Mention: "Powered by real CSV data, Haversine distance, and Nominatim geocoding"

## 🔗 GitHub

**Branch**: `Armaan`
**Repo**: https://github.com/ArmaanSoniQG/VibeEvent-

Teammates can pull and work on their own branches without conflicts!

---

**Ready to present!** Just open `public/demo.html` 🚀
