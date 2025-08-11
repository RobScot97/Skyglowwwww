import { useState, useEffect } from 'react';
import { DayForecast, Location, NextSunEvent } from '@/lib/types';
import { getSunriseSunsetData, getWeatherData } from '@/lib/api';
import { 
  calculateSkyQualityScore, 
  calculateGoldenBlueHours, 
  getWeatherDataForTime,
  getNextSunEvent 
} from '@/lib/utils';

export function useSunData(location: Location | null) {
  const [forecasts, setForecasts] = useState<DayForecast[]>([]);
  const [nextEvent, setNextEvent] = useState<NextSunEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Ottieni i dati meteo per 5 giorni
        const weatherData = await getWeatherData(location.latitude, location.longitude, 5);
        
        // Ottieni i dati di alba/tramonto per i prossimi 5 giorni
        const forecastPromises = [];
        const today = new Date();
        
        for (let i = 0; i < 5; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          const dateString = date.toISOString().split('T')[0];
          
          forecastPromises.push(
            getSunriseSunsetData(location.latitude, location.longitude, dateString)
          );
        }
        
        const sunDataResults = await Promise.all(forecastPromises);
        
        // Combina i dati per creare le previsioni
        const newForecasts: DayForecast[] = sunDataResults.map((sunData, index) => {
          const date = new Date(today);
          date.setDate(today.getDate() + index);
          const dateString = date.toISOString().split('T')[0];
          
          const sunrise = sunData.results.sunrise;
          const sunset = sunData.results.sunset;
          
          // Calcola golden hour e blue hour
          const hours = calculateGoldenBlueHours(sunrise, sunset);
          
          // Ottieni i dati meteo per alba e tramonto
          const sunriseWeather = getWeatherDataForTime(weatherData.hourly, sunrise);
          const sunsetWeather = getWeatherDataForTime(weatherData.hourly, sunset);
          
          // Calcola i punteggi qualità cielo
          const sunriseScore = calculateSkyQualityScore(
            sunriseWeather.cloudcover,
            sunriseWeather.precipitationProbability,
            sunriseWeather.humidity,
            sunriseWeather.visibility
          );
          
          const sunsetScore = calculateSkyQualityScore(
            sunsetWeather.cloudcover,
            sunsetWeather.precipitationProbability,
            sunsetWeather.humidity,
            sunsetWeather.visibility
          );
          
          return {
            date: dateString,
            sunrise,
            sunset,
            blueHourStart: hours.blueHourMorningStart,
            blueHourEnd: hours.blueHourEveningEnd,
            goldenHourMorningStart: hours.goldenHourMorningStart,
            goldenHourMorningEnd: hours.goldenHourMorningEnd,
            goldenHourEveningStart: hours.goldenHourEveningStart,
            goldenHourEveningEnd: hours.goldenHourEveningEnd,
            sunriseScore,
            sunsetScore
          };
        });
        
        setForecasts(newForecasts);
        
        // Calcola il prossimo evento
        if (newForecasts.length > 0) {
          const nextSunEvent = getNextSunEvent(newForecasts[0]);
          setNextEvent(nextSunEvent);
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore sconosciuto');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location]);

  return { forecasts, nextEvent, loading, error };
}

