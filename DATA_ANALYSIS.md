# Luma Food Events CSV Analysis

## Data Source
**File**: `data/luma_food_events_with_acceptance.csv`

## Schema
| Column | Type | Example | Notes |
|--------|------|---------|-------|
| Description | String | "eChai: Founder's Food Truck Fest" | Event name |
| Hosted by | String | "Khyati Brahmbhatt & eChai Ventures" | Organizer(s) |
| Date | String | "Oct 9, Thursday, 6:00 PM" | Custom format |
| Location | String | "Dhaba Express Fremont" | Venue name |
| Acceptance | String | "Approved" / "Not Approved" / "Pending" | RSVP status |

## Sample Events (4 total in CSV)

1. **eChai: Founder's Food Truck Fest**
   - Date: Oct 9, Thursday, 6:00 PM
   - Location: Dhaba Express Fremont
   - Status: Not Approved
   - Host: Khyati Brahmbhatt & eChai Ventures

2. **Doughnut Disaster Festival**
   - Date: Oct 11, Saturday, 9:00 AM
   - Location: Crockett
   - Status: Approved
   - Host: Indy Rishi Singh, Diana Cantu-Reyna, Kyle Ciullo, Charlie Trinh & 1 other

3. **Farm Harvest and Lunch - First Year PhD Community Program**
   - Date: Oct 29, Wednesday, 11:00 AM
   - Location: O'Donohue Family Stanford Educational Farm
   - Status: Approved
   - Host: Patty Germanow & Clare Maloney-McCrystle

4. **Spice, Chaat, & Sassy Street Food: Indian Night Out at Jalebi Street 🔥**
   - Date: Nov 3, Monday, 7:00 PM
   - Location: Jalebi Street
   - Status: Pending
   - Host: Rafat Khan

## Data Processing

### Date Parsing
- **Input format**: `"Oct 9, Thursday, 6:00 PM"`
- **Regex**: `/(\w+)\s+(\d+),\s+\w+,\s+(.+)/`
- **Output**: ISO 8601 string (e.g., `"2025-10-09T18:00:00.000Z"`)
- **Assumption**: Year = 2025

### Status Mapping
| CSV Value | Normalized Status |
|-----------|-------------------|
| "Approved" | `accepted` |
| "Not Approved" | `rejected` |
| "Pending" | `pending` |

### Geocoding
- All locations are geocoded using **Nominatim** (OpenStreetMap)
- Search query appended with ", San Francisco Bay Area" for better accuracy
- Returns `lat`/`lng` coordinates for distance calculations

### Category
- All events tagged as **"Food & Social"** (since CSV is food-specific)

## API Integration

### Endpoint: `GET /api/events?lat={lat}&lng={lng}`

**Response includes**:
```json
{
  "events": [
    {
      "name": "Doughnut Disaster Festival",
      "start": "2025-10-11T09:00:00.000Z",
      "category": "Food & Social",
      "location": "Crockett",
      "status": "accepted",
      "lat": 38.0524,
      "lng": -122.2136,
      "distance_km": 45.2
    }
  ]
}
```

## Distance Calculations
- **Algorithm**: Haversine formula
- **Walking time**: Assumes 5 km/h average speed
- **Sorting**: Events sorted by start date, then by distance from user

## Team Integration Notes

### For Data Person
- CSV is now the **primary data source** (replaces Luma API calls)
- To add more events: append rows to `data/luma_food_events_with_acceptance.csv`
- Date format must match: `"Month Day, Weekday, Time"`

### For Frontend Person
- Status values: `accepted`, `rejected`, `pending`
- All events include `hostedBy` field (can display organizer)
- Distance is `null` if geocoding fails or user location unavailable

### For Logic Person
- Geocoding is async and cached per request
- Consider adding Google Distance Matrix API for more accurate travel times
- Current implementation uses Haversine (straight-line distance)

## Next Steps
1. ✅ CSV parsing implemented
2. ✅ Date parsing with regex
3. ✅ Status normalization
4. ✅ Geocoding integration
5. 🔄 Test with real user locations
6. 🔄 Add caching for geocoded coordinates
7. 🔄 Consider batch geocoding for performance
