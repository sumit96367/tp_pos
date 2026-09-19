import type { PizzaLocation } from "@/types/location";

// A continental-US frame: close enough to avoid showing the globe, wide enough for California and New Jersey together.
export const US_OVERVIEW = { longitude: -98, latitude: 38.4, height: 5_250_000, heading: 0, pitch: -1.06, roll: 0 };
/** Continental United States only; used for the hero and the "US overview" reset. */
export const US_OVERVIEW_BOUNDS = { west: -125, south: 24.3, east: -66.2, north: 49.3 };
// A near-top-down final angle keeps the restaurant pin at the exact center of the view.
const LOCATION_CAMERA_PRESETS: Record<string, { height: number; heading: number; pitch: number }> = {
  stockton: { height: 1450, heading: 0.18, pitch: -1.47 }, modesto: { height: 1550, heading: 0.12, pitch: -1.47 },
  millbrae: { height: 1750, heading: 0.22, pitch: -1.46 }, "east-windsor": { height: 1500, heading: 0.14, pitch: -1.47 }
};
const fallbackPreset = { height: 1700, heading: 0.15, pitch: -1.47 };
export const locationCameraPreset = (location: PizzaLocation) => LOCATION_CAMERA_PRESETS[location.id] ?? fallbackPreset;
export const locationDestination = (location: PizzaLocation, Cesium: typeof import("cesium")) => Cesium.Cartesian3.fromDegrees(location.longitude, location.latitude, locationCameraPreset(location).height);
export const locationOrientation = (location: PizzaLocation) => ({ ...locationCameraPreset(location), roll: 0 });
export const durationForFlight = (reducedMotion: boolean) => reducedMotion ? 0.25 : 3.5;
