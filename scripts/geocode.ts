import fs from 'fs';
import path from 'path';

interface RawLocation {
  id: string;
  slug: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  hours: Record<string, string>;
  orderUrl: string;
  status: 'open' | 'coming-soon';
}

interface GeocodedLocation extends RawLocation {
  latitude: number;
  longitude: number;
}

const RAW_DATA_PATH = path.join(process.cwd(), 'data', 'locations.raw.json');
const OUTPUT_DATA_PATH = path.join(process.cwd(), 'data', 'locations.json');

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function geocodeCensus(address: string, city: string, state: string, zip: string) {
  const url = new URL('https://geocoding.geo.census.gov/geocoder/locations/address');
  url.searchParams.append('street', address);
  url.searchParams.append('city', city);
  url.searchParams.append('state', state);
  url.searchParams.append('zip', zip);
  url.searchParams.append('benchmark', 'Public_AR_Current');
  url.searchParams.append('format', 'json');

  const response = await fetch(url.toString());
  if (!response.ok) return null;

  const data = await response.json();
  const match = data?.result?.addressMatches?.[0];
  if (match && match.coordinates) {
    return {
      latitude: match.coordinates.y,
      longitude: match.coordinates.x,
    };
  }
  return null;
}

async function geocodeNominatim(address: string, city: string, state: string) {
  const query = `${address}, ${city}, ${state}`;
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.append('q', query);
  url.searchParams.append('format', 'json');
  url.searchParams.append('limit', '1');

  // Nominatim policy: 1 req/sec and descriptive User-Agent
  const response = await fetch(url.toString(), {
    headers: {
      'User-Agent': 'TandooriPizzaLocationGeocodingScript/1.0 (test@example.com)'
    }
  });
  
  if (!response.ok) return null;

  const data = await response.json();
  if (data && data.length > 0) {
    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
    };
  }
  return null;
}

async function main() {
  if (!fs.existsSync(RAW_DATA_PATH)) {
    console.error(`File not found: ${RAW_DATA_PATH}`);
    process.exit(1);
  }

  const rawData: RawLocation[] = JSON.parse(fs.readFileSync(RAW_DATA_PATH, 'utf-8'));
  const geocodedData: GeocodedLocation[] = [];

  for (const loc of rawData) {
    console.log(`Geocoding ${loc.name}...`);
    
    let coords = await geocodeCensus(loc.address, loc.city, loc.state, loc.zip);
    
    if (!coords) {
      console.log(`  Census failed. Trying Nominatim...`);
      await delay(1000); // 1 sec delay per Nominatim policy
      coords = await geocodeNominatim(loc.address, loc.city, loc.state);
    }

    if (coords) {
      console.log(`  Success: ${coords.latitude}, ${coords.longitude}`);
      geocodedData.push({
        ...loc,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    } else {
      console.error(`  ERROR: Could not geocode ${loc.address}, ${loc.city}. Please check the address.`);
      // Add it anyway with placeholder 0,0 so it doesn't get lost
      geocodedData.push({
        ...loc,
        latitude: 0,
        longitude: 0,
      });
    }
  }

  fs.writeFileSync(OUTPUT_DATA_PATH, JSON.stringify(geocodedData, null, 2));
  console.log(`\nGeocoding complete. Wrote ${geocodedData.length} locations to data/locations.json`);
}

main().catch(console.error);
