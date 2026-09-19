# Tandoori Pizza Locations Website

A premium, conversion-focused Next.js marketing and location-finder site for Tandoori Pizza. This project features a 3D interactive map, responsive design, and performance optimizations.

## Features

- **Interactive 3D Map**: Uses MapLibre GL JS with AWS Terrarium terrain and OpenFreeMap 3D buildings.
- **Automated Geocoding Pipeline**: Node script to automatically geocode raw address data using the US Census Geocoder and Nominatim (OSM).
- **Modern Tech Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React icons.
- **Conversion Focused**: Integrated franchise enquiry form, easy-to-use location cards, and fast loading performance.
- **Zero Paid Maps**: No Google Maps or Mapbox API keys required. Everything relies on public or open-source tile services.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Generate location data (Geocoding):**
   ```bash
   npm run geocode
   ```
   This reads `data/locations.raw.json` and generates `data/locations.json` with latitude and longitude.

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## Development & Customization

- **Styling**: Colors and fonts are configured in `tailwind.config.ts` and `app/globals.css`.
- **Map Config**: The map is implemented in `components/map/MapLibreMap.tsx`. It uses Esri World Imagery as the base raster tile.
- **Data**: Update `data/locations.raw.json` to add new restaurants, then run `npm run geocode`.

## License & Attribution
Imagery provided by Esri (Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community).
Terrain provided by AWS / Mapzen.
