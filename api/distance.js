// Vercel serverless function for /api/distance
function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
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

export default function handler(req, res) {
  const { fromLat, fromLng, toLat, toLng } = req.query;
  
  const lat1 = parseFloat(fromLat);
  const lng1 = parseFloat(fromLng);
  const lat2 = parseFloat(toLat);
  const lng2 = parseFloat(toLng);

  if (![lat1, lng1, lat2, lng2].every(Number.isFinite)) {
    return res.status(400).json({ 
      error: 'fromLat, fromLng, toLat, toLng are required as numbers' 
    });
  }

  const km = haversineKm(lat1, lng1, lat2, lng2);
  const minutes = walkingMinutes(km);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ 
    distance_km: Math.round(km * 10) / 10, 
    walking_minutes: minutes 
  });
}
