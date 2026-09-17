// P3 / P6. 진입점 — main.js
//
// 상황
//   node main.js Busan  →  Busan 의 현재 날씨와 3일 예보를 찍는다.
//   도시 이름은 첫 번째 인자. 없으면 "Seoul". --save, --offline 같은 플래그는 따로 모아 둔다 (P6 용).
//   흐름: geocode(이름) → forecast(좌표) → 출력. 앞 둘은 p3_weather.js 에 있다.
//   에러(모르는 도시, 네트워크 등)는 아래 try/catch 하나가 받아서 "Error: ..." 한 줄 + 종료 코드 1.
//   그 부분은 이미 되어 있다. node main.js Zzzzqqq 로 확인해 볼 것.
//
// 할 일 (P3) — 아래 TODO (P3) 자리에 console.log 세 부분
//   1. 첫 줄: 도시, 나라, 좌표.        예) Busan, South Korea (35.10, 129.04)      좌표는 소수 2자리 → toFixed(2)
//   2. 둘째 줄: 현재 기온과 날씨.       예) Now: 26.1°C, partly cloudy               기온 toFixed(1), 단위는 fc.now.unit 에서
//   3. 날마다 한 줄: 요일 날짜, 최저, 최고, 날씨.
//      예) Thu 09-17  min 22.1  max 28.4  partly cloudy                              기온은 소수 1자리 → toFixed(1)
//   요일 날짜는 아래 label(date) 이, 날씨 단어는 wmo.js 의 describe(code) 가 만들어 준다.
//   공백 개수까지 README 의 기대 출력과 같게.
//
// 할 일 (P6) — 아래 TODO (P6) 자리. P3 를 끝낸 뒤 시간이 되면.
//   --save    : 평소대로 조회한 뒤 { place, raw } 를 cache/<도시명 소문자>.json 에 저장
//   --offline : 네트워크를 쓰지 않고 그 파일을 읽어 P3 와 똑같이 출력. 파일이 없으면 Error: no cache for busan, 종료 코드 1
//   자세한 것은 README P6.
//
// 커밋 메시지: p3: forecast cli  /  p6: cache and offline

import { geocode, forecast } from "./p3_weather.js";
import { describe } from "./wmo.js";

const args = process.argv.slice(2);
const flags = args.filter((a) => a.startsWith("--"));          // ["--save"] 같은 것
const name = args.find((a) => !a.startsWith("--")) ?? "Seoul"; // 플래그가 아닌 첫 인자

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function label(date) {                       // "2026-09-17" → "Thu 09-17"
  return `${WEEKDAY[new Date(date).getUTCDay()]} ${date.slice(5)}`;
}

try {
  const place = await geocode(name);
  const fc = await forecast(place);

  // TODO (P3): 세 부분 출력
  //   1. `${place.name}, ${place.country} (${lat}, ${lon})`    lat/lon 은 toFixed(2)
  //   2. `Now: ${temp.toFixed(1)}${unit}, ${describe(code)}`
  //   3. 날마다: `${label(date)}  min ${min}  max ${max}  ${describe(code)}`    min/max 는 toFixed(1)

  // TODO (P6): --save, --offline (README 참고)
} catch (err) {
  console.error("Error:", err.message);
  process.exit(1);
}
