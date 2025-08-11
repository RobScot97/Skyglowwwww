import { SkyQualityScore, DayForecast, NextSunEvent, WeatherData } from './types';

export function calculateSkyQualityScore(
  cloudcover: number,
  precipitationProbability: number,
  humidity: number,
  visibility: number
): SkyQualityScore {
  // Algoritmo per calcolare il punteggio qualità cielo
  // Basato sui parametri meteo: meno nuvole, meno pioggia, meno umidità, più visibilità = punteggio migliore
  
  let score = 100;
  
  // Penalità per copertura nuvolosa (0-100%)
  score -= cloudcover * 0.6;
  
  // Penalità per probabilità di pioggia (0-100%)
  score -= precipitationProbability * 0.8;
  
  // Penalità per umidità alta (sopra il 70%)
  if (humidity > 70) {
    score -= (humidity - 70) * 0.3;
  }
  
  // Penalità per visibilità bassa (sotto i 10km)
  if (visibility < 10000) {
    score -= (10000 - visibility) / 100 * 0.2;
  }
  
  // Assicuriamoci che il punteggio sia tra 0 e 100
  score = Math.max(0, Math.min(100, score));
  
  let label: 'Poor' | 'Fair' | 'Good' | 'Great';
  let color: string;
  
  if (score >= 80) {
    label = 'Great';
    color = '#10b981'; // green-500
  } else if (score >= 60) {
    label = 'Good';
    color = '#f59e0b'; // amber-500
  } else if (score >= 40) {
    label = 'Fair';
    color = '#f97316'; // orange-500
  } else {
    label = 'Poor';
    color = '#ef4444'; // red-500
  }
  
  return {
    score: Math.round(score),
    label,
    color
  };
}

export function calculateGoldenBlueHours(sunrise: string, sunset: string) {
  const sunriseTime = new Date(sunrise);
  const sunsetTime = new Date(sunset);
  
  // Blue Hour: 30 minuti prima dell'alba e 30 minuti dopo il tramonto
  const blueHourMorningStart = new Date(sunriseTime.getTime() - 30 * 60 * 1000);
  const blueHourMorningEnd = sunriseTime;
  const blueHourEveningStart = sunsetTime;
  const blueHourEveningEnd = new Date(sunsetTime.getTime() + 30 * 60 * 1000);
  
  // Golden Hour: 1 ora dopo l'alba e 1 ora prima del tramonto
  const goldenHourMorningStart = sunriseTime;
  const goldenHourMorningEnd = new Date(sunriseTime.getTime() + 60 * 60 * 1000);
  const goldenHourEveningStart = new Date(sunsetTime.getTime() - 60 * 60 * 1000);
  const goldenHourEveningEnd = sunsetTime;
  
  return {
    blueHourMorningStart: blueHourMorningStart.toISOString(),
    blueHourMorningEnd: blueHourMorningEnd.toISOString(),
    blueHourEveningStart: blueHourEveningStart.toISOString(),
    blueHourEveningEnd: blueHourEveningEnd.toISOString(),
    goldenHourMorningStart: goldenHourMorningStart.toISOString(),
    goldenHourMorningEnd: goldenHourMorningEnd.toISOString(),
    goldenHourEveningStart: goldenHourEveningStart.toISOString(),
    goldenHourEveningEnd: goldenHourEveningEnd.toISOString()
  };
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
}

export function calculateCountdown(targetTime: string): string {
  const now = new Date();
  const target = new Date(targetTime);
  const diff = target.getTime() - now.getTime();
  
  if (diff <= 0) {
    return 'Passato';
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

export function getNextSunEvent(dayForecast: DayForecast): NextSunEvent {
  const now = new Date();
  const sunrise = new Date(dayForecast.sunrise);
  const sunset = new Date(dayForecast.sunset);
  
  // Se siamo prima dell'alba, il prossimo evento è l'alba
  if (now < sunrise) {
    return {
      type: 'sunrise',
      time: formatTime(dayForecast.sunrise),
      countdown: calculateCountdown(dayForecast.sunrise),
      score: dayForecast.sunriseScore
    };
  }
  // Se siamo dopo l'alba ma prima del tramonto, il prossimo evento è il tramonto
  else if (now < sunset) {
    return {
      type: 'sunset',
      time: formatTime(dayForecast.sunset),
      countdown: calculateCountdown(dayForecast.sunset),
      score: dayForecast.sunsetScore
    };
  }
  // Se siamo dopo il tramonto, il prossimo evento è l'alba del giorno successivo
  else {
    // Per ora restituiamo il tramonto di oggi, in una implementazione completa
    // dovremmo calcolare l'alba del giorno successivo
    return {
      type: 'sunset',
      time: formatTime(dayForecast.sunset),
      countdown: 'Passato',
      score: dayForecast.sunsetScore
    };
  }
}

export function getWeatherDataForTime(weatherData: WeatherData, targetTime: string): {
  cloudcover: number;
  precipitationProbability: number;
  humidity: number;
  visibility: number;
} {
  const targetDate = new Date(targetTime);
  const targetHour = targetDate.getHours();
  
  // Trova l'indice dell'ora più vicina nei dati meteo
  let closestIndex = 0;
  let minDiff = Infinity;
  
  weatherData.time.forEach((timeStr, index) => {
    const weatherTime = new Date(timeStr);
    const diff = Math.abs(weatherTime.getTime() - targetDate.getTime());
    if (diff < minDiff) {
      minDiff = diff;
      closestIndex = index;
    }
  });
  
  return {
    cloudcover: weatherData.cloudcover[closestIndex] || 0,
    precipitationProbability: weatherData.precipitation_probability[closestIndex] || 0,
    humidity: weatherData.relative_humidity_2m[closestIndex] || 0,
    visibility: weatherData.visibility[closestIndex] || 10000
  };
}

// Funzioni per localStorage
export function saveLocationToStorage(location: { latitude: number; longitude: number; name: string }) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('lastLocation', JSON.stringify(location));
  }
}

export function getLocationFromStorage(): { latitude: number; longitude: number; name: string } | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('lastLocation');
    return stored ? JSON.parse(stored) : null;
  }
  return null;
}

export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

