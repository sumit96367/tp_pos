"use client";

import { useRef, useEffect, useState, useMemo } from 'react';
import Map, { Source, Layer, MapRef, Marker, NavigationControl } from 'react-map-gl/maplibre';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
}

interface MapLibreMapProps {
  locations: Location[];
  selectedId?: string | null;
  onSelect: (location: Location) => void;
}

const INITIAL_VIEW_STATE = {
  longitude: -121.5,
  latitude: 37.8,
  zoom: 8.5,
  pitch: 60,
  bearing: 10
};

export function MapLibreMap({ locations, selectedId, onSelect }: MapLibreMapProps) {
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    if (selectedId && mapRef.current) {
      const location = locations.find(loc => loc.id === selectedId);
      if (location) {
        mapRef.current.flyTo({
          center: [location.longitude, location.latitude],
          zoom: 17,
          pitch: 0,
          bearing: 0,
          duration: 2000
        });
      }
    }
  }, [selectedId, locations]);

  const mapStyle = useMemo(() => ({
    version: 8 as const,
    sources: {
      'esri-imagery': {
        type: 'raster' as const,
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      },
      'esri-reference': {
        type: 'raster' as const,
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256
      },
      'esri-roads': {
        type: 'raster' as const,
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256
      },
      'terrain-source': {
        type: 'raster-dem' as const,
        tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
        encoding: 'terrarium' as const,
        tileSize: 256
      }
    },
    layers: [
      {
        id: 'imagery-layer',
        type: 'raster' as const,
        source: 'esri-imagery',
        minzoom: 0,
        maxzoom: 22
      },
      {
        id: 'roads-layer',
        type: 'raster' as const,
        source: 'esri-roads',
        minzoom: 0,
        maxzoom: 22
      },
      {
        id: 'reference-layer',
        type: 'raster' as const,
        source: 'esri-reference',
        minzoom: 0,
        maxzoom: 22
      }
    ],
    terrain: {
      source: 'terrain-source',
      exaggeration: 1.5
    }
  }), []);

  return (
    <div className="absolute inset-0 w-full h-full">
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle={mapStyle}
        interactiveLayerIds={['imagery-layer']}
        maxZoom={18}
      >
        <NavigationControl position="bottom-right" />

        {locations.map((loc) => {
          if (loc.latitude === 0 && loc.longitude === 0) return null;

          const isSelected = selectedId === loc.id;

          return (
            <Marker
              key={loc.id}
              longitude={loc.longitude}
              latitude={loc.latitude}
              anchor="bottom"
              onClick={e => {
                e.originalEvent.stopPropagation();
                onSelect(loc);
              }}
            >
              <div
                className={`flex flex-col items-center transition-transform duration-300 cursor-pointer ${isSelected ? 'scale-125' : 'scale-100 hover:scale-110'}`}
              >
                <div className={`px-2 py-1 rounded shadow-lg text-xs font-bold mb-1 whitespace-nowrap ${isSelected ? 'bg-coral text-white' : 'bg-white text-navy'}`}>
                  {loc.name.toUpperCase()}
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${isSelected ? 'bg-coral' : 'bg-navy'}`}>
                  <MapPin className="text-white w-5 h-5" />
                </div>
              </div>
            </Marker>
          );
        })}
      </Map>
    </div>
  );
}
