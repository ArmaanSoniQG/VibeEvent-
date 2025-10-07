import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { fetch } from 'undici';
import { parse } from 'csv-parse/sync';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Utilities
const toRad = (deg) => (deg * Math.PI) / 180;
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function walkingMinutes(km) {
  const avgKmPerMin = 5 / 60; // 5 km/h walking speed
  return Math.round((km / avgKmPerMin));
}

async function geocode(address) {
  if (!address) return null;
  try {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', address);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '1');
    const res = await fetch(url, {
      headers: { 'User-Agent': 'VibeEvent/0.1 (demo)' }
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
  } catch (e) {
    return null;
  }
}

// Data sources
async function fetchLumaEvents() {
  const apiKey = process.env.LUMA_API_KEY;
  if (!apiKey) return [];
  try {
    // Minimal example: fetch attending events; adjust endpoint per your org needs
    const res = await fetch('https://public-api.luma.com/api/v1/events', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) {
      console.warn('Luma API error', res.status);
      return [];
    }
    const payload = await res.json();
    // Attempt common shapes; fallback to []
    const items = payload?.data || payload?.events || [];
    return items.map((e) => ({
      source: 'luma',
      raw: e
    }));
  } catch (e) {
    console.warn('Luma fetch failed', e.message);
    return [];
  }
}

async function readLumaCSV() {
  try {
    const csvPath = path.join(__dirname, 'data', 'luma_food_events_with_acceptance.csv');
    const content = await fs.readFile(csvPath, 'utf-8');
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    return records.map((row) => ({
      source: 'luma_csv',
      raw: {
        name: row.Description || '',
        hostedBy: row['Hosted by'] || '',
        dateStr: row.Date || '',
        location: row.Location || '',
        acceptance: row.Acceptance || 'Pending'
      }
    }));
  } catch (e) {
    console.warn('Failed to read CSV:', e.message);
    return [];
  }
}

async function readPartifulMock() {
  try {
    const f = await fs.readFile(path.join(__dirname, 'data', 'partiful.mock.json'), 'utf-8');
    const json = JSON.parse(f);
    return (json.events || []).map((e) => ({ source: 'partiful', raw: e }));
  } catch (e) {
    return [];
  }
}

function parseStatus(tagsOrStatus) {
  if (!tagsOrStatus) return 'pending';
  const s = (Array.isArray(tagsOrStatus) ? tagsOrStatus.join(' ') : String(tagsOrStatus)).toLowerCase();
  if (s.includes('approved') || s.includes('accepted') || s.includes('rsvp:yes') || s.includes('going')) return 'accepted';
  if (s.includes('not approved')) return 'rejected';
  if (s.includes('waitlist') || s.includes('pending')) return 'pending';
  return 'pending';
}

function parseDateString(dateStr) {
  // Parse "Oct 9, Thursday, 6:00 PM" format
  if (!dateStr) return null;
  try {
    // Extract month, day, time
    const match = dateStr.match(/(\w+)\s+(\d+),\s+\w+,\s+(.+)/);
    if (!match) return null;
    const [, month, day, time] = match;
    const year = 2025; // Assuming 2025 for now
    const dateTimeStr = `${month} ${day}, ${year} ${time}`;
    const parsed = new Date(dateTimeStr);
    return isNaN(parsed.getTime()) ? null : parsed.toISOString();
  } catch (e) {
    return null;
  }
}

async function normalizeEvent(item) {
  if (item.source === 'luma_csv') {
    const e = item.raw;
    const name = e.name || 'Event';
    const start = parseDateString(e.dateStr);
    const category = 'Food & Social'; // All CSV events are food-related
    const locationText = e.location || '';
    const status = parseStatus(e.acceptance);

    let lat = null;
    let lng = null;
    if (locationText) {
      const geo = await geocode(locationText + ', San Francisco Bay Area');
      if (geo) { lat = geo.lat; lng = geo.lng; }
    }

    return { name, start, category, location: locationText, status, lat, lng, hostedBy: e.hostedBy };
  }
  if (item.source === 'luma') {
    const e = item.raw;
    const name = e?.name || e?.title || 'Luma Event';
    const start = e?.start_at || e?.starts_at || e?.start || null;
    const category = Array.isArray(e?.tags) ? e.tags.join(', ') : (e?.category || '');
    const locationText = e?.location?.name || e?.location?.address || e?.location || '';
    const status = parseStatus(e?.rsvp_status || e?.attendance_status || e?.tags);

    let lat = parseFloat(e?.location?.lat);
    let lng = parseFloat(e?.location?.lng);
    if (!(Number.isFinite(lat) && Number.isFinite(lng)) && locationText) {
      const geo = await geocode(locationText);
      if (geo) { lat = geo.lat; lng = geo.lng; }
    }

    return { name, start, category, location: locationText, status, lat, lng };
  }
  if (item.source === 'partiful') {
    const e = item.raw;
    const name = e.name;
    const start = e.start;
    const category = e.category || '';
    const locationText = e.location || e.city || '';
    const status = e.status || 'pending';
    let { lat, lng } = e;
    if (!(Number.isFinite(lat) && Number.isFinite(lng)) && locationText) {
      const geo = await geocode(locationText);
      if (geo) { lat = geo.lat; lng = geo.lng; }
    }
    return { name, start, category, location: locationText, status, lat, lng };
  }
  return null;
}

function withDistance(events, userLat, userLng) {
  if (!(Number.isFinite(userLat) && Number.isFinite(userLng))) return events;
  return events.map((ev) => {
    let distance_km = null;
    if (Number.isFinite(ev.lat) && Number.isFinite(ev.lng)) {
      distance_km = Math.round(haversineKm(userLat, userLng, ev.lat, ev.lng) * 10) / 10;
    }
    return { ...ev, distance_km };
  });
}

app.get('/api/events', async (req, res) => {
  try {
    const userLat = parseFloat(req.query.lat);
    const userLng = parseFloat(req.query.lng);

    const [csvItems, lumaItems, partifulItems] = await Promise.all([
      readLumaCSV(),
      fetchLumaEvents(),
      readPartifulMock()
    ]);

    const normalized = (await Promise.all([...csvItems, ...lumaItems, ...partifulItems].map(normalizeEvent)))
      .filter(Boolean);

    const enriched = withDistance(normalized, userLat, userLng)
      .map((e) => ({
        name: e.name,
        start: e.start,
        category: e.category,
        location: e.location,
        status: e.status,
        lat: e.lat,
        lng: e.lng,
        distance_km: e.distance_km
      }));

    // Sort by start then distance
    enriched.sort((a, b) => {
      const at = a.start ? Date.parse(a.start) : 0;
      const bt = b.start ? Date.parse(b.start) : 0;
      if (at !== bt) return at - bt;
      const ad = a.distance_km ?? Infinity;
      const bd = b.distance_km ?? Infinity;
      return ad - bd;
    });

    res.json({ events: enriched });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to load events' });
  }
});

app.get('/api/distance', (req, res) => {
  const fromLat = parseFloat(req.query.fromLat);
  const fromLng = parseFloat(req.query.fromLng);
  const toLat = parseFloat(req.query.toLat);
  const toLng = parseFloat(req.query.toLng);
  if (![fromLat, fromLng, toLat, toLng].every(Number.isFinite)) {
    return res.status(400).json({ error: 'fromLat, fromLng, toLat, toLng are required as numbers' });
  }
  const km = haversineKm(fromLat, fromLng, toLat, toLng);
  const minutes = walkingMinutes(km);
  res.json({ distance_km: Math.round(km * 10) / 10, walking_minutes: minutes });
});

app.get('/health', (req, res) => res.json({ ok: true }));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
