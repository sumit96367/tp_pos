# Tandoori Pizza locations

A map-first, static-capable Next.js experience for finding Tandoori Pizza locations in the United States. Selecting a location triggers a cinematic Cesium camera flight and opens a restaurant card.

## Features

- Interactive CesiumJS globe centered on the continental US
- Public USGS National Map aerial imagery, with visible provider credit
- Static, typed location data: no runtime geocoding or API keys
- Branded map markers, location selector, directions, responsive bottom sheet, and WebGL fallback
- Reduced-motion support, keyboard-accessible location list, SEO metadata, and no mandatory paid services

## Getting started

```bash
npm install
npm run dev
```

Build the production app with `npm run build`, then use `npm run start`. The build copies Cesium's required worker/assets into `public/cesium`, so this can be deployed on Vercel as a static-capable Next.js project.

## Location data

Edit `data/locations.ts` to update restaurant information or add a location. Each valid entry automatically creates a marker and selector row. Coordinates are stored locally and validated by the map layer; no geocoding request is made at runtime.

The present Stockton and Modesto coordinates reference their published street addresses. East Windsor references the official Tandoori Pizza address. Millbrae is marked `Coming Soon`; replace its city-level placeholder coordinate with the confirmed storefront coordinate before launch.

## Imagery, attribution, and cost

The default overview source is the cached [USGS National Map Imagery Only service](https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer), configured in `lib/imagery.ts`. On a restaurant flight, the map adds the dynamic [USGS NAIP Plus ImageServer](https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPPlus/ImageServer) through its official WMS endpoint. This avoids high-resolution requests across the entire US while prioritizing the selected restaurant area. NAIP is public-domain orthoimagery, generally refreshed on a rolling cycle; actual acquisition date and resolution vary by location. The required USGS credit remains visible in the map UI. It is public data/service, but availability and rate limits are not guaranteed; production traffic should respect [USGS terms of use](https://www.usgs.gov/faqs/what-are-terms-uselicensing-map-services-and-data-national-map?page=1).

Cesium runs with its ellipsoid terrain provider and requires no Cesium Ion token. There are no secret keys or paid map, geocoding, routing, or imagery APIs. Directions deliberately open an external Google Maps URL based only on stored coordinates; the site itself does not load a Google Maps API.

## Branding and troubleshooting

Interface colors live in `app/globals.css`; replace the simple TP monogram with an approved official logo asset when one is supplied. If the map cannot initialize (WebGL disabled, imagery/network failure, or unsupported browser), the app presents a usable location list instead of a blank page. Modern Chrome, Edge, Firefox, and Safari with WebGL enabled are supported.
