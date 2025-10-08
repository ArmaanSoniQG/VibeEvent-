// Vercel serverless function for /api/events
export default function handler(req, res) {
  // Mock data for demo - no actual backend needed
  const mockEvents = [
    {
      name: "Doughnut Disaster Festival",
      start: "2025-10-11T09:00:00.000Z",
      category: "Food & Social",
      location: "Crockett, CA",
      status: "accepted",
      lat: 38.0524,
      lng: -122.2136,
      distance_km: 2.4
    },
    {
      name: "eChai: Founder's Food Truck Fest",
      start: "2025-10-09T18:00:00.000Z",
      category: "Food & Social",
      location: "Dhaba Express Fremont",
      status: "rejected",
      lat: 37.5485,
      lng: -121.9886,
      distance_km: 5.1
    },
    {
      name: "Farm Harvest and Lunch - PhD Program",
      start: "2025-10-29T11:00:00.000Z",
      category: "Food & Social",
      location: "Stanford Educational Farm",
      status: "accepted",
      lat: 37.4275,
      lng: -122.1697,
      distance_km: 8.7
    },
    {
      name: "Spice, Chaat & Sassy Street Food 🔥",
      start: "2025-11-03T19:00:00.000Z",
      category: "Food & Social",
      location: "Jalebi Street",
      status: "pending",
      lat: 37.7749,
      lng: -122.4194,
      distance_km: 3.2
    },
    {
      name: "SF Tech Mixer & Networking",
      start: "2025-10-15T18:30:00.000Z",
      category: "Networking",
      location: "SoMa District, SF",
      status: "accepted",
      lat: 37.7749,
      lng: -122.4194,
      distance_km: 1.8
    },
    {
      name: "AI & Pizza Night",
      start: "2025-10-18T19:00:00.000Z",
      category: "AI / Tech",
      location: "Mission District, SF",
      status: "accepted",
      lat: 37.7599,
      lng: -122.4148,
      distance_km: 2.9
    }
  ];

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ events: mockEvents });
}
