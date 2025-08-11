'use client';

import { useState } from 'react';
import { Location } from '@/lib/types';
import { getCurrentLocation, searchLocation } from '@/lib/api';
import { saveLocationToStorage } from '@/lib/utils';

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
  currentLocation: Location | null;
}

export default function LocationSearch({ onLocationSelect, currentLocation }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const locations = await searchLocation(searchQuery);
      setResults(locations);
      setShowResults(true);
    } catch (error) {
      console.error('Errore nella ricerca:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location: Location) => {
    setQuery(location.name);
    setShowResults(false);
    saveLocationToStorage(location);
    onLocationSelect(location);
  };

  const handleCurrentLocation = async () => {
    setLoading(true);
    try {
      const location = await getCurrentLocation();
      saveLocationToStorage(location);
      onLocationSelect(location);
    } catch (error) {
      console.error('Errore geolocalizzazione:', error);
      alert('Impossibile ottenere la posizione attuale. Assicurati di aver dato il permesso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            placeholder="Cerca una città..."
            className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 bg-white/80 backdrop-blur-sm"
          />
          
          {showResults && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-sm border border-orange-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
              {results.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full px-4 py-3 text-left hover:bg-orange-50 first:rounded-t-xl last:rounded-b-xl transition-colors"
                >
                  <div className="font-medium text-gray-900">{location.name}</div>
                  <div className="text-sm text-gray-500">
                    {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button
          onClick={handleCurrentLocation}
          disabled={loading}
          className="px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
          <span className="hidden sm:inline">GPS</span>
        </button>
      </div>
      
      {currentLocation && (
        <div className="text-sm text-gray-600 mb-4">
          📍 {currentLocation.name}
        </div>
      )}
    </div>
  );
}

