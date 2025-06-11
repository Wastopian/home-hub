import { ThreatLevel } from '../types';

export interface ThreatData {
  weatherAlerts: string[];
  crimeReports: string[];
  powerOutages: string[];
}

export const fetchWeatherAlerts = async (lat: number, lon: number): Promise<string[]> => {
  const url = `https://api.weather.gov/alerts/active?point=${lat},${lon}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.features || []).map((f: any) => f.properties.headline as string);
  } catch {
    return [];
  }
};

export const fetchCrimeReports = async (lat: number, lon: number): Promise<string[]> => {
  // Example using Crimeometer API
  const apiKey = process.env.CRIME_API_KEY;
  if (!apiKey) return [];
  const now = new Date();
  const past = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // last week
  const url = `https://api.crimeometer.com/v3/incidents/raw-data?lat=${lat}&lon=${lon}&distance=1mi&datetime_ini=${past.toISOString()}&datetime_end=${now.toISOString()}`;
  try {
    const res = await fetch(url, { headers: { 'x-api-key': apiKey } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.incidents || []).map((i: any) => i.incident_offense as string);
  } catch {
    return [];
  }
};

export const fetchPowerOutages = async (_lat: number, _lon: number): Promise<string[]> => {
  // Placeholder for a public outage API
  return [];
};

export const summarizeThreatLevel = (data: ThreatData): ThreatLevel => {
  let score = 0;
  if (data.weatherAlerts.length) score += 2;
  if (data.crimeReports.length > 2) score += 1;
  if (data.powerOutages.length) score += 1;

  if (score >= 3) return 'Severe';
  if (score === 2) return 'High';
  if (score === 1) return 'Moderate';
  return 'Low';
};
