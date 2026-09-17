// 주어짐. 강의에서 본 그 함수 — http.js
//
// getJSON(url) : fetch → 상태 확인 → JSON. 오늘 모든 HTTP 호출은 이 함수로 한다. fetch 를 직접 부르지 않는다.
// 왜 따로 두나: fetch 는 404 나 500 이 와도 에러를 던지지 않는다 (res.ok 만 false).
// 그걸 매번 검사하기 귀찮으니 여기서 한 번만 하고, 실패하면 상태 코드와 응답 본문 앞부분을 담아 던진다.
// 응답 본문을 메시지에 넣는 이유: Open-Meteo 는 400 일 때 {"error":true,"reason":"..."} 로 뭐가 틀렸는지 알려 준다.
//
// options 는 fetch 에 그대로 넘어간다. 헤더가 필요할 때(P5, 카카오) 이렇게:
//   getJSON(url, { headers: { Authorization: "KakaoAK " + KEY } })

export async function getJSON(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.text();          // JSON 일 수도, HTML 일 수도 있어서 text 로 받는다
    throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json();
}
