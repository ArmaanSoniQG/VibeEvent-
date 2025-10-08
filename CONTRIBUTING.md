# Team Integration Guide

## Roles & Focus

- **Person A (API/Data)**: Luma integration, Partiful mock, `/api/events` endpoint
- **Person B (Frontend/API)**: UI components, event list, distance display
- **Person C (Logic/Distance)**: Geocoding, Haversine, `/api/distance` endpoint

## Quick Start (Windows + Ubuntu)

```bash
# 1. Clone
git clone https://github.com/ArmaanSoniQG/VibeEvent-.git
cd VibeEvent-

# 2. Install
npm install

# 3. (Optional) Add Luma API key
cp .env.example .env
# Edit .env and set LUMA_API_KEY=your_key_here

# 4. Run
npm run dev
# Open http://localhost:3000
```

## API Endpoints (for integration)

### GET /api/events?lat={lat}&lng={lng}

Returns normalized events with distance:

```json
{
  "events": [
    {
      "name": "Event Name",
      "start": "2025-10-07T19:00:00-07:00",
      "category": "AI / fintech",
      "location": "SoMa, SF",
      "status": "accepted",
      "lat": 37.776,
      "lng": -122.398,
      "distance_km": 2.4
    }
  ]
}
```

### GET /api/distance?fromLat={lat}&fromLng={lng}&toLat={lat}&toLng={lng}

Returns distance between two points:

```json
{
  "distance_km": 2.4,
  "walking_minutes": 29
}
```

## File Structure

```
VibeEvent-/
├── server.js              # Express server + API endpoints
├── public/
│   └── index.html         # Frontend UI
├── data/
│   └── partiful.mock.json # Mock Partiful events
├── package.json
├── .env.example           # Environment template
└── README.md
```

## Integration Workflow

1. **Data person**: Update `fetchLumaEvents()` in `server.js` or add more mock events to `data/partiful.mock.json`
2. **Frontend person**: Modify `public/index.html` to add features (map view, filters, etc.)
3. **Logic person**: Enhance distance utilities in `server.js` (add Google Distance Matrix, route optimization)

## Testing Locally

```bash
# Test /api/events
curl "http://localhost:3000/api/events?lat=37.7749&lng=-122.4194"

# Test /api/distance
curl "http://localhost:3000/api/distance?fromLat=37.7749&fromLng=-122.4194&toLat=37.7849&toLng=-122.4094"
```

## Pushing Changes

```bash
git add .
git commit -m "feat: your feature description"
git push origin main
```

## Notes

- Works on Windows (PowerShell/CMD) and Ubuntu (bash)
- Node.js 18+ recommended
- No build step needed (pure Node + vanilla JS frontend)
