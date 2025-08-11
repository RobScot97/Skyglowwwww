'use client';

import { DayForecast } from '@/lib/types';
import { formatTime, formatDate } from '@/lib/utils';

interface DayForecastCardProps {
  forecast: DayForecast;
  isToday?: boolean;
}

export default function DayForecastCard({ forecast, isToday = false }: DayForecastCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-orange-100 hover:border-orange-200 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">
            {isToday ? 'Oggi' : formatDate(forecast.date)}
          </h3>
          <p className="text-sm text-gray-500">
            {new Date(forecast.date).toLocaleDateString('it-IT', { weekday: 'short' })}
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        {/* Alba */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌅</span>
            <span className="text-sm font-medium text-gray-700">Alba</span>
          </div>
          <div className="text-right">
            <div className="font-semibold text-gray-900">
              {formatTime(forecast.sunrise)}
            </div>
            <div className="flex items-center gap-1 justify-end">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: forecast.sunriseScore.color }}
              ></div>
              <span className="text-xs text-gray-600">
                {forecast.sunriseScore.label}
              </span>
            </div>
          </div>
        </div>
        
        {/* Tramonto */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌇</span>
            <span className="text-sm font-medium text-gray-700">Tramonto</span>
          </div>
          <div className="text-right">
            <div className="font-semibold text-gray-900">
              {formatTime(forecast.sunset)}
            </div>
            <div className="flex items-center gap-1 justify-end">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: forecast.sunsetScore.color }}
              ></div>
              <span className="text-xs text-gray-600">
                {forecast.sunsetScore.label}
              </span>
            </div>
          </div>
        </div>
        
        {/* Golden Hour */}
        <div className="pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-500 mb-1">Golden Hour</div>
          <div className="text-xs text-gray-700">
            🌄 {formatTime(forecast.goldenHourMorningStart)} - {formatTime(forecast.goldenHourMorningEnd)}
          </div>
          <div className="text-xs text-gray-700">
            🌆 {formatTime(forecast.goldenHourEveningStart)} - {formatTime(forecast.goldenHourEveningEnd)}
          </div>
        </div>
        
        {/* Blue Hour */}
        <div className="pt-1">
          <div className="text-xs text-gray-500 mb-1">Blue Hour</div>
          <div className="text-xs text-gray-700">
            🌌 {formatTime(forecast.blueHourStart)} - {formatTime(forecast.blueHourEnd)}
          </div>
        </div>
      </div>
    </div>
  );
}

