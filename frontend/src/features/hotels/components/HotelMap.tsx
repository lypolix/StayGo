import { useEffect, useRef } from 'react';
import { Box, Text } from '@chakra-ui/react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js/React
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface HotelMapProps {
  latitude: number;
  longitude: number;
  name: string;
  zoom?: number;
  height?: string | number;
  width?: string | number;
  interactive?: boolean;
  className?: string;
}

export const HotelMap = ({
  latitude,
  longitude,
  name,
  zoom = 15,
  height = '100%',
  width = '100%',
  interactive = true,
  className = '',
}: HotelMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    // Initialize the map
    mapRef.current = L.map(mapContainer.current, {
      center: [latitude, longitude],
      zoom,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: interactive,
      dragging: interactive,
      doubleClickZoom: interactive,
      boxZoom: interactive,
      touchZoom: interactive,
      keyboard: interactive,
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapRef.current);

    // Add marker
    markerRef.current = L.marker([latitude, longitude], {
      icon: defaultIcon,
      title: name,
      alt: `${name} location`,
      keyboard: interactive,
      riseOnHover: true,
    }).addTo(mapRef.current);

    // Add popup
    if (name) {
      markerRef.current.bindPopup(`<b>${name}</b><br>${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [latitude, longitude, name, zoom, interactive]);

  // Update map center if coordinates change
  useEffect(() => {
    if (mapRef.current && (mapRef.current.getCenter().lat !== latitude || 
        mapRef.current.getCenter().lng !== longitude)) {
      mapRef.current.setView([latitude, longitude], zoom);
      
      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
      }
    }
  }, [latitude, longitude, zoom]);

  // Update marker popup if name changes
  useEffect(() => {
    if (markerRef.current && name) {
      markerRef.current.setPopupContent(`<b>${name}</b><br>${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
    }
  }, [name, latitude, longitude]);

  return (
    <Box 
      ref={mapContainer} 
      height={height} 
      width={width} 
      className={`hotel-map ${className}`}
      sx={{
        '& .leaflet-container': {
          height: '100%',
          width: '100%',
          borderRadius: '0.5rem',
        },
        '& .leaflet-popup-content-wrapper': {
          borderRadius: '0.375rem',
          boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)',
        },
        '& .leaflet-popup-content': {
          margin: '0.5rem',
          fontSize: '0.875rem',
          lineHeight: '1.25',
        },
        '& .leaflet-popup-tip': {
          boxShadow: 'none',
        },
      }}
    >
      {/* Fallback content in case the map fails to load */}
      <noscript>
        <Box p={4} bg="gray.100" borderRadius="md">
          <Text>Interactive map requires JavaScript to be enabled.</Text>
          <Text mt={2}>
            <strong>Location:</strong> {name} at {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </Text>
        </Box>
      </noscript>
    </Box>
  );
};

export default HotelMap;
