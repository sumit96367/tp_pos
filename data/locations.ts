import type { PizzaLocation } from "@/types/location";

/** Coordinates are stored locally; no runtime geocoding is used. */
export const locations: PizzaLocation[] = [
  { id: "stockton", name: "Tandoori Pizza", city: "Stockton", state: "California", country: "USA", address: "5756 Pacific Ave Ste #5, Stockton, CA 95207", latitude: 38.001154, longitude: -121.315309, status: "Open", orderUrl: "https://tandooripizza.com/order-now/", imagery: { preferredLayer: "usgs-naip-plus", maxZoom: 19 } },
  { id: "modesto", name: "Tandoori Pizza", city: "Modesto", state: "California", country: "USA", address: "2001 McHenry Avenue, Modesto, CA 95350", latitude: 37.670824, longitude: -120.995803, status: "Open", imagery: { preferredLayer: "usgs-naip-plus", maxZoom: 19 } },
  { id: "millbrae", name: "Tandoori Pizza", city: "Millbrae", state: "California", country: "USA", address: "Millbrae, CA", latitude: 37.598546, longitude: -122.387194, status: "Coming Soon", imagery: { preferredLayer: "usgs-naip-plus", maxZoom: 19 } },
  { id: "east-windsor", name: "Tandoori Pizza", city: "East Windsor", state: "New Jersey", country: "USA", address: "370 US-130 #6, East Windsor, NJ 08520", latitude: 40.2694, longitude: -74.5819, status: "Open", orderUrl: "https://tandooripizza.com/order-now/", imagery: { preferredLayer: "usgs-naip-plus", maxZoom: 19 } }
];

export const isValidLocation = (location: PizzaLocation) => Number.isFinite(location.latitude) && Number.isFinite(location.longitude) && Math.abs(location.latitude) <= 90 && Math.abs(location.longitude) <= 180 && Boolean(location.city && location.state && location.address);
