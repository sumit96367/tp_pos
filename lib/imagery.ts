/** Public USGS National Map imagery. Attribution is kept visible in Cesium's credit UI. */
export const USGS_IMAGERY_URL = "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer";
export const USGS_NAIP_PLUS_WMS_URL = "https://imagery.nationalmap.gov/arcgis/services/USGSNAIPPlus/ImageServer/WMSServer";
export const USGS_ATTRIBUTION = "USGS, The National Map — NAIP / High Resolution Orthoimagery";

/** The imagery provider configuration is kept here so a location can change sources without changing the map UI. */
export const imageryLayerConfig = {
  overview: { id: "usgs-imagery-only", url: USGS_IMAGERY_URL, detail: "Cached multi-scale orthoimagery" },
  detail: { id: "usgs-naip-plus", url: USGS_NAIP_PLUS_WMS_URL, detail: "Dynamic NAIP Plus / High Resolution Orthoimagery" }
} as const;
