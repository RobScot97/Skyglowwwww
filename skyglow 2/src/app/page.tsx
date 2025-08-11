'use client';

import { useState, useEffect } from 'react';
import { Location } from '@/lib/types';
import { getLocationFromStorage } from '@/lib/utils';
import { useSunData } from '@/hooks/useSunData';
import LocationSearch from '@/components/LocationSearch';
import SunEventCard from '@/components/SunEventCard';
import DayForecastCard from '@/components/DayForecastCard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const [location, setLocation] = useState<Location | null>(null);
  const [showForecast, setShowForecast] = useState(false);
  const { forecasts, nextEvent, loading, error } = useSunData(location);

  useEffect(() => {
    // Carica l'ultima posizione salvata
    const savedLocation = getLocationFromStorage();
    if (savedLocation) {
      setLocation(savedLocation);
    }
  }, []);

  const handleLocationSelect = (newLocation: Location) => {
    setLocation(newLocation);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🌅 Skyglow
          </h1>
          <p className="text-gray-600">
            Orari di alba e tramonto con punteggi qualità cielo
          </p>
        </div>

        {/* Location Search */}
        <LocationSearch 
          onLocationSelect={handleLocationSelect}
          currentLocation={location}
        />

        {/* Loading */}
        {loading && <LoadingSpinner />}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700 text-sm">
              ⚠️ {error}
            </p>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && location && (
          <>
            {/* Next Event Cards */}
            {nextEvent && (
              <div className="mb-8">
                <SunEventCard event={nextEvent} />
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setShowForecast(false)}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                  !showForecast
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
              >
                Oggi
              </button>
              <button
                onClick={() => setShowForecast(true)}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                  showForecast
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
              >
                4 Giorni
              </button>
            </div>

            {/* Content */}
            {forecasts.length > 0 && (
              <div className="space-y-4">
                {showForecast ? (
                  // 4 Days Forecast
                  forecasts.slice(0, 5).map((forecast, index) => (
                    <DayForecastCard 
                      key={forecast.date} 
                      forecast={forecast}
                      isToday={index === 0}
                    />
                  ))
                ) : (
                  // Today's Details
                  forecasts.length > 0 && (
                    <DayForecastCard 
                      forecast={forecasts[0]}
                      isToday={true}
                    />
                  )
                )}
              </div>
            )}
          </>
        )}

        {/* Welcome Message */}
        {!location && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌅</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Benvenuto!
            </h2>
            <p className="text-gray-600 mb-6">
              Cerca una città o usa la tua posizione per iniziare
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pt-6 border-t border-orange-100">
          <p className="text-xs text-gray-500">
            Dati forniti da Sunrise-Sunset.org e Open-Meteo.com
          </p>
        </div>
      </div>
    </div>
  );
}

