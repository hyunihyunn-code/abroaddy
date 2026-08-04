// 어브로디 · Gemini 비전 스캔 프록시 (Vercel Serverless Function)
// 브라우저가 보낸 사진을 서버에서 Gemini로 인식해 거래 목록(JSON)만 돌려준다.
// API 키는 서버 환경변수 GEMINI_API_KEY 에만 존재 → 브라우저·소스에 절대 노출되지 않음.

// 2026-08 기준 GA 플래시 모델. Vercel 환경변수 GEMINI_MODEL 로 언제든 교체 가능.
const MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";
const CATS = ["식비","교통비","숙박","항공","티켓/입장권","통신비","생활용품",
  "월세","학비·프로그램비","비자·행정","보험","교통패스","보증금"];
const ALLOW_ORIGIN = "https://hyunihyunn-code.github.io"; // 필요 시 다른 GitHub Pages 주소로 변경

module.exports = async (req, res) => {
  // 같은 도메인(Vercel)에서 쓰면 CORS 불필요. github.io에서 호출할 때만 아래가 작동.
  const origin = req.headers.origin || "";
  if (origin === ALLOW_ORIGIN) res.setHeader("Access-Control-Allow-Origin", origin);
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") { res.status(405).json({ error: "POST only" }); return; }

  const key = process.env.GEMINI_API_KEY;
  if (!key) { res.status(500).json({ error: "GEMINI_API_KEY not set" }); return; }

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const { imageBase64, mimeType, today, localCur } = body || {};
  if (!imageBase64) { res.status(400).json({ error: "no image" }); return; }

  const prompt = [
    "이미지는 영수증 또는 은행/카드/간편결제 앱의 결제 내역 화면입니다.",
    "개별 결제 건을 모두 찾아 아래 규칙으로 JSON을 만드세요.",
    "- m: 가맹점/사용처 이름 (짧게)",
    "- amt: 금액 (숫자만, 통화기호·천단위 콤마 제외)",
    '- cur: 통화 ISO 4217 코드 (기호·문맥으로 추정, 불명확하면 "' + (localCur || "KRW") + '")',
    "- cat: 다음 중 하나로 분류: " + CATS.join(", "),
    "- d: 날짜 YYYY-MM-DD (연도 없으면 " + (today || "") + " 기준 추정, 날짜 없으면 " + (today || "") + ")",
    "- t: 시각 HH:MM 24시간제 (없으면 빈 문자열)",
    "- pre: 항공·숙박·티켓·학비·비자·보험처럼 미리 결제한 예약성 지출이면 true, 아니면 false",
    "거래를 하나도 못 찾으면 rows를 빈 배열로 두세요. 설명 없이 JSON만 출력하세요."
  ].join("\n");

  const payload = {
    contents: [{ parts: [
      { inline_data: { mime_type: mimeType || "image/jpeg", data: imageBase64 } },
      { text: prompt }
    ] }],
    generationConfig: {
      temperature: 0,
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          rows: {
            type: "array",
            items: {
              type: "object",
              properties: {
                m: { type: "string" },
                amt: { type: "number" },
                cur: { type: "string" },
                cat: { type: "string" },
                d: { type: "string" },
                t: { type: "string" },
                pre: { type: "boolean" }
              },
              required: ["m", "amt", "cur", "cat"]
            }
          }
        },
        required: ["rows"]
      }
    }
  };

  try {
    const gres = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/" + MODEL + ":generateContent",
      { method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify(payload) }
    );
    if (!gres.ok) {
      const detail = await gres.text();
      res.status(502).json({ error: "gemini", status: gres.status, detail: detail.slice(0, 300) });
      return;
    }
    const data = await gres.json();
    const text = (((data.candidates || [])[0] || {}).content || {}).parts;
    const raw = (text && text[0] && text[0].text) || "{}";
    let parsed; try { parsed = JSON.parse(raw); } catch (e) { parsed = { rows: [] }; }
    res.status(200).json({ rows: Array.isArray(parsed.rows) ? parsed.rows : [] });
  } catch (e) {
    res.status(500).json({ error: "server", detail: String(e).slice(0, 200) });
  }
};
