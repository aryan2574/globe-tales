export interface WeatherResponse {
  latitude: number;
  longitude: number;
  current: {
    temperature_2m: number;
    weather_code: number;
  };
}
