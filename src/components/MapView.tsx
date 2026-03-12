'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { formatCents } from '@/types';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  price: number; // cents
  label?: string;
  selected?: boolean;
}

interface MapViewProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: MapMarker[];
  onMarkerClick?: (markerId: string) => void;
  onBoundsChange?: (bounds: {
    ne: { lat: number; lng: number };
    sw: { lat: number; lng: number };
  }) => void;
  className?: string;
}

/**
 * MapView wrapper for Mapbox GL JS.
 *
 * Renders a container div with id="map" that Mapbox can mount into.
 * Actual Mapbox initialization requires a MAPBOX_TOKEN env variable
 * and the mapbox-gl package. This component provides the wrapper
 * structure, marker overlay UI, and typed props for integration.
 *
 * To initialize Mapbox, install `mapbox-gl` and call:
 *   mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
 *   new mapboxgl.Map({ container: 'mapbox-container', ... });
 */
export default function MapView({
  center = { lat: 39.8283, lng: -98.5795 }, // Center of US
  zoom = 4,
  markers = [],
  onMarkerClick,
  onBoundsChange,
  className,
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    // Mapbox initialization would happen here when the token is available.
    // Example:
    //
    // import mapboxgl from 'mapbox-gl';
    // mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
    //
    // const map = new mapboxgl.Map({
    //   container: mapContainerRef.current!,
    //   style: 'mapbox://styles/mapbox/outdoors-v12',
    //   center: [center.lng, center.lat],
    //   zoom,
    // });
    //
    // map.on('moveend', () => {
    //   const bounds = map.getBounds();
    //   onBoundsChange?.({
    //     ne: { lat: bounds.getNorthEast().lat, lng: bounds.getNorthEast().lng },
    //     sw: { lat: bounds.getSouthWest().lat, lng: bounds.getSouthWest().lng },
    //   });
    // });
    //
    // mapInstanceRef.current = map;
    // return () => map.remove();

    return () => {
      mapInstanceRef.current = null;
    };
  }, [center.lat, center.lng, zoom, onBoundsChange]);

  return (
    <div className={cn('relative w-full h-full min-h-[400px] rounded-xl overflow-hidden', className)}>
      {/* Map container */}
      <div
        ref={mapContainerRef}
        id="mapbox-container"
        className="absolute inset-0 bg-gray-100"
        data-center-lat={center.lat}
        data-center-lng={center.lng}
        data-zoom={zoom}
      >
        {/* Placeholder when Mapbox is not initialized */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-forest-50/50">
          <svg className="h-16 w-16 text-forest-200 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="10" r="3" />
            <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 7 8 11.7z" />
          </svg>
          <p className="text-sm text-forest-400 font-medium">Map loads here</p>
          <p className="text-xs text-forest-300 mt-1">Requires Mapbox token</p>
        </div>
      </div>

      {/* Price marker overlays (rendered as HTML; in production these would be Mapbox markers) */}
      {markers.length > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {markers.map((marker) => (
            <button
              key={marker.id}
              onClick={() => onMarkerClick?.(marker.id)}
              className={cn(
                'pointer-events-auto absolute transform -translate-x-1/2 -translate-y-full',
                'px-2.5 py-1 rounded-full text-xs font-bold shadow-md transition-all',
                'hover:scale-110 hover:z-10',
                marker.selected
                  ? 'bg-forest-800 text-white scale-110 z-10'
                  : 'bg-white text-gray-900 hover:bg-brand-50'
              )}
              style={{
                // In production, these positions would be calculated by Mapbox's projection.
                // For the placeholder, distribute markers visually.
                left: `${((marker.lng + 130) / 60) * 100}%`,
                top: `${((50 - marker.lat) / 30) * 100}%`,
              }}
              aria-label={`${marker.label ?? 'RV'} - ${formatCents(marker.price)} per night`}
            >
              {formatCents(marker.price)}
              {/* Pointer triangle */}
              <span
                className={cn(
                  'absolute left-1/2 -translate-x-1/2 top-full w-0 h-0',
                  'border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px]',
                  marker.selected ? 'border-t-forest-800' : 'border-t-white'
                )}
              />
            </button>
          ))}
        </div>
      )}

      {/* Map controls placeholder */}
      <div className="absolute top-4 right-4 flex flex-col gap-1 z-10">
        <button
          className="h-8 w-8 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          aria-label="Zoom in"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
        </button>
        <button
          className="h-8 w-8 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          aria-label="Zoom out"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* "Search this area" button */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <button className="bg-white rounded-full shadow-md px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-2">
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Search this area
        </button>
      </div>
    </div>
  );
}
