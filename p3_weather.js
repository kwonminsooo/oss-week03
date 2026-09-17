// P3. 날씨 API 호출 — p3_weather.js
//
// 상황
//   오늘 만드는 프로그램은 node main.js Busan 처럼 도시 이름을 받아
//   그 도시의 현재 날씨와 3일 예보를 찍는 CLI 다. API 는 Open-Meteo (키 없음, 무료).
//   순서는 두 단계다.
//     1. 도시 이름 → 위도·경도          (geocoding-api.open-meteo.com/v1/search)   ← geocode(), 주어짐
//     2. 위도·경도 → 현재 날씨 + 일별 예보 (api.open-meteo.com/v1/forecast)        ← 여기서 만든다
//   HTTP 호출은 전부 http.js 의 getJSON(url) 로 한다. fetch 를 직접 부르지 않는다.
//
// 이 파일에서 할 일 (P3)
//   fetchForecastRaw() 와 parseForecast() 두 함수를 채운다. 둘을 합치지 말 것.
//   "API 를 부르는 일"과 "응답을 추리는 일"을 따로 두어야, 나중에(P6) 저장해 둔 응답으로
//   네트워크 없이 parseForecast() 만 다시 돌릴 수 있다.
//   main.js 의 출력 부분까지 채우면 P3 끝. 기대 출력은 README 맨 위.
//
// 힌트
//   URL 을 먼저 브라우저 주소창에서 만들어 보자. open-meteo.com/en/docs 에서 체크박스를 켜면
//   페이지 아래에 URL 이 생긴다. 그걸 붙여넣어 JSON 이 보이면, 그 파라미터를 searchParams.set 으로 옮긴다.
//   parseForecast 를 쓰기 전에 console.log(JSON.stringify(raw, null, 2)) 로 응답 모양을 한 번 보자.
//
// 커밋 메시지: p3: forecast cli

import { getJSON } from "./http.js";

// 주어짐. 도시 이름 → { name, country, latitude, longitude }.
// 결과가 없으면 응답에 results 키 자체가 없다. 그래서 ?.[0] 로 읽고, 없으면 에러를 던진다.
export async function geocode(name) {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", name);
  url.searchParams.set("count", 1);
  const data = await getJSON(url);
  const hit = data.results?.[0];                        // 못 찾으면 undefined
  if (!hit) throw new Error(`Unknown place: ${name}`);
  const { latitude, longitude, country } = hit;
  return { name: hit.name, country, latitude, longitude };
}

// P3 (1/2). 예보 API 를 부르고 응답 객체를 그대로 돌려준다 (가공하지 않는다 — P6 에서 이 원본을 파일로 저장).
// 보낼 파라미터:
//   latitude, longitude
//   current=temperature_2m,weather_code
//   daily=temperature_2m_max,temperature_2m_min,weather_code
//   timezone=auto
//   forecast_days=<days>
// 문서: https://open-meteo.com/en/docs
export async function fetchForecastRaw({ latitude, longitude }, days = 3) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  // TODO: 위 파라미터를 url.searchParams.set 으로 하나씩 넣는다
  // TODO: return await getJSON(url)
}

// P3 (2/2). 원본 응답에서 main.js 가 찍을 것만 추려 작은 객체로 만든다.
// 응답(raw)의 생김새:
//   raw.current        → { time, interval, temperature_2m, weather_code }
//   raw.current_units  → { temperature_2m: "°C", ... }        단위는 여기서 읽는다. "°C" 를 하드코딩하지 말 것
//   raw.daily          → { time: [...], temperature_2m_max: [...], temperature_2m_min: [...], weather_code: [...] }
//   raw.daily 의 배열들은 같은 인덱스가 같은 날이다: i 번째 날 = time[i], max[i], min[i], code[i]
//
// 돌려줄 모양:
//   {
//     now:  { temp: 26.1, unit: "°C", code: 2 },
//     days: [ { date: "2026-09-17", min: 22.1, max: 28.4, code: 2 }, ... ]
//   }
export function parseForecast(raw) {
  // TODO
}

// 두 단계를 묶은 것. P4, P5, P6 가 이 함수를 그대로 가져다 쓴다. 건드릴 필요 없음.
export async function forecast(place, days = 3) {
  const raw = await fetchForecastRaw(place, days);
  return parseForecast(raw);
}
