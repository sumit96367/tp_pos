"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { PizzaLocation } from "@/types/location";
import { USGS_IMAGERY_URL } from "@/lib/imagery";

const markerIcon = L.divIcon({
  className: "",
  html: '<span class="showcase-pin"><b>TP</b></span>',
  iconSize: [44, 54], iconAnchor: [22, 54], popupAnchor: [0, -51]
});

function FitAllLocations({ locations }: { locations: PizzaLocation[] }) {
  const map = useMap();
  useEffect(() => { map.fitBounds(locations.map(location => [location.latitude, location.longitude] as L.LatLngTuple), { padding: [42, 42], maxZoom: 5, animate: false }); }, [locations, map]);
  return null;
}

/** A static, USGS-backed companion map for comparing all franchise locations at once. */
export function InteractiveMap({ locations, onSelect }: { locations: PizzaLocation[]; onSelect: (location: PizzaLocation) => void }) {
  const center = useMemo<L.LatLngExpression>(() => [38.4, -98], []);
  return <div className="interactive-map" aria-label="All Tandoori Pizza locations map"><MapContainer center={center} zoom={4} scrollWheelZoom className="interactive-map-canvas"><FitAllLocations locations={locations} /><TileLayer attribution='Map services and data available from <a href="https://www.usgs.gov/" target="_blank" rel="noreferrer">U.S. Geological Survey</a>, National Geospatial Program.' url={`${USGS_IMAGERY_URL}/tile/{z}/{y}/{x}`} /><div className="showcase-map-title"><span>TP</span><div><b>Tandoori Pizza</b><small>All locations</small></div></div>{locations.map(location => <Marker key={location.id} position={[location.latitude, location.longitude]} icon={markerIcon} eventHandlers={{ click: () => onSelect(location) }}><Popup><div className="showcase-popup"><b>{location.city}, {location.state}</b><span>{location.address}</span><button onClick={() => onSelect(location)}>Explore location →</button></div></Popup></Marker>)}</MapContainer></div>;
}
