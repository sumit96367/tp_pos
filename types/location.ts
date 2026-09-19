export interface PizzaLocation {
  id: string;
  name: string;
  city: string;
  state: string;
  country: "USA";
  address: string;
  latitude: number;
  longitude: number;
  status: "Open" | "Coming Soon";
  orderUrl?: string;
  imagery?: { preferredLayer?: "usgs-naip-plus"; maxZoom?: number };
}
