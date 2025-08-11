export interface Location {
  latitude: number;
  longitude: number;
  name: string;
}

export interface SunriseSunsetData {
  sunrise: string;
  sunset: string;
  solar_noon: string;
  day_length: string;
  civil_twilight_begin: string;
  civil_twilight_end: string;
  nautical_twilight_begin: string;
  nautical_twilight_end: string;
  astronomical_twilight_begin: string;
  astronomical_twilight_end: string;
}

export interface SunriseSunsetResponse {
  results: SunriseSunsetData;
  status: string;
}

export interface WeatherData {
  cloudcover: number[];
  precipitation_probability: number[];
  relative_humidity_2m: number[];
  visibility: number[];
  time: string[];
}

export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  hourly: WeatherData;
}

export interface SkyQualityScore {
  score: number;
  label: 'Poor' | 'Fair' | 'Good' | 'Great';
  color: string;
}

export interface DayForecast {
  date: string;
  sunrise: string;
  sunset: string;
  blueHourStart: string;
  blueHourEnd: string;
  goldenHourMorningStart: string;
  goldenHourMorningEnd: string;
  goldenHourEveningStart: string;
  goldenHourEveningEnd: string;
  sunriseScore: SkyQualityScore;
  sunsetScore: SkyQualityScore;
}

export interface NextSunEvent {
  type: 'sunrise' | 'sunset';
  time: string;
  countdown: string;
  score: SkyQualityScore;
}

