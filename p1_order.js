// P1. 글자가 어떤 순서로 찍힐까
//
// 상황
//   아래 코드는 A~G 일곱 글자를 console.log 로 찍는다. 단, 전부 즉시 찍히는 게 아니다.
//     - 그냥 console.log 인 것이 있고
//     - setTimeout 으로 나중에 찍히는 것이 있고 (지연 50ms, 0ms)
//     - async 함수 안에서 await 뒤에 찍히는 것이 있고
//     - Promise 의 .then 안에서 찍히는 것이 있다
//   sleep(ms) 는 node 에 내장된, ms 뒤에 완료되는 Promise 다 (setTimeout 의 Promise 판).
//
// 할 일
//   1. 실행하지 말고, 코드만 읽고 출력 순서를 예측해서 맨 아래 // prediction: 에 적는다.
//      예) // prediction: A B C D E F G
//   2. 그 다음에 node p1_order.js 로 실행하고, 실제 순서를 // actual: 에 적는다.
//   3. 틀린 글자마다 "왜 거기 오는지" 한 줄씩 적는다. 예) // C: 0ms 라도 setTimeout 은 ...
//   틀리는 게 정상이고, 틀린 예측이 이 문제의 목적이다. 고쳐 적지 말고 그대로 커밋한다.
//
// 힌트
//   먼저 "지금 당장 찍히는 것"과 "나중에 찍히는 것"을 나눠 보자.
//   나중 것들끼리는 얼마나 나중인지(0ms, 10ms, 30ms, 50ms)로 순서가 갈린다.
//   await 는 그 함수 안에서만 기다린다. 함수를 부른 쪽은 안 기다린다.
//
// 커밋 메시지: p1: order predictions

import { setTimeout as sleep } from "node:timers/promises";

console.log("A");

setTimeout(() => console.log("B"), 50);

setTimeout(() => console.log("C"), 0);

async function work() {
  console.log("D");
  await sleep(30);
  console.log("E");
}
work();

sleep(10).then(() => console.log("F"));

console.log("G");

// prediction:
// actual:
// why I was wrong (one line per miss):
//
