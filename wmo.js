// 주어짐. WMO 날씨 코드 → 영어 단어 — wmo.js
//
// Open-Meteo 는 날씨를 "partly cloudy" 같은 말이 아니라 숫자 코드(weather_code)로 준다.
// 표는 open-meteo.com/en/docs 맨 아래 "WMO Weather interpretation codes" 를 옮긴 것.
// describe(code) 로 쓴다. 표에 없는 코드가 오면 "code 42" 처럼 숫자를 그대로 보여 준다.

export const WMO = {
  0: "clear sky",
  1: "mainly clear", 2: "partly cloudy", 3: "overcast",
  45: "fog", 48: "rime fog",
  51: "light drizzle", 53: "drizzle", 55: "dense drizzle",
  56: "freezing drizzle", 57: "dense freezing drizzle",
  61: "slight rain", 63: "rain", 65: "heavy rain",
  66: "freezing rain", 67: "heavy freezing rain",
  71: "slight snow", 73: "snow", 75: "heavy snow", 77: "snow grains",
  80: "rain showers", 81: "moderate rain showers", 82: "violent rain showers",
  85: "snow showers", 86: "heavy snow showers",
  95: "thunderstorm", 96: "thunderstorm with hail", 99: "thunderstorm with heavy hail",
};

export function describe(code) {
  return WMO[code] ?? `code ${code}`;
}
