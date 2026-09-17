// P5. 진짜 API 키 — p5_kakao.js
//
// 상황
//   Open-Meteo 의 지오코더는 "Seoul" 은 알지만 "광운대학교" 는 모른다. 카카오 로컬 API 는 안다.
//   그런데 카카오는 API 키가 있어야 한다. 그리고 키는 소스 코드에 넣으면 안 된다 (한 번 push 되면 영원히 남는다).
//   이 파일은 한글 장소 이름 → 카카오에서 후보 3곳과 좌표 → 첫 번째 후보의 현재 날씨(P3 의 forecast) 를 찍는다.
//
// 이 문제의 요점 (코드보다 절차)
//   5a. developers.kakao.com 에서 앱을 만들고 REST API 키를 받는다. [카카오맵] → [사용 설정] 을 ON 으로.
//   5b. .env.example 을 .env 로 복사하고 키를 붙여 넣는다. .env 는 .gitignore 에 있어서 git 이 못 본다.
//       node --env-file=.env p5_kakao.js 광운대학교 로 실행하면 node 가 .env 를 읽어 process.env 에 넣어 준다.
//   5c. 아래 searchPlace() 와 출력 두 군데를 채운다. 키는 URL 이 아니라 HTTP 헤더에 넣는다.
//   자세한 절차와 스크린샷은 README P5.
//
// 실행
//   node --env-file=.env p5_kakao.js 광운대학교
//     1. 광운대학교  서울 노원구 월계동 447-1  (37.6192, 127.0583)
//     2. 광운대학교 동해문화예술관 대극장  서울 노원구 월계동 466  (37.6198, 127.0576)
//     3. 광운대학교 동해문화예술관  서울 노원구 월계동 466  (37.6198, 127.0576)
//     Now at 광운대학교: 20.7°C, clear sky
//   (후보 2, 3 번은 카카오 검색 순위에 따라 달라질 수 있다. 형식만 같으면 된다.)
//
//   node p5_kakao.js 광운대학교            ← --env-file 을 빼먹으면
//     Error: KAKAO_REST_KEY is not set. Copy .env.example to .env and run with --env-file=.env
//   .env 파일 자체가 없으면 node 가 "node.exe: .env: not found" 를 내고 시작도 못 한다. .env.example 을 복사했는지 확인.
//
// 확인
//   git status 에 .env 가 안 보여야 한다. git log -p -- .env 가 아무것도 안 찍어야 한다 (키가 한 번도 커밋된 적 없음).
//
// 커밋 메시지: p5: kakao local

import { getJSON } from "./http.js";
import { forecast } from "./p3_weather.js";
import { describe } from "./wmo.js";

const query = process.argv[2] ?? "광운대학교";

// 1. 키는 환경변수에서 온다. 소스에 적지 않는다.
//    node --env-file=.env 가 이 줄이 실행되기 전에 .env 를 process.env 에 넣어 둔다.
const KEY = process.env.KAKAO_REST_KEY;
if (!KEY) {
  console.error("Error: KAKAO_REST_KEY is not set. Copy .env.example to .env and run with --env-file=.env");
  process.exit(1);
}

// 2. 검색. 문서: https://developers.kakao.com/docs/latest/ko/kakaomap/rest-api#search-by-keyword
//    GET https://dapi.kakao.com/v2/local/search/keyword.json?query=...&size=3
//    헤더: Authorization: KakaoAK <REST API 키>        ← "KakaoAK" 뒤에 공백 하나
//    응답: { documents: [ { place_name, address_name, x, y }, ... ] }
//          x 가 경도(longitude), y 가 위도(latitude). 둘 다 문자열이라 Number() 로 바꿔야 한다.
export async function searchPlace(query, size = 3) {
  const url = new URL("https://dapi.kakao.com/v2/local/search/keyword.json");
  url.searchParams.set("query", query);   // 한글은 searchParams 가 인코딩해 줌. 문자열로 직접 이어 붙이면 깨짐.
  url.searchParams.set("size", size);
  // 키는 URL 이 아니라 헤더로. fetch 의 두 번째 인자(options) 가 getJSON 을 거쳐 그대로 전달됨.
  // "KakaoAK" 와 키 사이 공백 하나 — 이거 빠지면 401.
  const data = await getJSON(url, { headers: { Authorization: `KakaoAK ${KEY}` } });
  // 카카오는 x 가 경도, y 가 위도. 둘 다 문자열이라 Number() 안 하면 toFixed 에서 죽음.
  // forecast() 가 { latitude, longitude } 를 받으니 그 이름으로 맞춰서 돌려줌.
  return data.documents.map((d) => ({
    name: d.place_name,
    address: d.address_name,
    latitude: Number(d.y),
    longitude: Number(d.x),
  }));
}

try {
  const places = await searchPlace(query);
  if (places.length === 0) throw new Error(`No place found for: ${query}`);

 places.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name}  ${p.address}  (${p.latitude.toFixed(4)}, ${p.longitude.toFixed(4)})`);
  });

  // 첫 후보의 좌표로 날씨. places[0] 에 name/address 가 더 있어도 forecast 는 두 키만 꺼내 쓰니 그대로 넘김.
  const fc = await forecast(places[0]);
  console.log(`Now at ${places[0].name}: ${fc.now.temp.toFixed(1)}${fc.now.unit}, ${describe(fc.now.code)}`);
} catch (err) {
  console.error("Error:", err.message);
  process.exit(1);
}
