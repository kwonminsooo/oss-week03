# oss-week03 — async, fetch, 날씨 CLI

오픈소스SW설계및실습 3주차 대면 실습 (광운대학교, 2026년 2학기)

이 줄을 본인 이름과 학번으로 바꾸고 커밋, push 하는 것까지가 P0입니다.

## 실습 규칙

- AI에게 질문하는 것은 자유입니다. 개념이든 에러 메시지든 문서든 뭐든 물어보세요. 다만 AI가 만들어 준 코드를 붙여 넣지는 마세요. 코드는 한 줄 한 줄 직접 칩니다.
- 인라인 자동완성은 꺼 두세요. `Ctrl+Shift+P` → *GitHub Copilot: Disable Inline Suggestions*
- 문제 하나를 풀 때마다 커밋 하나. 커밋 메시지는 각 문제에 적힌 것을 그대로 씁니다.
- 막히면 우선 맨 아래 **흔한 오류**를 보고, 그래도 안 풀리면 손을 들어 주세요.
- 강의실 인터넷이 안 되는 경우를 대비해 `cache/` 폴더에 API 응답을 저장해 두었습니다. 이걸 쓰는 방법은 P6에 있고, 필요하면 P6을 P4보다 먼저 해도 됩니다.

## 오늘 만드는 것

