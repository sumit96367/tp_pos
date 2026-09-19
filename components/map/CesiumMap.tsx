"use client";
import { useEffect, useRef } from "react";
import type { PizzaLocation } from "@/types/location";
import { durationForFlight, locationDestination, locationOrientation, US_OVERVIEW, US_OVERVIEW_BOUNDS } from "@/lib/cesium";
import { USGS_ATTRIBUTION, USGS_IMAGERY_URL, USGS_NAIP_PLUS_WMS_URL } from "@/lib/imagery";

export interface MapHandle { flyToLocation: (location: PizzaLocation) => void; resetToUSOverview: () => void; }
export function CesiumMap({ locations, selected, command, onReady, onFlightComplete, onError, onImageryLoadingChange }: { locations: PizzaLocation[]; selected: PizzaLocation | null; command: { type: "location"; location: PizzaLocation } | { type: "overview" } | null; onReady: (handle: MapHandle) => void; onFlightComplete: (location: PizzaLocation) => void; onError: () => void; onImageryLoadingChange: (loading: boolean) => void }) {
 const viewerRef = useRef<import("cesium").Viewer>();
 const handlerRef = useRef<import("cesium").ScreenSpaceEventHandler>();
 const entitiesRef = useRef<Map<string, import("cesium").Entity>>(new Map());
 const flightRef = useRef<PizzaLocation | null>(null);
 useEffect(() => {
  let disposed = false;
  (async () => { try {
   if (!document.createElement("canvas").getContext("webgl")) throw new Error("WebGL unavailable");
   window.CESIUM_BASE_URL = "/cesium";
   const Cesium = await import("cesium");
   if (disposed) return;
   // The public USGS endpoint is an ArcGIS MapServer, not a TMS service.
   const imageryProvider = await Cesium.ArcGisMapServerImageryProvider.fromUrl(USGS_IMAGERY_URL, { credit: new Cesium.Credit(USGS_ATTRIBUTION), enablePickFeatures: false });
   const viewer = new Cesium.Viewer("cesium-container", { baseLayer: new Cesium.ImageryLayer(imageryProvider), terrainProvider: new Cesium.EllipsoidTerrainProvider(), animation: false, timeline: false, baseLayerPicker: false, geocoder: false, homeButton: false, sceneModePicker: false, navigationHelpButton: false, fullscreenButton: false, infoBox: false, selectionIndicator: false, shouldAnimate: false, creditContainer: document.getElementById("map-credit") ?? undefined });
   viewerRef.current = viewer;
   viewer.scene.globe.depthTestAgainstTerrain = false;
   if (viewer.scene.skyAtmosphere) viewer.scene.skyAtmosphere.show = true;
   viewer.camera.setView({ destination: Cesium.Rectangle.fromDegrees(US_OVERVIEW_BOUNDS.west, US_OVERVIEW_BOUNDS.south, US_OVERVIEW_BOUNDS.east, US_OVERVIEW_BOUNDS.north) });
   locations.forEach(location => {
    const entity = viewer.entities.add({ id: location.id, name: `${location.name} — ${location.city}`, position: Cesium.Cartesian3.fromDegrees(location.longitude, location.latitude, 50), billboard: { image: makeMarker(location.city, false), width: 56, height: 72, verticalOrigin: Cesium.VerticalOrigin.BOTTOM, scale: 1, disableDepthTestDistance: Number.POSITIVE_INFINITY }, label: { text: location.city.toUpperCase(), font: "600 11px Inter, sans-serif", fillColor: Cesium.Color.WHITE, outlineColor: Cesium.Color.fromCssColorString("#13100e"), outlineWidth: 4, style: Cesium.LabelStyle.FILL_AND_OUTLINE, pixelOffset: new Cesium.Cartesian2(0, -82), verticalOrigin: Cesium.VerticalOrigin.BOTTOM, disableDepthTestDistance: Number.POSITIVE_INFINITY } });
    entitiesRef.current.set(location.id, entity);
   });
   const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
   handlerRef.current = handler;
   handler.setInputAction((click: { position: import("cesium").Cartesian2 }) => { const picked = viewer.scene.pick(click.position); if (Cesium.defined(picked) && picked.id?.id) { const match = locations.find(l => l.id === picked.id.id); if (match) handle.flyToLocation(match); } }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
   const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
   let detailLayer: import("cesium").ImageryLayer | undefined;
   const clearDetailLayer = () => { if (detailLayer) viewer.imageryLayers.remove(detailLayer, true); detailLayer = undefined; };
   const showDetailLayer = (location: PizzaLocation) => {
    clearDetailLayer();
    if (location.imagery?.preferredLayer !== "usgs-naip-plus") return;
    const provider = new Cesium.WebMapServiceImageryProvider({ url: USGS_NAIP_PLUS_WMS_URL, layers: "0", parameters: { format: "image/jpeg", transparent: false }, credit: new Cesium.Credit(USGS_ATTRIBUTION) });
    detailLayer = viewer.imageryLayers.addImageryProvider(provider);
    detailLayer.alpha = 1;
   };
   const finishFlight = (location: PizzaLocation) => { window.setTimeout(() => { onImageryLoadingChange(false); onFlightComplete(location); }, reduced ? 0 : 350); };
   const flyToLocation = (location: PizzaLocation) => { viewer.camera.cancelFlight(); flightRef.current = location; onImageryLoadingChange(true); showDetailLayer(location); viewer.camera.flyTo({ destination: locationDestination(location, Cesium), orientation: locationOrientation(location), duration: durationForFlight(reduced), complete: () => finishFlight(location), cancel: () => { flightRef.current = null; onImageryLoadingChange(false); } }); };
   const resetToUSOverview = () => { viewer.camera.cancelFlight(); clearDetailLayer(); onImageryLoadingChange(false); viewer.camera.flyTo({ destination: Cesium.Rectangle.fromDegrees(US_OVERVIEW_BOUNDS.west, US_OVERVIEW_BOUNDS.south, US_OVERVIEW_BOUNDS.east, US_OVERVIEW_BOUNDS.north), duration: durationForFlight(reduced) }); };
   const handle = { flyToLocation, resetToUSOverview }; onReady(handle);
  } catch (error) { console.warn("Cesium initialization failed", error); onError(); } })();
  return () => {
   disposed = true;
   const handler = handlerRef.current;
   if (handler && !handler.isDestroyed()) handler.destroy();
   handlerRef.current = undefined;
   const viewer = viewerRef.current;
   if (viewer && !viewer.isDestroyed()) viewer.destroy();
   viewerRef.current = undefined;
  };
 }, [locations, onError, onFlightComplete, onReady]);
 useEffect(() => { void import("cesium").then(Cesium => { entitiesRef.current.forEach((entity, id) => { const active = selected?.id === id; if (entity.billboard) entity.billboard.scale = new Cesium.ConstantProperty(active ? 1.18 : selected ? .88 : 1); if (entity.label) entity.label.show = new Cesium.ConstantProperty(!selected || active); }); }); }, [selected]);
 useEffect(() => { if (!command || !viewerRef.current) return; if (command.type === "overview") { const CesiumPromise = import("cesium"); CesiumPromise.then(Cesium => viewerRef.current?.camera.flyTo({ destination: Cesium.Rectangle.fromDegrees(US_OVERVIEW_BOUNDS.west, US_OVERVIEW_BOUNDS.south, US_OVERVIEW_BOUNDS.east, US_OVERVIEW_BOUNDS.north), duration: durationForFlight(window.matchMedia("(prefers-reduced-motion: reduce)").matches) })); } else { const entity = entitiesRef.current.get(command.location.id); if (entity) { const CesiumPromise = import("cesium"); CesiumPromise.then(Cesium => viewerRef.current?.camera.flyTo({ destination: locationDestination(command.location, Cesium), orientation: locationOrientation(command.location), duration: durationForFlight(window.matchMedia("(prefers-reduced-motion: reduce)").matches), complete: () => onFlightComplete(command.location) })); } } }, [command, onFlightComplete]);
 return <><div id="cesium-container" className="cesium-map" aria-label="Interactive 3D map of Tandoori Pizza locations" /><div id="map-credit" className="map-credit" /></>;
}
function makeMarker(label: string, active: boolean) { const color = active ? "#f46c2d" : "#d84320"; const canvas = document.createElement("canvas"); canvas.width = 112; canvas.height = 144; const ctx = canvas.getContext("2d"); if (!ctx) return ""; ctx.shadowColor = "rgba(0,0,0,.55)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 6; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(56, 51, 37, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(36, 78); ctx.lineTo(56, 126); ctx.lineTo(76, 78); ctx.fill(); ctx.shadowColor = "transparent"; ctx.fillStyle = "white"; ctx.font = "700 26px Arial"; ctx.textAlign = "center"; ctx.fillText("TP", 56, 60); return canvas.toDataURL(); }
