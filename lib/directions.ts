import type { PizzaLocation } from "@/types/location";
export const directionsUrl = (location: PizzaLocation) => `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
