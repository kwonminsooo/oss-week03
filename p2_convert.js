// P2. 콜백 → async/await
//
// 상황
//   같은 폴더에 a.txt, b.txt, c.txt 세 파일이 있다.
//   세 파일을 a → b → c 순서로 읽어서, 파일마다 "줄 수, 단어 수"를 한 줄씩 출력하고
//   마지막에 세 파일의 줄 수 합계를 출력하는 프로그램이다.
//   순서는 반드시 a, b, c 여야 한다 (출력 순서가 곧 채점 기준).
//
// 지금 상태
//   아래 callbackVersion() 이 이미 그 일을 한다. 동작은 맞는데, 파일 하나 읽을 때마다
//   콜백이 한 단계씩 안으로 들어가서 3중첩이 됐고, 에러 처리(if (err) ...)도 세 번 반복된다.
//   파일이 10개였다면 10중첩이 됐을 코드다.
//
// 할 일
//   main() 을 채운다. 조건:
//     - fs.readFile 콜백 대신 fsp.readFile (node:fs/promises) + await
//     - 파일마다 코드를 복붙하지 말고 FILES 배열을 for...of 로 돈다
//     - 에러 처리는 try/catch 하나로. 세 파일 중 어느 것이 없든 같은 자리로 온다
//     - 출력은 callbackVersion() 과 글자 단위로 똑같아야 한다
//     - 파일이 없으면 "Failed: <에러 메시지>" 한 줄 찍고 종료 코드 1 (process.exit(1))
//   callbackVersion() 은 지우지 말고 그대로 둔다. 비교용이다.
//
// 실행
//   node p2_convert.js
//     a.txt: 3 lines, 13 words
//     b.txt: 2 lines, 15 words
//     c.txt: 4 lines, 20 words
//     total: 9 lines
//
// 확인
//   c.txt 를 d.txt 로 이름을 바꾸고 다시 실행하면
//     a.txt: 3 lines, 13 words
//     b.txt: 2 lines, 15 words
//     Failed: ENOENT: no such file or directory, open 'c.txt'
//   가 나오고, 이어서 echo $? 를 치면 1 이 찍혀야 한다. 확인했으면 이름을 되돌린다.
//
// 커밋 메시지: p2: callbacks to await

import fs from "node:fs";
import fsp from "node:fs/promises";

const FILES = ["a.txt", "b.txt", "c.txt"];

// 파일 내용 → { lines, words }. 두 버전이 같이 쓴다. 건드릴 필요 없음.
function stats(text) {
  const lines = text.trim().split("\n");
  const words = text.trim().split(/\s+/);
  return { lines: lines.length, words: words.length };
}

// --- 콜백 버전 (주어진 것, 수정 금지) ---
// a 를 읽고 → 그 콜백 안에서 b 를 읽고 → 그 콜백 안에서 c 를 읽는다.
// "다음 파일은 앞 파일을 다 읽은 뒤에" 라는 순서를 지키려면 이렇게 안으로 들어갈 수밖에 없었다.
function callbackVersion() {
  fs.readFile(FILES[0], "utf8", (err, a) => {
    if (err) return console.error("Failed:", err.message);
    const sa = stats(a);
    console.log(`${FILES[0]}: ${sa.lines} lines, ${sa.words} words`);
    fs.readFile(FILES[1], "utf8", (err, b) => {
      if (err) return console.error("Failed:", err.message);
      const sb = stats(b);
      console.log(`${FILES[1]}: ${sb.lines} lines, ${sb.words} words`);
      fs.readFile(FILES[2], "utf8", (err, c) => {
        if (err) return console.error("Failed:", err.message);
        const sc = stats(c);
        console.log(`${FILES[2]}: ${sc.lines} lines, ${sc.words} words`);
        console.log(`total: ${sa.lines + sb.lines + sc.lines} lines`);
      });
    });
  });
}

// --- async/await 버전 (여기를 채운다) ---
// 같은 순서(a → b → c), 같은 출력. 중첩 없이, 루프 하나와 try/catch 하나로.
async function main() {
  // TODO
}

// 먼저 callbackVersion() 을 한 번 실행해서 기대 출력을 눈으로 본 다음, main() 으로 바꾼다.
// callbackVersion();
main();
