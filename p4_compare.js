// P4. 여러 도시 한꺼번에 — p4_compare.js
//
// 상황
//   node p4_compare.js Seoul Busan Jeju Zzzz
//   도시 이름을 여러 개 받아서, 각 도시의 오늘 최고기온을 조회하고 높은 순으로 정렬해 찍는다.
//   조회는 P3 에서 만든 geocode() → forecast() 를 그대로 쓴다 (p3_weather.js). 새로 만들 API 호출은 없다.
//
// 이 문제의 요점
//   1. 도시가 4개면 4번 조회한다. 하나씩 차례로 기다리면(await 를 루프 안에서) 4배 느리다.
//      전부 동시에 시작해 놓고 한꺼번에 기다린다. → map 으로 Promise 4개를 만들고 Promise.allSettled 로 기다림.
//   2. Zzzz 처럼 없는 도시가 섞여 있어도 나머지 3개는 정상 출력되어야 한다.
//      Promise.all 은 하나만 실패해도 전체가 실패한다. 그래서 allSettled — 성공/실패를 각각 돌려준다.
//
// 할 일 (아래 TODO)
//   1. 이름마다 geocode → forecast 를 시작한다 (map + async 함수). map 안에서 await 로 기다리지 말 것.
//   2. Promise.allSettled 로 전부 기다린다.
//   3. status 가 "fulfilled" 인 것은 { city, max: 오늘 최고기온 } 으로 모으고,
//      "rejected" 인 것은 reason.message 를 모은다.
//   4. max 내림차순으로 정렬해서 찍고, 실패한 것은 마지막에 ✗ 줄로.
//
// 실행
//   node p4_compare.js Seoul Busan Jeju Zzzz
//     1. Busan    28.4
//     2. Jeju     27.6
//     3. Seoul    26.9
//     ✗ Zzzz: Unknown place: Zzzz
//   이름은 name.padEnd(8) 로 열을 맞추고, 기온은 toFixed(1).
//
// 확인
//   시간이 진짜 줄었는지: time node p4_compare.js Seoul Busan Jeju 를 루프 안 await 버전과 비교해 보면 안다.
//
// 커밋 메시지: p4: compare cities
import chalk from "chalk"; // P7
import { geocode, forecast } from "./p3_weather.js";

const names = process.argv.slice(2);
if (names.length === 0) {
  console.error("usage: node p4_compare.js <place> [place ...]");
  process.exit(1);
}

const jobs = names.map(async (n) => {
  const place = await geocode(n);
  const fc = await forecast(place);
  return { city: place.name, max: fc.days[0].max };
});

const results = await Promise.allSettled(jobs);

const ok = results
  .filter((r) => r.status === "fulfilled")
  .map((r) => r.value)
  .sort((a, b) => b.max - a.max);               // 내림차순. 숫자 sort 는 비교 함수 필수.

const failed = results
  .map((r, i) => ({ r, name: names[i] }))       // reason 에는 입력한 이름이 없으니 인덱스로 짝을 맞춤 (allSettled 는 입력 순서 유지)
  .filter(({ r }) => r.status === "rejected");

ok.forEach((row, i) => {
  const s = row.max.toFixed(1);
  const max = row.max >= 30 ? chalk.red(s) : row.max < 10 ? chalk.blue(s) : s;   // P7. 없으면 그냥 s
  console.log(`${i + 1}. ${chalk.bold(row.city.padEnd(8))} ${max}`);
});
for (const { r, name } of failed) {
  console.log(`✗ ${name}: ${r.reason.message}`);
}

