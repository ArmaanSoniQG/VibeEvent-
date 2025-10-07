## VibeEvent — Minimal Prototype

A tiny full-stack demo that:

- **/api/events**: pulls Luma events (if `LUMA_API_KEY` present) and merges with mock Partiful JSON, normalizes fields, and returns distance from user (Haversine).
- **/api/distance**: returns distance_km and walking_minutes between two coordinates.
- **Frontend**: lists events with status badges, date, category, location, and an “Open in Maps” link. Requests browser geolocation.

### JSON shape

Each event returned by `/api/events` follows:

```json
{
  "name": "Google AI Mixer",
  "start": "2025-10-07T19:00:00-07:00",
  "category": "AI / fintech",
  "location": "SoMa, SF",
  "status": "accepted",
  "lat": 37.776,
  "lng": -122.398,
  "distance_km": 2.4
}
```

### Setup

1) Install dependencies

```bash
npm install
```

2) Configure env (optional, for live Luma data)

Create `.env` (see `.env.example`) and set `LUMA_API_KEY`.

3) Run

```bash
npm run dev
# then open http://localhost:3000
```

### Notes

- Luma API: https://public-api.luma.com — this demo calls `/api/v1/events` with `Authorization: Bearer <key>`.
- Partiful: no public API. We use `data/partiful.mock.json` to simulate a few events.
- Geocoding uses Nominatim (OpenStreetMap) best-effort for addresses missing lat/lng.
- Distance uses Haversine; walking time ≈ 5 km/h.
# VibeEvent-
startup
