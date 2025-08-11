import { SunriseSunsetResponse, OpenMeteoResponse, Location } from './types';

export async function getSunriseSunsetData(
  latitude: number,
  longitude: number,
  date?: string
): Promise<SunriseSunsetResponse> {
  const dateParam = date ? `&date=${date}` : '';
  const url = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0${dateParam}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Errore nel recupero dei dati di alba e tramonto');
  }
  
  return response.json();
}

export async function getWeatherData(
  latitude: number,
  longitude: number,
  forecastDays: number = 5
): Promise<OpenMeteoResponse> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=cloudcover,precipitation_probability,relative_humidity_2m,visibility&forecast_days=${forecastDays}&timezone=auto`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Errore nel recupero dei dati meteo');
  }
  
  return response.json();
}

export async function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalizzazione non supportata'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          name: 'Posizione attuale'
        });
      },
      (error) => {
        reject(new Error('Errore nella geolocalizzazione: ' + error.message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minuti
      }
    );
  });
}

// Funzione per cercare una città (implementazione semplificata)
export async function searchLocation(query: string): Promise<Location[]> {
  // Per ora restituiamo alcune città di esempio
  // In una implementazione reale si userebbe un servizio di geocoding
  const cities: Location[] = [
    { latitude: 45.4642, longitude: 9.1900, name: 'Milano' },
    { latitude: 41.9028, longitude: 12.4964, name: 'Roma' },
    { latitude: 40.8518, longitude: 14.2681, name: 'Napoli' },
    { latitude: 45.0703, longitude: 7.6869, name: 'Torino' },
    { latitude: 44.4949, longitude: 11.3426, name: 'Bologna' },
    { latitude: 43.7696, longitude: 11.2558, name: 'Firenze' },
    { latitude: 45.4384, longitude: 12.3265, name: 'Venezia' },
    { latitude: 38.1157, longitude: 13.3615, name: 'Palermo' },
    { latitude: 37.5079, longitude: 15.0830, name: 'Catania' },
    { latitude: 44.4056, longitude: 8.9463, name: 'Genova' }
  ];
  
  return cities.filter(city => 
    city.name.toLowerCase().includes(query.toLowerCase())
  );
}