도시 이름을 주면 공개 날씨 API에서 현재 날씨와 3일 예보를 받아 출력하는 명령줄 프로그램입니다. API는 [Open-Meteo](https://open-meteo.com)를 씁니다. 무료이고 키도 필요 없습니다. 문서는 <https://open-meteo.com/en/docs>에 있습니다.

```
$ node main.js Busan
Busan, South Korea (35.10, 129.04)
Now: 26.1°C, partly cloudy
Thu 09-17  min 22.1  max 28.4  partly cloudy
Fri 09-18  min 21.5  max 27.9  mainly clear
Sat 09-19  min 20.8  max 27.0  rain showers
```

오늘 목표는 **P0부터 P5까지**입니다. P6, P7은 시간이 남는 분만 하면 됩니다.

파일 이름에 대해: `p1_order.js`처럼 앞에 번호가 붙은 파일은 그 번호의 문제에서 처음 작성하는 파일입니다. `main.js`는 프로그램의 진입점이라 번호가 없고, P3에서 작성한 뒤 P6과 P7에서 계속 고쳐 나갑니다. `http.js`와 `wmo.js`는 완성된 채로 주어지는 파일입니다. 각 파일의 맨 위 주석에 그 문제의 상황, 할 일, 기대 출력을 적어 두었으니 파일을 열면서 읽으면 됩니다.

## P0. 프로젝트 준비 — `chore: init project`

1. 이 저장소는 템플릿입니다. **Use this template → Create a new repository**를 눌러 본인 계정에 저장소를 만드세요. 이름은 정확히 `oss-week03`, 공개 범위는 **Public**입니다.
2. `git clone <내 저장소 URL>` → `cd oss-week03` → `code .`
3. `node -v`로 버전을 확인합니다. 22 이상이면 됩니다. P7 전까지는 `npm install`이 필요 없습니다.
4. 이 README의 첫 줄을 본인 이름과 학번으로 바꿉니다.
5. `git add -A` → `git commit -m "chore: init project"` → `git push`

`git status`를 쳤을 때 *nothing to commit, working tree clean*이 나오면 됩니다. `node_modules`가 저장소에 올라가면 안 됩니다.

## P1. 실행 순서 예측하기 — `p1: order predictions`

`p1_order.js`는 A부터 G까지 일곱 글자를 출력하는데, 어떤 것은 바로 찍히고 어떤 것은 `setTimeout`이나 `await`, `.then` 뒤에서 찍힙니다.

실행하기 **전에** 어떤 순서로 나올지 예측해서 파일 아래쪽 `// prediction:` 주석에 적으세요. 그러고 나서 `node p1_order.js`로 실행해 보고 실제 순서를 `// actual:`에 적습니다. 예측이 틀린 글자가 있으면 왜 그 자리에 오는지 한 줄씩 이유를 적어 주세요. 틀리는 게 정상이고, 오히려 틀린 예측이 이 문제의 목적이니 고쳐 적지 말고 그대로 커밋하세요.

## P2. 콜백을 async/await로 — `p2: callbacks to await`

`p2_convert.js`는 텍스트 파일 세 개를 읽어 각 파일의 줄 수와 단어 수를 출력하는 프로그램입니다. 지금은 콜백을 세 겹으로 중첩해서 짜여 있는데, 동작은 하지만 읽기가 괴롭습니다. 이걸 `main()` 함수 안에 `node:fs/promises`와 `await`로 다시 작성하세요. `FILES` 배열을 `for…of`로 돌고, 에러 처리는 `try/catch` 하나로 끝냅니다.

```
$ node p2_convert.js
a.txt: 3 lines, 13 words
b.txt: 2 lines, 15 words
c.txt: 4 lines, 20 words
total: 9 lines
```

다 되면 `c.txt`를 `d.txt`로 이름을 바꾸고 다시 실행해 보세요. `Failed: ENOENT: ...` 한 줄이 나오고 `echo $?`가 `1`을 출력하면 맞게 된 겁니다. 확인한 뒤에는 파일 이름을 되돌려 놓으세요.

## P3. 예보 CLI — `p3: forecast cli`

`p3_weather.js`에 `geocode` 함수(지명 → 좌표)는 만들어져 있습니다. 나머지 두 함수를 작성하세요. 둘을 하나로 합치지 말고 따로 두어야 합니다. P6에서 따로 필요합니다.

- `fetchForecastRaw({ latitude, longitude }, days)` — `new URL`과 `searchParams.set`으로 URL을 만들고, `getJSON`으로 호출한 응답을 가공하지 않고 그대로 돌려줍니다. 어떤 파라미터를 보내야 하는지는 파일 주석에 적혀 있습니다. 코드로 쓰기 전에 브라우저 주소창에서 그 URL을 먼저 열어 보세요.
- `parseForecast(raw)` — 응답에서 `main.js`가 쓸 것만 추려서 `{ now: { temp, unit, code }, days: [{ date, min, max, code }, …] }` 모양으로 만듭니다. `daily` 안의 배열들은 같은 인덱스가 같은 날입니다.

그 다음 `main.js`에서 `console.log` 세 군데를 채웁니다. 기대 출력은 이 문서 맨 위에 있습니다. 기온은 `toFixed(1)`로 소수 한 자리까지 출력하고, 날씨 코드를 말로 바꾸는 것은 `wmo.js`의 `describe(code)`를 쓰면 됩니다.

`parseForecast`를 쓰기 전에 `console.log(JSON.stringify(raw, null, 2))`로 응답이 어떻게 생겼는지 한 번 보는 게 좋습니다. 단위는 `"°C"`를 직접 쓰지 말고 `raw.current_units`에서 읽어 오세요. `node main.js Zzzzqqq`처럼 없는 지명을 넣으면 `Error: Unknown place: Zzzzqqq`가 나오고 종료 코드가 1이어야 하는데, 이 부분은 이미 되어 있으니 확인만 하면 됩니다.

## P4. 여러 도시 비교 — `p4: compare cities`

`p4_compare.js`를 작성합니다. `node p4_compare.js Seoul Busan Jeju Zzzz`처럼 도시를 여러 개 주면 전부 **동시에** 조회해서 오늘 최고기온이 높은 순으로 출력합니다. 없는 지명이 하나 섞여 있어도 나머지는 정상적으로 나와야 합니다. `Promise.all`이 아니라 `Promise.allSettled`를 쓰고, 결과를 `fulfilled`와 `rejected`로 나누면 됩니다.

```
$ node p4_compare.js Seoul Busan Jeju Zzzz
1. Busan    28.4
2. Jeju     27.6
3. Seoul    26.9
✗ Zzzz: Unknown place: Zzzz
```

조회는 P3에서 만든 `forecast(place)`를 그대로 가져다 쓰면 됩니다. 이름 열은 `name.padEnd(8)`로 맞춥니다.

## P5. 진짜 API 키 써 보기: 카카오 로컬 — `p5: kakao local`

Open-Meteo의 지오코더는 "Seoul"은 알아듣지만 "광운대학교"는 모릅니다. 카카오 로컬 API는 압니다. 대신 API 키가 필요하고, 그 키를 소스 코드 밖에서 관리하는 것까지가 이 문제입니다.

**5a. 키 발급** (5분 정도 걸립니다. 카카오 계정이 필요합니다)

1. <https://developers.kakao.com>에 로그인해서 **[앱] → [앱 생성]**. 앱 이름은 `oss-week03`, 회사명은 본인 이름, 카테고리는 아무거나 고르고 저장합니다.
2. 만든 앱에서 **[앱] → [플랫폼 키] → [REST API 키]**를 복사합니다. 오늘 쓰는 키는 이것 하나뿐입니다. 어드민 키는 쓰지 마세요.
3. 왼쪽 메뉴를 아래로 내리면 **제품 설정** 묶음이 있고 그 안에 **[카카오맵]**이 있습니다 (위쪽 앱 설정 묶음에는 없습니다). 들어가서 **[사용 설정] → [상태]**를 ON으로 켭니다. 이게 꺼져 있으면 키가 맞아도 모든 호출이 에러로 돌아옵니다.
   카카오는 무료 사용량을 계정에서 처음 카카오맵을 켠 앱에만 줍니다. 예전에 카카오맵을 켜 둔 앱이 이미 있다면 새로 만들지 말고 그 앱의 키를 쓰세요.

**5b. `.env`에 넣고 git에서는 빼기**

1. `.env.example`을 `.env`로 복사하고 `KAKAO_REST_KEY=` 뒤에 키를 붙여 넣습니다. 따옴표나 공백 없이 키만 씁니다.
2. `.env`는 이미 `.gitignore`에 들어 있습니다. `git status`를 쳐서 `.env`가 안 보이는지 확인하세요. `.env.example`은 커밋해도 됩니다. 실제 키가 없는 파일이고, 다음 사람에게 어떤 변수를 채워야 하는지 알려 주는 용도입니다.
3. `node --env-file=.env p5_kakao.js 광운대학교`로 실행합니다. `--env-file` 옵션을 주면 Node가 `.env`를 읽어 `process.env.KAKAO_REST_KEY`에 넣어 줍니다. 별도 패키지는 필요 없습니다.

**5c. `p5_kakao.js`의 `searchPlace` 함수와 출력 두 군데를 작성합니다.**

- 문서는 <https://developers.kakao.com/docs/latest/ko/kakaomap/rest-api#search-by-keyword>입니다. 요청 표에서 URL, `Authorization: KakaoAK …` 헤더, `query`와 `size` 파라미터를 찾아 읽으세요.
- 키는 URL이 아니라 **헤더**에 넣습니다. `getJSON(url, { headers: { Authorization: "KakaoAK " + KEY } })`
- 응답의 `x`가 경도, `y`가 위도이고 둘 다 문자열이라 `Number()`로 바꿔야 합니다.

```
$ node --env-file=.env p5_kakao.js 광운대학교
1. 광운대학교  서울 노원구 월계동 447-1  (37.6192, 127.0583)
2. 광운대학교 동해문화예술관 대극장  서울 노원구 월계동 466  (37.6198, 127.0576)
3. 광운대학교 동해문화예술관  서울 노원구 월계동 466  (37.6198, 127.0576)
Now at 광운대학교: 20.7°C, clear sky

$ node p5_kakao.js 광운대학교                 # --env-file 을 빼먹으면
Error: KAKAO_REST_KEY is not set. Copy .env.example to .env and run with --env-file=.env
```

후보 2, 3번은 카카오의 검색 순위에 따라 다른 장소가 나올 수 있습니다. 형식만 같으면 됩니다.

마지막으로 두 가지를 확인하세요. `git status`에 `.env`가 없어야 하고, `git log -p -- .env`가 아무것도 출력하지 않아야 합니다. 후자는 키가 한 번도 커밋된 적이 없다는 뜻입니다.

## P6. 응답 캐시와 오프라인 모드 — `p6: cache and offline`

`main.js`에 옵션 두 개를 추가합니다.

- `node main.js Busan --save` — 평소대로 조회한 다음 `{ place, raw }`를 `cache/busan.json`에 저장합니다. `JSON.stringify(obj, null, 2)`와 `fs.writeFile`을 쓰고, 파일 이름은 지명을 소문자로 씁니다.
- `node main.js Busan --offline` — 네트워크를 쓰지 않고 `cache/busan.json`을 읽어(`fs.readFile` + `JSON.parse`) 저장된 `raw`로 P3과 똑같은 출력을 냅니다. 파일이 없으면 `Error: no cache for busan`을 출력하고 종료 코드 1로 끝냅니다.

`cache/seoul.json`과 `cache/busan.json`은 미리 넣어 두었으니 `--save`를 만들기 전이라도 `--offline`부터 테스트할 수 있습니다. 여기서는 `fetchForecastRaw`와 `parseForecast`를 따로 불러야 하는데, P3에서 둘을 나눠 두라고 한 이유가 이것입니다.

## P7. npm 패키지로 색 입히기 — `p7: chalk colors`

`npm install chalk`로 설치하고, 사용법은 <https://www.npmjs.com/package/chalk> 페이지의 *Usage* 부분을 직접 읽고 알아내세요. `main.js`와 `p4_compare.js`의 출력에서 최고기온이 30도 이상이면 빨간색, 10도 미만이면 파란색으로, 지명은 굵게 표시합니다.

끝나면 `package.json`의 `dependencies`에 `chalk`가 들어갔는지, `node_modules/chalk`가 생겼는지, 그리고 `git status`에 `node_modules`가 안 보이는지 확인하세요.

## 나가기 전에

- `github.com/<본인 계정>/oss-week03` 저장소가 Public으로 존재하고, 이름이 정확히 `oss-week03`이어야 합니다.
- 이 README의 첫 줄에 이름과 학번이 있어야 합니다.
- 푼 문제마다 지정된 메시지로 커밋 하나씩, 전부 push 되어 있어야 합니다. github.com의 Commits 페이지에서 확인하세요.
- 저장소에 `node_modules`와 `.env`가 없어야 합니다. `.env.example`은 있어야 하고, P7을 했다면 `package.json`에 `chalk`가 있어야 합니다.

## 흔한 오류

| 증상 | 원인 | 해결 |
|---|---|---|
| 값이 있어야 할 자리에 `Promise { <pending> }`이나 `undefined`가 나옴 | `await`를 빠뜨림 | 그 호출 앞에 `await`를 붙이세요. 함수 안이라면 그 함수에 `async`도 필요합니다. |
| `SyntaxError: await is only valid in async functions and the top level bodies of modules` | `async`가 없는 일반 함수 안에서 `await`를 씀, 또는 `package.json`에 `"type": "module"`이 없음 | 함수에 `async`를 붙이세요. `"type": "module"`은 템플릿에 이미 들어 있습니다. |
| `TypeError: Cannot read properties of undefined (reading 'temperature_2m')` | 응답 객체의 경로가 틀림, 또는 `res.json()`을 `await`하지 않음 | `console.log(JSON.stringify(raw, null, 2))`로 실제 구조를 보고 키를 따라가세요. 없을 수도 있는 키는 `?.`로 접근합니다. |
| `TypeError: fetch failed` 아래에 `ENOTFOUND` | 호스트 이름 오타, 또는 네트워크 없음 | URL을 브라우저에 붙여 넣어 열리는지 보세요. 네트워크가 없으면 P6의 `--offline`으로 진행합니다. |
| `Error: HTTP 400: {"error":true,"reason":"..."}` | 파라미터 이름이나 값이 틀림 | `reason`에 무엇이 틀렸는지 적혀 있습니다. 문서 페이지의 철자와 비교하세요. |
| `Error: HTTP 429` | 짧은 시간에 너무 많이 호출함 | 몇 초 기다리세요. 반복문 안에서 API를 호출하지 않도록 코드를 확인합니다. |
| `p4_compare.js`에서 도시 하나가 틀리면 나머지 도시도 안 나옴 | `Promise.allSettled` 대신 `Promise.all`을 씀 | `allSettled`는 하나가 실패해도 전체가 실패하지 않습니다. 결과마다 `r.status`를 확인하세요. |
| `node.exe: .env: not found` (Windows) 또는 `node: .env: not found` | `--env-file=.env`를 붙였는데 `.env` 파일이 없음. Node가 파일을 못 찾아 프로그램이 시작도 안 됨 | `.env.example`을 `.env`로 복사했는지 확인하세요. `ls -a`에 `.env`가 보여야 합니다. |
| `Error: KAKAO_REST_KEY is not set` | `--env-file=.env` 없이 실행함, 또는 `.env`의 변수 이름 오타 | `node --env-file=.env p5_kakao.js …`로 실행하세요. `.env` 내용은 정확히 `KAKAO_REST_KEY=키` 한 줄, 따옴표 없이 씁니다. |
| `Error: HTTP 401: {"errorType":"AccessDeniedError",…}` | 키가 틀렸거나 잘렸음, 또는 헤더를 안 넣음 | `message`를 읽으면 원인이 갈립니다. `cannot find Authorization : KakaoAK header`면 헤더가 없거나 형식이 틀린 것이고, `wrong appKey(...) format`이면 키 값이 틀린 것입니다. REST API 키를 다시 복사하세요 (어드민 키가 아닙니다). 헤더는 `Authorization: KakaoAK <키>`이고 `KakaoAK` 뒤에 공백이 하나 있습니다. |
| `HTTP 403`, 또는 앱이나 사용량을 언급하는 에러 | 이 앱에 카카오맵 사용 설정이 꺼져 있음 | Kakao Developers → 내 앱 → **[카카오맵] → [사용 설정] → [상태] ON**. 무료 사용량은 처음 켠 앱에만 주어집니다. |
| `Cannot find package 'chalk'` | `npm install chalk`를 안 했거나 다른 폴더에서 함 | 저장소 루트로 이동해서 `npm install chalk`를 하고 `ls node_modules/chalk`로 확인하세요. |

에러 메시지는 위에서 아래로 읽으세요. 파일 이름과 줄 번호가 그 안에 있습니다. AI에게는 메시지가 무슨 뜻인지 설명해 달라고 하되, 고쳐 달라고는 하지 마세요.
