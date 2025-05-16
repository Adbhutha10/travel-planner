import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { MapActivity } from '../types';

// Import Leaflet properly (both CSS and JS)
import 'leaflet/dist/leaflet.css';

// Define Leaflet type for TypeScript
declare global {
  interface Window {
    L: any;
  }
}

interface MapViewProps {
  activities: MapActivity[];
  destination: string;
  dayTitle?: string;
}

const MapView: React.FC<MapViewProps> = ({ activities, destination, dayTitle }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const markers = useRef<any[]>([]);
  const { colors } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fallbackMode, setFallbackMode] = useState<boolean>(false);
  const [leafletLoaded, setLeafletLoaded] = useState<boolean>(false);

  // Check if Leaflet is available on mount
  useEffect(() => {
    // Check if Leaflet is already available
    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    // If not, create a script tag to load it
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
    script.integrity = 'sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==';
    script.crossOrigin = '';
    script.async = true;
    
    script.onload = () => {
      console.log('Leaflet loaded successfully');
      setLeafletLoaded(true);
    };
    
    script.onerror = (e) => {
      console.error('Error loading Leaflet:', e);
      setFallbackMode(true);
    };
    
    document.head.appendChild(script);
    
    return () => {
      // Cleanup if needed
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Helper function to get coordinates from address (mock implementation)
  // In a real app, you would use a geocoding service like Google Maps Geocoding API
  const getCoordinates = async (address: string): Promise<[number, number] | null> => {
    // This is a mock implementation - in a real app, you would use a geocoding API
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return mock coordinates based on some common destinations
    // In a real app, these would come from the geocoding API
    const mockCoordinates: Record<string, [number, number]> = {
      'Paris': [48.8566, 2.3522],
      'Tokyo': [35.6762, 139.6503],
      'New York': [40.7128, -74.0060],
      'London': [51.5074, -0.1278],
      'Rome': [41.9028, 12.4964],
      'Sydney': [-33.8688, 151.2093],
      'Eiffel Tower': [48.8584, 2.2945],
      'Louvre Museum': [48.8606, 2.3376],
      'Tokyo Tower': [35.6586, 139.7454],
      'Times Square': [40.7580, -73.9855],
      'Central Park': [40.7812, -73.9665],
      'Big Ben': [51.5007, -0.1246],
      'Colosseum': [41.8902, 12.4922],
      'Sydney Opera House': [-33.8568, 151.2153],
      'Australia': [-25.2744, 133.7751],
      'Australia City Center': [-33.8688, 151.2093] // Using Sydney coordinates as default
    };
    
    // Try exact match
    if (mockCoordinates[address]) {
      return mockCoordinates[address];
    }
    
    // Try to find a partial match
    for (const [key, coords] of Object.entries(mockCoordinates)) {
      if (address.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(address.toLowerCase())) {
        return coords;
      }
    }
    
    // If no match found, return coordinates slightly offset from the destination
    // This ensures activities without specific locations still appear on the map
    if (mockCoordinates[destination]) {
      const baseCoords = mockCoordinates[destination];
      // Add small random offset
      return [
        baseCoords[0] + (Math.random() - 0.5) * 0.01,
        baseCoords[1] + (Math.random() - 0.5) * 0.01
      ];
    }
    
    // Default to a central point if no match found
    return [0, 0];
  };

  // Initialize map when Leaflet is loaded and destination changes
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return;
    
    const initializeMap = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get Leaflet from window
        const L = window.L;
        
        if (!L) {
          console.error('Leaflet not available');
          setFallbackMode(true);
          setLoading(false);
          return;
        }

        // If map already exists, clean it up
        if (leafletMap.current) {
          leafletMap.current.remove();
          leafletMap.current = null;
          markers.current = [];
        }
        
        // Get destination coordinates
        const destinationCoords = await getCoordinates(destination);
        if (!destinationCoords) {
          setError(`Could not find coordinates for ${destination}`);
          setLoading(false);
          return;
        }
        
        // Create map centered on destination
        const map = L.map(mapRef.current).setView(destinationCoords, 13);
        leafletMap.current = map;
        
        // Add tile layer (map imagery)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Create icon for destination marker
        const destinationIcon = L.divIcon({
          className: 'destination-marker',
          html: `<div class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white text-2xl shadow-lg">📍</div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 40]
        });
        
        // Add destination marker
        const destinationMarker = L.marker(destinationCoords, {
          icon: destinationIcon
        }).addTo(map);
        
        destinationMarker.bindPopup(`<b>${destination}</b><br>Your destination`);
        markers.current.push(destinationMarker);
        
        // Add activity markers
        for (let i = 0; i < activities.length; i++) {
          const activity = activities[i];
          
          // Skip activities without a title
          if (!activity.title) continue;
          
          // Generate location from title if not provided
          const location = activity.location || activity.title;
          const coords = await getCoordinates(location);
          
          if (!coords) continue;
          
          // Create icon for activity marker
          const activityIcon = L.divIcon({
            className: 'activity-marker',
            html: `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white font-bold shadow-lg">${activity.index || '•'}</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32]
          });
          
          const marker = L.marker(coords, {
            icon: activityIcon
          }).addTo(map);
          
          marker.bindPopup(`<b>${activity.title}</b>${activity.time ? `<br>Time: ${activity.time}` : ''}`);
          markers.current.push(marker);
        }
        
        // If we have multiple markers, fit bounds to include all
        if (markers.current.length > 1) {
          const group = L.featureGroup(markers.current);
          map.fitBounds(group.getBounds().pad(0.2));
        }
        
        // Force a resize to ensure the map renders correctly
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
        
      } catch (err) {
        console.error('Error initializing map:', err);
        setFallbackMode(true);
        setError('Failed to initialize map');
      } finally {
        setLoading(false);
      }
    };
    
    initializeMap();
    
    // Cleanup function
    return () => {
      if (leafletMap.current) {
        try {
          leafletMap.current.remove();
        } catch (e) {
          console.error('Error cleaning up map:', e);
        }
        leafletMap.current = null;
      }
    };
  }, [destination, activities, leafletLoaded]);

  // Generate a simple SVG map as ultimate fallback
  const generateFallbackMapSvg = (): string => {
    const width = 400; // Reduced width to fit better
    const height = 280; // Increased height slightly
    
    // Create activity markers with better spacing
    const activityMarkers = activities.map((activity, i) => {
      // Spread markers more evenly across the map
      const xOffset = (i % 3) * 100 - 100;
      const yOffset = Math.floor(i / 3) * 60 - 30;
      
      // Center markers with destination in the middle
      const x = 200 + xOffset;
      const y = 120 + yOffset;
      
      return `<circle cx="${x}" cy="${y}" r="12" fill="green" />
              <text x="${x}" y="${y + 5}" text-anchor="middle" fill="white" font-weight="bold" font-size="12">${i+1}</text>`;
    }).join('');

    // Create a visible background with border to ensure the map is visible
    return `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
        <rect width="${width}" height="${height}" fill="#e9eaee" stroke="#ccc" stroke-width="1" />
        <circle cx="200" cy="120" r="18" fill="blue" />
        <text x="200" y="127" text-anchor="middle" fill="white" font-size="14">📍</text>
        ${activityMarkers}
        <text x="200" y="210" text-anchor="middle" fill="#555" font-size="14">Map visualization for ${destination}</text>
      </svg>
    `;
  };

  const renderFallbackMap = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
          {/* SVG Map Container with better visibility */}
          <div className="mb-6 border border-gray-200 rounded-lg p-2 bg-gray-50">
            <div className="w-full h-64" dangerouslySetInnerHTML={{ 
              __html: generateFallbackMapSvg()
            }} />
          </div>
          
          {/* Destination header */}
          <h3 className="text-xl font-semibold mb-4">{destination}</h3>
          
          {/* Activities list */}
          <div className="flex flex-wrap justify-center gap-2 mb-5">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs mr-2">
                  {index + 1}
                </span>
                <span className="text-sm truncate max-w-[150px]" title={activity.title}>
                  {activity.title}
                </span>
              </div>
            ))}
          </div>
          
          <p className="text-gray-500 text-sm mb-4">
            Interactive map couldn't be loaded. This is a simplified visualization of your activities.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`${colors.card} rounded-lg shadow-md overflow-hidden h-full flex flex-col`}>
      {dayTitle && (
        <div className={`p-3 ${colors.secondary} border-b ${colors.border} z-10`}>
          <h3 className={`font-semibold ${colors.text} truncate`}>{dayTitle}</h3>
        </div>
      )}
      
      <div className="relative flex-grow">
        {/* Map container */}
        <div 
          ref={mapRef} 
          className="w-full h-full z-10"
          style={{ background: '#f0f0f0', minHeight: '300px' }}
        >
          {fallbackMode && renderFallbackMap()}
        </div>
        
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 z-20">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-2"></div>
              <p className="text-gray-700">Loading map...</p>
            </div>
          </div>
        )}
        
        {/* Error overlay */}
        {error && !fallbackMode && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-90 z-20">
            <div className="text-center p-4">
              <p className="text-red-600 font-medium mb-2">❌ {error}</p>
              <p className="text-gray-700 text-sm">
                Please check your internet connection or try again later.
              </p>
              <button 
                onClick={() => setFallbackMode(true)} 
                className="mt-3 px-3 py-1 bg-blue-500 text-white text-sm rounded"
              >
                Show simplified map
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Legend */}
      {!fallbackMode && (
        <div className={`p-3 ${colors.border} border-t flex flex-wrap gap-3 z-10`}>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs mr-2">📍</div>
            <span className={`text-sm ${colors.textSecondary}`}>Destination</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs mr-2">•</div>
            <span className={`text-sm ${colors.textSecondary}`}>Activities</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView; 