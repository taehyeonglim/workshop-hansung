const COLORS = {
  ink: "#18212f",
  muted: "#5d6876",
  line: "#d8dde5",
  teal: "#2f9eac",
  blue: "#3b6ea8",
  gold: "#e7a93c",
  red: "#c64545",
  green: "#4f9d69",
  violet: "#7a6fa6",
};

const DATA = {
  foreignTotals: [
    { year: 2023, total: 380 },
    { year: 2024, total: 400 },
    { year: 2025, total: 506 },
  ],
  foreignCountries2025: [
    { country: "베트남", total: 333 },
    { country: "중국", total: 68 },
    { country: "일본", total: 43 },
    { country: "미얀마", total: 28 },
    { country: "몽골", total: 15 },
  ],
  dropoutRates: [
    { label: "공시 2023\n기준 2022", enrolled: 364, dropout: 16, rate: 4.4 },
    { label: "공시 2024\n기준 2023", enrolled: 380, dropout: 24, rate: 6.3 },
    { label: "공시 2025\n기준 2024", enrolled: 400, dropout: 13, rate: 3.2 },
  ],
  admissionsByType: [
    { year: "2023", values: { "수능위주": 394, "학생부교과": 533, "학생부종합": 539, "실기위주": 152, "기타": 35 } },
    { year: "2024", values: { "수능위주": 535, "학생부교과": 472, "학생부종합": 496, "실기위주": 152, "기타": 36 } },
    { year: "2025", values: { "수능위주": 535, "학생부교과": 490, "학생부종합": 368, "실기위주": 144, "기타": 8 } },
  ],
  grades: [
    { year: "2023", values: { A: 49.6, B: 24.1, C: 20.3, D: 3.1, F: 2.9 } },
    { year: "2024", values: { A: 40.9, B: 34.8, C: 19.1, D: 2.6, F: 2.6 } },
    { year: "2025", values: { A: 43.2, B: 33.9, C: 18.3, D: 2.5, F: 2.1 } },
  ],
};

const PROMPTS = {
  inventory: `data 폴더 안의 파일들을 확인하고,
각 파일이 어떤 주제와 연도인지 표로 정리해줘.
파일을 열기 전에 예상되는 분석 질문도 5개 제안해줘.`,
  structure: `data 폴더의 모든 xlsx 파일을 열어보고,
1) 파일명, 2) 주제, 3) 파일명 연도, 4) 실제 데이터 행 수,
5) 헤더가 시작되는 행, 6) 분석 시 주의점을 표로 정리해줘.

결과를 내기 전에 파일을 실제로 읽었는지 근거를 보여줘.`,
  failure: `엑셀 파일을 읽었을 때 한 칸만 보이거나 행 수가 이상하면,
파일 내부 구조와 실제 셀 태그 수를 확인해서 원인을 설명해줘.
가능하면 데이터를 복원하는 방법도 제안해줘.`,
  cleanGrades: `전공과목 성적 분포 파일을 분석 가능한 형태로 정리하려면
어떤 열은 위 행 값을 채워야 하고,
어떤 행은 제외해야 하는지 규칙을 제안해줘.

그 규칙으로 2023-2025년 성적 분포를 A/B/C/D/F 구간으로 요약해줘.`,
  validation: `방금 만든 분석 결과를 검증해줘.
원본 합계 행과 계산 결과를 비교하고,
기준연도/파일명 연도/분모/단위에서 해석상 주의할 점을 적어줘.
검증이 불충분한 부분은 '추가 확인 필요'라고 표시해줘.`,
  countryGrowth: `외국학생 현황 2023-2025 파일을 기준으로
국가별 총원 증감을 계산하고,
증가분이 큰 상위 5개 국가를 표로 보여줘.
합계 증가분과 국가별 증가분 합계가 맞는지도 확인해줘.`,
  storyboard: `지금까지 분석한 내용을 바탕으로
'AI 에이전트로 대학 행정 데이터를 분석하고 발표자료를 만드는 방법'이라는 주제의
8장짜리 발표자료 구성을 만들어줘.

각 슬라이드마다
1) 제목, 2) 핵심 메시지 한 문장, 3) 들어갈 차트나 표,
4) 강사가 말할 진행 멘트를 적어줘.
청중은 대학 교수이고, 실습형 워크숍 톤으로 작성해줘.`,
  htmlDeck: `위 구성안을 바탕으로 GitHub Pages에 올릴 수 있는 동적 HTML 발표자료를 만들어줘.
조건은 다음과 같아.

- 발표자료/slide/index.html, styles.css, app.js로 구성
- 16:9 발표 화면
- 키보드로 이전/다음 이동
- 발표자 메모 토글
- 외국학생 총원 추이, 국가별 상위 국가, 중도탈락률, 성적분포 차트를 SVG로 렌더링
- 마지막에는 참가자 실습 프롬프트 카드 섹션 포함
- 외부 라이브러리 없이 GitHub Pages에서 바로 열리게 작성`,
  notes: `각 슬라이드에 대해 강사용 발표자 메모를 작성해줘.
메모는 다음 형식으로 해줘.

- 말문 열기: 1문장
- 짚을 숫자: 1-2개
- 참가자에게 던질 질문: 1개
- 다음 슬라이드로 넘어가는 연결 멘트: 1문장

너무 길게 쓰지 말고 실제 강의장에서 말할 수 있는 자연스러운 문장으로 써줘.`,
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function card(title, body, accent = COLORS.teal, dark = false) {
  return `
    <article class="card ${dark ? "card--dark" : ""}" style="--accent:${accent}">
      <h3 class="card__title">${escapeHtml(title)}</h3>
      <p class="card__body">${escapeHtml(body)}</p>
    </article>
  `;
}

function metric(value, label, accent = COLORS.teal) {
  return `
    <div class="metric" style="--accent:${accent}">
      <div>
        <div class="metric__value">${escapeHtml(value)}</div>
        <div class="metric__label">${escapeHtml(label)}</div>
      </div>
    </div>
  `;
}

function promptBox(label, text) {
  return `
    <div class="prompt">
      <button class="prompt__copy" type="button" data-prompt="${escapeHtml(text)}">복사</button>
      <div class="prompt__label">${escapeHtml(label)}</div>
      <pre class="prompt__text">${escapeHtml(text)}</pre>
    </div>
  `;
}

function bullets(items) {
  return `<ul class="bullets">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function table(headers, rows) {
  return `
    <table class="table">
      <thead>
        <tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr>
      </thead>
      <tbody>
        ${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}
      </tbody>
    </table>
  `;
}

function timeline(steps) {
  return `
    <div class="timeline" style="--count:${steps.length}">
      ${steps
        .map(
          (step) => `
            <div class="timeline__step">
              <div class="timeline__title">${escapeHtml(step.title)}</div>
              <div class="timeline__subtitle">${escapeHtml(step.subtitle)}</div>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function chartShell(chartHtml, insight, question, accent = COLORS.red) {
  return `
    <div class="chart-layout">
      <div class="chart-card">${chartHtml}</div>
      <div class="insight-stack">
        ${card("읽을 포인트", insight, accent)}
        ${card("참가자 질문", question, COLORS.teal)}
      </div>
    </div>
  `;
}

function svgLineChart(data, title) {
  const width = 720;
  const height = 390;
  const margin = { top: 86, right: 44, bottom: 72, left: 92 };
  const yMin = 330;
  const yMax = 580;
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;
  const x = (idx) => margin.left + (plotW * idx) / (data.length - 1);
  const y = (value) => margin.top + plotH - ((value - yMin) / (yMax - yMin)) * plotH;
  const points = data.map((d, i) => `${x(i)},${y(d.total)}`).join(" ");
  const grid = [350, 400, 450, 500, 550]
    .map(
      (tick) => `
        <line class="chart-grid" x1="${margin.left}" x2="${width - margin.right}" y1="${y(tick)}" y2="${y(tick)}" />
        <text class="chart-label" x="${margin.left - 12}" y="${y(tick) + 4}" text-anchor="end">${tick}</text>
      `,
    )
    .join("");
  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(title)}">
      <text class="chart-title" x="${margin.left}" y="48">${escapeHtml(title)}</text>
      ${grid}
      <line class="chart-axis" x1="${margin.left}" x2="${width - margin.right}" y1="${margin.top + plotH}" y2="${margin.top + plotH}" />
      <polyline points="${points}" fill="none" stroke="${COLORS.teal}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
      ${data
        .map(
          (d, i) => `
            <circle cx="${x(i)}" cy="${y(d.total)}" r="7" fill="${COLORS.teal}" />
            <text class="chart-value" x="${x(i)}" y="${y(d.total) - 15}" text-anchor="middle">${d.total}명</text>
            <text class="chart-label" x="${x(i)}" y="${height - 18}" text-anchor="middle">${d.year}</text>
          `,
        )
        .join("")}
    </svg>
  `;
}

function svgHorizontalBarChart(data, title) {
  const width = 720;
  const height = 390;
  const margin = { top: 86, right: 42, bottom: 34, left: 150 };
  const plotW = width - margin.left - margin.right;
  const barH = 40;
  const gap = 16;
  const max = Math.max(...data.map((d) => d.total));
  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(title)}">
      <text class="chart-title" x="${margin.left}" y="48">${escapeHtml(title)}</text>
      ${data
        .map((d, idx) => {
          const y = margin.top + idx * (barH + gap);
          const w = (d.total / max) * plotW;
          return `
            <text class="chart-label" x="${margin.left - 14}" y="${y + 25}" text-anchor="end">${escapeHtml(d.country)}</text>
            <rect x="${margin.left}" y="${y}" width="${w}" height="${barH}" rx="6" fill="${idx === 0 ? COLORS.teal : COLORS.blue}" />
            <text class="chart-value" x="${margin.left + w + 10}" y="${y + 25}">${d.total}</text>
          `;
        })
        .join("")}
    </svg>
  `;
}

function svgDropoutChart(data, title) {
  const width = 720;
  const height = 390;
  const margin = { top: 86, right: 42, bottom: 96, left: 92 };
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;
  const max = 8;
  const barW = 100;
  const colors = [COLORS.green, COLORS.red, COLORS.teal];
  const x = (idx) => margin.left + idx * (plotW / data.length) + (plotW / data.length - barW) / 2;
  const y = (value) => margin.top + plotH - (value / max) * plotH;
  const grid = [0, 2, 4, 6, 8]
    .map(
      (tick) => `
        <line class="chart-grid" x1="${margin.left}" x2="${width - margin.right}" y1="${y(tick)}" y2="${y(tick)}" />
        <text class="chart-label" x="${margin.left - 12}" y="${y(tick) + 4}" text-anchor="end">${tick}%</text>
      `,
    )
    .join("");
  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(title)}">
      <text class="chart-title" x="${margin.left}" y="48">${escapeHtml(title)}</text>
      ${grid}
      ${data
        .map((d, idx) => {
          const h = margin.top + plotH - y(d.rate);
          const labelLines = d.label.split("\n");
          return `
            <rect x="${x(idx)}" y="${y(d.rate)}" width="${barW}" height="${h}" rx="7" fill="${colors[idx]}" />
            <text class="chart-value" x="${x(idx) + barW / 2}" y="${y(d.rate) - 24}" text-anchor="middle">${d.rate.toFixed(1)}%</text>
            <text class="chart-label" x="${x(idx) + barW / 2}" y="${y(d.rate) - 7}" text-anchor="middle">${d.dropout}/${d.enrolled}</text>
            <text class="chart-label" x="${x(idx) + barW / 2}" y="${height - 42}" text-anchor="middle">${escapeHtml(labelLines[0])}</text>
            <text class="chart-label" x="${x(idx) + barW / 2}" y="${height - 24}" text-anchor="middle">${escapeHtml(labelLines[1])}</text>
          `;
        })
        .join("")}
    </svg>
  `;
}

function svgStackedBarChart(data, title, categories, maxValue, isPercent = false) {
  const width = 720;
  const height = 390;
  const margin = { top: 86, right: 28, bottom: 112, left: 92 };
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;
  const colors = {
    "수능위주": COLORS.blue,
    "학생부교과": COLORS.teal,
    "학생부종합": COLORS.gold,
    "실기위주": COLORS.red,
    "기타": COLORS.muted || "#5d6876",
    A: COLORS.teal,
    B: COLORS.blue,
    C: COLORS.gold,
    D: COLORS.red,
    F: COLORS.violet,
  };
  const barW = 104;
  const x = (idx) => margin.left + idx * (plotW / data.length) + (plotW / data.length - barW) / 2;
  const y = (value) => margin.top + plotH - (value / maxValue) * plotH;
  const gridTicks = isPercent ? [0, 25, 50, 75, 100] : [0, 500, 1000, 1500];
  const grid = gridTicks
    .map(
      (tick) => `
        <line class="chart-grid" x1="${margin.left}" x2="${width - margin.right}" y1="${y(tick)}" y2="${y(tick)}" />
        <text class="chart-label" x="${margin.left - 12}" y="${y(tick) + 4}" text-anchor="end">${tick}${isPercent ? "%" : ""}</text>
      `,
    )
    .join("");
  const bars = data
    .map((row, idx) => {
      let cursor = 0;
      const segments = categories
        .map((cat) => {
          const value = row.values[cat] || 0;
          const segmentY = y(cursor + value);
          const segmentH = y(cursor) - segmentY;
          cursor += value;
          return `<rect x="${x(idx)}" y="${segmentY}" width="${barW}" height="${segmentH}" fill="${colors[cat]}" />`;
        })
        .join("");
      return `
        ${segments}
        <text class="chart-label" x="${x(idx) + barW / 2}" y="${height - 42}" text-anchor="middle">${escapeHtml(row.year)}</text>
      `;
    })
    .join("");
  const legend = categories
    .map((cat, idx) => {
      const lx = margin.left + idx * 112;
      return `
        <rect x="${lx}" y="${height - 24}" width="12" height="12" rx="2" fill="${colors[cat]}" />
        <text class="chart-label" x="${lx + 18}" y="${height - 14}">${escapeHtml(cat)}</text>
      `;
    })
    .join("");
  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(title)}">
      <text class="chart-title" x="${margin.left}" y="48">${escapeHtml(title)}</text>
      ${grid}
      ${bars}
      ${legend}
    </svg>
  `;
}

const slides = [
  {
    type: "cover",
    title: "AI 에이전트로\n데이터 분석 및\n발표자료 제작",
    subtitle: "한성대학교 교수법 워크숍 | 4시간 실습형 진행안",
    body: `
      <div class="cover-layout">
        <div>
          <div class="cover-kicker">한성대학교 교수법 워크숍</div>
          <h1 class="cover-title">AI 에이전트로<br />데이터 분석 및<br />발표자료 제작</h1>
          <p class="cover-subtitle">설치 → 데이터 읽기 → 분석/검증 → 동적 HTML 발표자료 → Q&A 클리닉</p>
        </div>
        <div class="cover-card">
          ${card("오늘의 산출물", "참가자는 AI 에이전트에게 로컬 엑셀 자료를 읽히고, 핵심 인사이트를 검증한 뒤, GitHub Pages에 올릴 수 있는 발표자료 초안까지 만들어본다.", COLORS.gold, true)}
          ${card("강사의 메시지", "좋은 프롬프트 한 줄보다 중요한 것은 자료 확인, 이상 징후 발견, 정제, 검증, 산출물 연결의 작업 흐름이다.", COLORS.red, true)}
        </div>
      </div>
    `,
    notes: "시작 3분 안에 오늘은 코딩 강의가 아니라 업무 자료를 AI와 함께 다루는 워크숍이라고 잡아주세요. 최종 산출물이 PPTX가 아니라 웹 슬라이드라는 점도 여기서 명확히 말합니다.",
  },
  {
    section: "오프닝",
    title: "오늘 4시간의 약속",
    subtitle: "설치가 끝나는 순간부터 실제 자료를 다루는 경험으로 연결합니다.",
    body: `
      <div class="metric-row">
        ${metric("1h", "설치와 작업 폴더 열기", COLORS.teal)}
        ${metric("1h", "데이터 분석", COLORS.blue)}
        ${metric("1h", "HTML 발표자료 제작", COLORS.gold)}
        ${metric("1h", "Q&A 클리닉", COLORS.red)}
      </div>
      <div class="grid grid--2" style="margin-top:26px">
        ${card("학습 목표", "AI 에이전트에게 로컬 엑셀 파일을 읽히고, 분석 질문을 만들고, 결과를 검증하고, 웹 발표자료 초안까지 요청하는 전체 흐름을 익힌다.")}
        ${card("진행 원칙", "코드를 외우게 하지 않는다. 대신 무엇을 확인하라고 시킬 것인가와 결과를 어떻게 의심하고 고칠 것인가를 반복한다.", COLORS.red)}
      </div>
    `,
    notes: "참가자가 개발자가 아니어도 괜찮다는 안심을 먼저 줍니다. 오늘의 핵심은 도구 기능이 아니라 일하는 순서입니다.",
  },
  {
    section: "오프닝",
    title: "전체 시간표",
    subtitle: "설치 편차를 감안해 앞 1시간은 여유 있게, 나머지는 데모-실습-검증으로 짧게 반복합니다.",
    body: table(
      ["시간", "세션", "강사 행동", "참가자 산출물"],
      [
        ["00:00-00:10", "문제 설정", "AI 에이전트 워크플로 소개", "오늘 다룰 자료 이해"],
        ["00:10-00:50", "Codex 설치/접속", "로그인, 폴더 열기, 권한 설명", "작업 폴더 연결"],
        ["00:50-01:00", "첫 프롬프트", "파일 목록 파악 시연", "데이터 목록 요약"],
        ["01:00-02:00", "데이터 분석", "정제, 차트, 검증 프롬프트", "핵심 인사이트 1개"],
        ["02:00-03:00", "HTML 발표자료 제작", "분석 결과를 웹 슬라이드로 전환", "동적 발표자료 초안"],
        ["03:00-04:00", "Q&A 클리닉", "개인/학과 자료 적용 상담", "다음 실천 과제"],
      ],
    ),
    notes: "휴식은 현장 상태에 맞춰 5-10분씩 넣습니다. 설치가 늦는 참가자는 옆 사람 화면을 보며 검증자 역할을 맡게 합니다.",
  },
  {
    section: "오프닝",
    title: "강사용 사전 준비 체크리스트",
    subtitle: "현장에서 설치가 길어질수록 예비 자료와 데모 동선이 중요합니다.",
    body: `
      <div class="grid grid--3">
        ${card("파일", "data 폴더가 참가자 PC에 내려받아졌는지 확인\n파일명 한글/공백이 그대로 유지되는지 확인\n데모용 백업 폴더를 준비")}
        ${card("환경", "OpenAI 계정 로그인 가능 여부 확인\n기관 네트워크 접속 차단 여부 확인\n설치 실패자를 위한 페어 실습 배치", COLORS.gold)}
        ${card("운영", "강사용 프롬프트 카드 열어두기\n결과가 다르게 나올 때 보여줄 기준 수치 준비\n개인정보 자료 입력 금지 원칙 안내", COLORS.red)}
      </div>
      <div style="margin-top:28px">${bullets(["설치가 안 된 참가자는 관찰자가 아니라 검증자 역할을 맡깁니다.", "강사는 결과의 정답보다 확인 질문을 어떻게 이어가는가를 계속 보여줍니다.", "AI가 한 번에 못 읽는 상황을 실패가 아니라 좋은 교육 장면으로 사용합니다."])}</div>
    `,
    notes: "이 슬라이드는 실제 발표에서는 빠르게 넘기고, 강사 본인의 체크용으로 활용하면 됩니다.",
  },
  {
    section: "설치",
    title: "Codex 설치/접속 안내에서 말할 것",
    subtitle: "제품 메뉴는 바뀔 수 있으니, 오늘 필요한 개념만 짧게 전달합니다.",
    body: `
      <div class="grid grid--2">
        ${card("핵심 설명", "Codex는 로컬 작업 폴더를 읽고 파일을 만들며 명령을 실행하는 AI 에이전트 경험이다. 오늘은 코드를 잘 쓰는 것보다 일을 맡기는 흐름을 배운다.")}
        ${card("계정/권한", "공식 Codex 매뉴얼 기준으로 Codex는 ChatGPT 플랜과 API credits 사용 경로가 있다. 기관/계정 정책은 현장 상황에 맞춰 확인한다.", COLORS.gold)}
        ${card("오늘의 기준", "Codex 앱에서 이 워크숍 폴더를 열고 data 폴더의 엑셀을 읽는 흐름으로 진행한다. 승인 요청이 뜨면 무엇을 허용하는지 확인한다.", COLORS.blue)}
        ${card("피해야 할 설명", "설치 명령과 제품 메뉴 이름을 오래 설명하지 않는다. 강의 당일 공식 안내 화면을 띄우고, 바로 폴더 열기와 첫 프롬프트로 넘어간다.", COLORS.red)}
      </div>
    `,
    notes: "설치 안내는 길어지기 쉽습니다. 제품 기능보다 오늘의 작업 폴더와 권한 범위에 집중하세요.",
  },
  {
    section: "설치",
    title: "권한과 보안: 처음에 잡아줄 태도",
    subtitle: "AI 에이전트는 파일과 명령을 다룰 수 있으므로 승인 전 확인을 습관화합니다.",
    body: `
      ${timeline([
        { title: "읽기", subtitle: "파일 내용 파악" },
        { title: "쓰기", subtitle: "새 파일 생성" },
        { title: "명령 실행", subtitle: "분석/변환" },
        { title: "승인", subtitle: "허용 범위 확인" },
      ])}
      <div class="grid grid--2" style="margin-top:30px">
        ${card("강사가 강조할 문장", "AI가 요청하는 권한은 왜 필요한지 보고 허용합니다. 오늘은 워크숍 폴더 안의 실습 파일을 읽고 결과물을 만드는 범위에서만 진행합니다.")}
        ${card("민감정보 원칙", "학생 개인 식별정보, 성적 원자료, 상담 내용, 민감 설문 응답은 익명화 전에는 넣지 않습니다. 공개 가능한 예제 데이터로 먼저 흐름을 익힙니다.", COLORS.red)}
      </div>
    `,
    notes: "보안 이야기는 겁주는 방식보다 실무 기준을 제시하는 방식이 좋습니다. 파일 범위와 개인정보 두 가지만 분명히 잡습니다.",
  },
  {
    section: "설치",
    title: "첫 프롬프트: 폴더를 열었는지 확인",
    subtitle: "설치가 끝난 참가자는 곧바로 파일 목록을 읽게 합니다.",
    body: `
      <div class="two-column">
        ${promptBox("실습 프롬프트", PROMPTS.inventory)}
        <div class="grid">
          ${card("기대 결과", "4개 주제 × 3개년 구조를 인식한다.\n전공과목 성적 분포, 입학전형, 외국학생 현황, 중도탈락을 구분한다.\n분석 전에 질문을 먼저 만든다.")}
          ${card("강사의 관찰 포인트", "참가자 화면에서 파일 경로가 다르면 바로 드러난다.\nAI가 엉뚱한 파일을 상상하면 실제 파일명만 근거로 하라고 다시 지시한다.", COLORS.gold)}
        </div>
      </div>
    `,
    notes: "첫 성공 경험이 중요합니다. 복잡한 분석 전에 내 폴더를 AI가 보고 있다는 감각을 만들어주세요.",
  },
  {
    type: "section",
    sectionClass: "section-dark",
    sectionNumber: "PART 1",
    title: "데이터 분석 실습",
    subtitle: "깔끔한 예제 대신 실제 행정 엑셀의 불편함을 그대로 다룹니다.",
    notes: "여기서부터는 데모-실습-검증 루프를 짧게 반복합니다.",
  },
  {
    section: "분석",
    title: "오늘의 데이터 지도",
    subtitle: "대학 행정 데이터 4종을 3개년으로 비교합니다.",
    body: table(
      ["주제", "파일 수", "복원된 행 수", "분석 질문"],
      [
        ["전공과목 성적 분포", "3", "3,177", "성적 분포가 어떻게 바뀌었나?"],
        ["입학전형 유형별 선발 결과", "3", "80", "전형별 등록 규모와 등록률은?"],
        ["외국학생 현황", "3", "79", "외국학생 수와 국가 구성은?"],
        ["외국학생 중도탈락 현황", "3", "78", "중도탈락률은 어느 해에 높았나?"],
      ],
    ) + `<div style="margin-top:26px">${bullets(["분석은 정답 찾기보다 질문을 세우고 확인하는 과정으로 진행합니다.", "각 주제마다 합계 행, 기준연도, 단위, 빈칸 반복 여부를 먼저 확인합니다."])}</div>`,
    notes: "참가자에게 여러분이라면 어떤 질문을 먼저 하겠습니까라고 묻고 2-3개만 받습니다.",
  },
  {
    section: "분석",
    title: "좋은 실습 자료인 이유",
    subtitle: "이 파일들은 완벽히 정제된 데이터가 아니라 실제 업무에서 만나는 문제를 품고 있습니다.",
    body: `
      <div class="grid grid--3">
        ${card("문제 1: 겉보기 오류", "엑셀 내부 dimension 값이 A1로 저장되어 일반 판독기는 한 칸짜리 파일처럼 착각할 수 있다.", COLORS.red)}
        ${card("문제 2: 병합 헤더", "제목 행, 설명 행, 2단 헤더, 합계 행이 섞여 있어 바로 표 분석을 하기 어렵다.", COLORS.gold)}
        ${card("문제 3: 빈칸 반복", "학과명, 전형유형, 기준연도 등이 첫 행에만 있고 아래 행은 빈칸이라 carry-forward가 필요하다.", COLORS.teal)}
      </div>
      <div style="margin-top:26px">${promptBox("실패했을 때 이어가는 프롬프트", PROMPTS.failure)}</div>
    `,
    notes: "AI가 틀렸을 때 바로 포기하지 않고 왜 그렇게 읽었는지 확인해줘라고 시키는 장면을 보여줍니다.",
  },
  {
    section: "분석",
    title: "AI 에이전트 분석 흐름",
    subtitle: "한 번에 끝내지 않고 짧은 루프를 반복합니다.",
    body: `
      ${timeline([
        { title: "1 탐색", subtitle: "파일/시트/행열" },
        { title: "2 정제", subtitle: "헤더/빈칸/단위" },
        { title: "3 분석", subtitle: "추이/비교/순위" },
        { title: "4 검증", subtitle: "합계/샘플/해석" },
        { title: "5 산출", subtitle: "차트/슬라이드" },
      ])}
      <div class="grid grid--2" style="margin-top:30px">
        ${card("강사의 핵심 멘트", "AI 에이전트에게 분석해줘라고만 말하면 결과는 그럴듯하지만 약합니다. 먼저 자료를 확인시키고, 이상한 점을 찾게 하고, 그 다음 분석을 요청해야 합니다.")}
        ${card("반복 질문 예시", "방금 계산한 합계가 원본의 합계 행과 맞아?\n빈칸은 위 행 값으로 채워야 하나?\n파일명 연도와 기준연도가 같은 뜻이야?", COLORS.red)}
      </div>
    `,
    notes: "이 슬라이드는 전체 실습의 기준점입니다. 이후 모든 데모를 이 5단계 중 어디에 해당하는지 연결해 말합니다.",
  },
  {
    section: "분석",
    title: "라이브 데모 1: 데이터 목록과 구조 파악",
    subtitle: "참가자들이 그대로 따라 할 수 있는 첫 분석 프롬프트입니다.",
    body: `
      <div class="two-column">
        ${promptBox("실습 프롬프트", PROMPTS.structure)}
        <div class="grid">
          ${card("강사가 확인할 것", "파일이 12개인지\n4개 주제 × 3개년 구조인지\n엑셀 dimension 문제를 발견했는지\n행 수가 제목 한 줄로만 나오지 않는지")}
          ${card("결과가 이상할 때", "AI에게 일반 판독기로 읽은 행 수와 내부 XML의 셀 수를 비교해줘라고 지시합니다. 이 장면이 에이전트 활용법의 핵심입니다.", COLORS.red)}
        </div>
      </div>
    `,
    notes: "프롬프트 끝의 근거를 보여줘가 중요합니다. 참가자에게 이 표현을 자주 쓰게 하세요.",
  },
  {
    section: "분석",
    title: "라이브 데모 2: 정제 기준 정하기",
    subtitle: "병합 헤더와 빈칸 반복을 분석 가능한 표로 바꾸게 합니다.",
    body: `
      <div class="two-column">
        ${promptBox("실습 프롬프트", PROMPTS.cleanGrades)}
        <div class="grid">
          ${card("정제 규칙 예시", "제목/작성자 행 제외\n헤더 행 이후만 사용\n학과명, 구분, 학기 등은 빈칸일 때 위 행 값으로 채움\n등급 표기는 공백 제거: A + → A+", COLORS.gold)}
          ${card("검증 규칙 예시", "등급별 학생수 합계가 성적인정 학생총수와 크게 어긋나지 않는지 확인\n연도별 합계와 차트 값이 같은지 확인")}
        </div>
      </div>
    `,
    notes: "정제는 자동화보다 설명 가능성이 중요하다고 말합니다. 참가자가 규칙을 이해해야 결과를 믿을 수 있습니다.",
  },
  {
    section: "분석",
    title: "외국학생 총원은 3년간 증가",
    subtitle: "2023년 380명에서 2025년 506명으로 증가했습니다.",
    body: chartShell(
      svgLineChart(DATA.foreignTotals, "외국학생 총원 추이"),
      "외국학생 총원은 2023→2025년에 126명 증가했습니다. 이 변화는 이후 국가별 구성 변화와 함께 읽어야 합니다.",
      "이 차트만 보고 결론을 낸다면 무엇을 놓칠 수 있을까요?",
    ),
    notes: "첫 번째 쉬운 성공 차트입니다. 단순 추이를 먼저 잡고, 바로 국가별 구성으로 한 단계 내려갑니다.",
  },
  {
    section: "분석",
    title: "2025년 국가는 베트남 비중이 큼",
    subtitle: "상위 국가 구성이 전체 증가 해석의 핵심입니다.",
    body: chartShell(
      svgHorizontalBarChart(DATA.foreignCountries2025, "2025년 외국학생 상위 국가"),
      "2025년 상위 국가 중 베트남이 333명으로 가장 큽니다. 총원 증가가 특정 국가 증가에 의해 얼마나 설명되는지 질문할 수 있습니다.",
      "학생지원, 수업 운영, 언어 지원 관점에서 어떤 후속 질문이 필요할까요?",
      COLORS.blue,
    ),
    notes: "비중 집중은 좋다/나쁘다 결론보다 지원 체계가 어디에 집중되어야 하는가로 연결하면 교수법 워크숍에 맞습니다.",
  },
  {
    section: "분석",
    title: "중도탈락률은 기준연도 확인이 필요",
    subtitle: "파일명 연도와 실제 기준연도가 한 해 차이 납니다.",
    body: chartShell(
      svgDropoutChart(DATA.dropoutRates, "외국학생 중도탈락률"),
      "공시 2024 파일의 기준연도 2023 중도탈락률이 6.3%로 가장 높습니다. 단, 파일명 연도와 기준연도를 분리해 설명해야 합니다.",
      "파일명 연도와 기준연도를 혼동하면 어떤 잘못된 설명이 생길까요?",
    ),
    notes: "데이터 해석 주의점을 강조하기 좋은 슬라이드입니다. AI에게 기준연도 차이를 설명하라고 시키면 좋은 토론이 됩니다.",
  },
  {
    section: "분석",
    title: "입학전형 등록인원은 유형별로 재배치",
    subtitle: "수능위주, 학생부교과, 학생부종합의 상대적 규모를 비교합니다.",
    body: chartShell(
      svgStackedBarChart(DATA.admissionsByType, "입학전형 유형별 등록인원", ["수능위주", "학생부교과", "학생부종합", "실기위주", "기타"], 1800),
      "2024-2025년에는 수능위주 등록인원이 크게 보이고, 학생부종합은 2025년에 감소합니다. 모집 구조 변화와 함께 해석해야 합니다.",
      "전형별 등록인원 변화와 수업 운영은 어떤 방식으로 연결될 수 있을까요?",
      COLORS.gold,
    ),
    notes: "이 차트는 행정 데이터를 슬라이드 메시지로 바꾸는 예로 다룹니다. 전형 변화 자체의 원인 단정은 피합니다.",
  },
  {
    section: "분석",
    title: "전공과목 성적 분포는 A/B 구간이 변동",
    subtitle: "2023년 A 비율이 높고, 2024-2025년에는 B 비율이 커집니다.",
    body: chartShell(
      svgStackedBarChart(DATA.grades, "전공과목 성적 분포 변화", ["A", "B", "C", "D", "F"], 100, true),
      "A구간 비율은 2023년 49.6%, 2024년 40.9%, 2025년 43.2%입니다. 평가정책, 과목구성, 수강생 규모 차이를 함께 확인해야 합니다.",
      "성적 분포 변화에서 데이터만으로 말할 수 있는 것과 말할 수 없는 것은 무엇일까요?",
      COLORS.teal,
    ),
    notes: "성적 데이터는 민감하게 들릴 수 있으므로 개별 교수 평가가 아니라 집계 데이터 읽기라고 선을 긋습니다.",
  },
  {
    section: "분석",
    title: "참가자 실습: 인사이트 1개 만들기",
    subtitle: "정답보다 근거가 있는 한 문장을 만드는 훈련입니다.",
    body: `
      <div class="grid grid--3">
        ${card("1. 질문", "내가 궁금한 질문을 하나 고른다.\n예: 외국학생 증가는 어느 국가가 이끌었나?")}
        ${card("2. 분석", "AI에게 필요한 파일과 계산 방법을 지정한다.\n예: 2023-2025 국가별 총원 증감 계산", COLORS.blue)}
        ${card("3. 검증", "합계 행, 상위 3개 샘플, 연도 기준을 확인한다.\n예: 총원 증가와 국가별 증가 합계 비교", COLORS.gold)}
      </div>
      <div style="margin-top:26px">${promptBox("실습 프롬프트", PROMPTS.countryGrowth)}</div>
    `,
    notes: "실습 시간은 12분 정도가 적당합니다. 결과 공유는 2-3명만 받고, 나머지는 Q&A 시간에 이어갑니다.",
  },
  {
    section: "분석",
    title: "검증 체크리스트",
    subtitle: "AI 분석 결과를 믿기 전에 최소한 이 네 가지를 확인합니다.",
    body: `
      <div class="grid grid--4">
        ${card("행 수", "파일을 실제로 읽었는가?\n제목 한 줄만 읽고 분석한 것은 아닌가?", COLORS.red)}
        ${card("합계", "원본 합계 행과 계산 결과가 맞는가?\n비율의 분모가 무엇인가?")}
        ${card("기준", "파일명 연도와 기준연도는 같은가?\n학기, 모집시기, 학생 구분이 섞였는가?", COLORS.gold)}
        ${card("해석", "차트가 보여주는 것과 결론이 일치하는가?\n추가로 필요한 맥락은 무엇인가?", COLORS.blue)}
      </div>
      <div style="margin-top:28px">${promptBox("검증 프롬프트", PROMPTS.validation)}</div>
    `,
    notes: "AI를 잘 쓰는 사람은 결과를 빨리 받는 사람이 아니라 검증 루프를 돌리는 사람이라고 말합니다.",
  },
  {
    type: "section",
    sectionClass: "section-teal",
    sectionNumber: "PART 2",
    title: "동적 HTML 발표자료 제작",
    subtitle: "분석 결과를 링크로 배포 가능한 웹 슬라이드로 바꿉니다.",
    notes: "여기서는 PPTX가 아니라 GitHub Pages로 공유할 수 있는 HTML 슬라이드라는 장점을 분명히 말합니다.",
  },
  {
    section: "제작",
    title: "분석 결과를 발표 스토리로 바꾸기",
    subtitle: "차트가 아니라 메시지가 슬라이드의 중심입니다.",
    body: `
      ${timeline([
        { title: "결론", subtitle: "한 문장" },
        { title: "근거", subtitle: "숫자/차트" },
        { title: "해석", subtitle: "왜 중요한가" },
        { title: "다음 질문", subtitle: "추가 확인" },
      ])}
      <div class="grid grid--2" style="margin-top:30px">
        ${card("나쁜 요청", "분석 결과로 발표자료 만들어줘.\n→ 구조는 나오지만 메시지가 흐려지고 차트가 장식처럼 들어갈 가능성이 큽니다.", COLORS.red)}
        ${card("좋은 요청", "청중은 대학 교수이고, 목표는 AI 에이전트 활용법 교육입니다. 데이터 분석 결과를 8장짜리 실습 발표자료로 구성해줘.\n→ 청중, 목적, 장수, 톤, 차트 기준이 들어갑니다.")}
      </div>
    `,
    notes: "발표자료 제작도 한 번에 끝내지 않습니다. 구성안 → HTML 구조 → 차트 → 배포 순서가 좋습니다.",
  },
  {
    section: "제작",
    title: "추천 발표 구성: 8장",
    subtitle: "참가자가 자신의 분석 결과를 짧은 발표로 바꿀 때 쓰는 기본 틀입니다.",
    body: table(
      ["장", "제목", "핵심 메시지", "시각자료"],
      [
        ["1", "문제 제기", "AI 에이전트로 업무 데이터를 다룰 수 있다", "작업 흐름"],
        ["2", "데이터 소개", "4개 주제, 3개년 자료를 분석했다", "데이터 지도"],
        ["3", "품질 이슈", "겉보기와 실제 데이터 구조가 달랐다", "오류 도식"],
        ["4", "인사이트 1", "외국학생 총원이 증가했다", "추이선"],
        ["5", "인사이트 2", "국가 구성 변화가 중요하다", "막대그래프"],
        ["6", "인사이트 3", "전형/성적 분포도 비교 가능하다", "요약 차트"],
        ["7", "검증", "합계와 기준연도를 확인했다", "체크리스트"],
        ["8", "적용", "내 수업/학과 자료에 적용할 질문", "다음 질문"],
      ],
    ),
    notes: "참가자에게는 8장 전체 제작보다 3장만 만들어도 좋다고 말합니다. 중요한 건 구성의 논리입니다.",
  },
  {
    section: "제작",
    title: "구성안 요청 프롬프트",
    subtitle: "먼저 HTML 파일을 만들게 하지 말고, 슬라이드 설계부터 받습니다.",
    body: `
      <div class="two-column">
        ${promptBox("구성안 프롬프트", PROMPTS.storyboard)}
        <div class="grid">
          ${card("강사의 수정 지시 예", "슬라이드 제목을 결론형으로 바꿔줘.\n차트가 없는 장에는 어떤 표가 필요한지 제안해줘.\n청중이 교수라는 점을 반영해 수업/교육행정 적용 예를 넣어줘.")}
          ${card("체크 포인트", "장수가 맞는가?\n각 장마다 메시지가 하나인가?\n데이터와 무관한 일반론이 많지 않은가?", COLORS.gold)}
        </div>
      </div>
    `,
    notes: "파일 생성보다 구성안 검토가 먼저입니다. 이 순서를 지키면 결과물이 훨씬 좋아집니다.",
  },
  {
    section: "제작",
    title: "동적 HTML 슬라이드 생성 프롬프트",
    subtitle: "발표 화면, 차트, 메모, 배포 조건을 한 번에 지정합니다.",
    body: `
      <div class="two-column">
        ${promptBox("HTML 생성 프롬프트", PROMPTS.htmlDeck)}
        <div class="grid">
          ${card("왜 HTML인가", "링크 하나로 배포할 수 있다.\n수정 후 즉시 재배포하기 쉽다.\n프롬프트 복사, 메모 토글, 차트 상호작용 같은 동적 요소를 넣을 수 있다.")}
          ${card("현장 운영 팁", "참가자 전체가 동시에 완성형 HTML을 만들기보다, 먼저 구성안과 1-2장 슬라이드 초안을 만들게 하면 안정적입니다.", COLORS.red)}
        </div>
      </div>
    `,
    notes: "이 강의 자료 자체가 이 방식으로 만들어졌다고 보여주면 설득력이 좋습니다.",
  },
  {
    section: "제작",
    title: "GitHub Pages 배포 흐름",
    subtitle: "정적 HTML은 빌드 없이 저장소의 하위 폴더에서 바로 서비스할 수 있습니다.",
    body: `
      ${timeline([
        { title: "1 폴더", subtitle: "발표자료/slide" },
        { title: "2 파일", subtitle: "index.html, CSS, JS" },
        { title: "3 커밋", subtitle: "GitHub에 push" },
        { title: "4 Pages", subtitle: "브랜치 배포 설정" },
        { title: "5 공유", subtitle: "하위 경로 링크 전달" },
      ])}
      <div class="grid grid--2" style="margin-top:30px">
        ${card("예상 접속 경로", "https://<github-id>.github.io/workshop-hansung/%EB%B0%9C%ED%91%9C%EC%9E%90%EB%A3%8C/slide/", COLORS.blue)}
        ${card("강사용 주의", "한글 폴더명은 브라우저에서 자동 인코딩됩니다. 공유할 때는 실제 열리는 주소를 복사해서 전달하는 것이 가장 안전합니다.", COLORS.gold)}
      </div>
    `,
    notes: "GitHub Pages 설정은 저장소 Settings에서 하는 일이라 수업 중에는 데모만 보여주고, 참가자는 사후 과제로 해도 됩니다.",
  },
  {
    section: "제작",
    title: "좋은 웹 슬라이드로 고치는 기준",
    subtitle: "AI가 만든 초안은 끝이 아니라 첫 편집본입니다.",
    body: `
      <div class="grid grid--3">
        ${card("제목", "주제형보다 결론형으로 바꾼다.\n예: 외국학생 현황 → 외국학생은 3년간 126명 증가")}
        ${card("차트", "한 슬라이드에 메시지 하나만 남긴다.\n축, 단위, 기준연도, 데이터 출처를 확인한다.", COLORS.gold)}
        ${card("화면", "프로젝터에서 글자가 작지 않은가?\n모바일에서는 핵심 내용이 먼저 보이는가?", COLORS.blue)}
        ${card("동작", "이전/다음 이동이 되는가?\n복사 버튼, 메모 토글이 발표를 방해하지 않는가?", COLORS.green)}
        ${card("검증", "합계가 맞는지, 기준이 섞이지 않았는지, 결론이 데이터 범위를 넘지 않는지 확인한다.", COLORS.red)}
        ${card("청중", "기능 나열보다 내 수업과 업무에 어떻게 적용할까로 연결한다.", COLORS.violet)}
      </div>
    `,
    notes: "참가자에게 AI가 초안을 만들면 내 역할은 편집장이라고 표현하면 이해가 빠릅니다.",
  },
  {
    section: "제작",
    title: "발표자 메모까지 요청하기",
    subtitle: "자료 제작과 강의 진행을 함께 준비하게 합니다.",
    body: `
      <div class="two-column">
        ${promptBox("메모 작성 프롬프트", PROMPTS.notes)}
        <div class="grid">
          ${card("강사용으로 특히 좋은 이유", "설치 지연이나 질문으로 흐름이 끊겨도 다음 멘트를 빠르게 회복할 수 있습니다.\n보조강사에게도 같은 진행 기준을 공유할 수 있습니다.")}
          ${card("주의", "메모를 그대로 읽으면 강의가 딱딱해집니다. 메모는 진행의 난간으로 쓰고, 현장 반응에 맞춰 줄입니다.", COLORS.gold)}
        </div>
      </div>
    `,
    notes: "발표자료 제작이 디자인만이 아니라 진행 준비라는 점을 강조하세요.",
  },
  {
    type: "section",
    sectionClass: "section-red",
    sectionNumber: "PART 3",
    title: "Q&A와 적용 클리닉",
    subtitle: "질문을 받아주되, 각자의 업무 자료로 옮겨가는 시간으로 설계합니다.",
    notes: "마지막 시간은 자유 질문을 받되 세 범주로 묶어 진행하면 산만함이 줄어듭니다.",
  },
  {
    section: "Q&A",
    title: "마지막 1시간 운영법",
    subtitle: "자유 Q&A만 하면 산만해지므로, 적용 클리닉 메뉴를 제시합니다.",
    body: `
      <div class="grid grid--3">
        ${card("A. 내 자료 진단", "파일 구조가 복잡한 엑셀\n학과/수업 운영 데이터\n설문 응답 데이터")}
        ${card("B. 분석 질문 만들기", "무엇을 비교할지\n어떤 기준으로 나눌지\n어떤 검증이 필요한지", COLORS.gold)}
        ${card("C. 발표자료 바꾸기", "결론형 제목\n차트 선택\n강사용 메모 작성\nHTML 배포 흐름", COLORS.blue)}
      </div>
      <div class="grid grid--2" style="margin-top:28px">
        ${card("운영 방식", "1) 질문을 세 범주 중 하나로 받기\n2) 한 사람의 화면으로 5분 클리닉\n3) 전체에게 일반화할 수 있는 프롬프트를 남기기", COLORS.red)}
        ${card("강사의 기준", "개별 문제를 모두 해결하려 하지 말고, 참가자들이 다음에 혼자 이어갈 수 있는 질문 구조를 남깁니다.", COLORS.green)}
      </div>
    `,
    notes: "질문을 즉흥적으로 모두 받지 말고 메뉴화하면 마지막 시간이 훨씬 차분해집니다.",
  },
  {
    section: "Q&A",
    title: "예상 질문과 답변",
    subtitle: "강사가 자주 받게 될 질문을 미리 준비합니다.",
    body: table(
      ["질문", "짧은 답변"],
      [
        ["코딩을 몰라도 가능한가요?", "가능합니다. 다만 결과를 검증하는 질문을 배워야 합니다."],
        ["개인 성적표를 넣어도 되나요?", "식별정보와 민감정보는 익명화 전에는 넣지 않는 것이 원칙입니다."],
        ["AI가 틀리면 어떻게 하나요?", "행 수, 합계, 샘플 행, 기준연도를 확인하게 하고 근거를 요구합니다."],
        ["HTML이 PPT보다 어려운가요?", "생성은 AI에게 맡기고, 강사는 구조와 검증 기준을 제시하면 됩니다."],
        ["GitHub Pages가 어려우면요?", "수업 중에는 로컬 HTML로 확인하고, 배포는 사후 과제로 처리해도 됩니다."],
        ["엑셀이 안 읽히면요?", "일반 판독 실패인지, 내부 구조 문제인지 먼저 진단하게 합니다."],
      ],
    ),
    notes: "질문 답변은 짧게 한 뒤, 가능한 경우 바로 프롬프트 예시로 바꿔 보여줍니다.",
  },
  {
    section: "Q&A",
    title: "문제가 생겼을 때의 복구 동선",
    subtitle: "현장에서 가장 많이 생길 상황을 미리 안내합니다.",
    body: `
      <div class="grid grid--3">
        ${card("설치 실패", "짝꿍 화면으로 관찰 실습\n강사 데모 중심으로 전환\n마지막에 개인 설치 재시도", COLORS.red)}
        ${card("파일 못 찾음", "작업 폴더 경로 확인\ndata 폴더 위치 확인\n파일명 변경 여부 확인", COLORS.gold)}
        ${card("분석 결과 이상", "행 수와 합계 확인\n원본 샘플 행 비교\n기준연도/단위 재확인")}
        ${card("HTML 생성 지연", "구성안만 먼저 만들기\n슬라이드 1-2장만 만들기\n강사 데모 파일 공유", COLORS.blue)}
        ${card("GitHub Pages 지연", "로컬 HTML로 발표\n배포는 사후 과제\n실제 URL은 강사 자료로 공유", COLORS.green)}
        ${card("네트워크 제한", "이미 준비한 분석 결과 사용\n프롬프트 설계 중심으로 진행\n사후에 파일 생성", COLORS.violet)}
      </div>
    `,
    notes: "복구 동선을 말해두면 문제가 생겨도 강의 분위기가 덜 흔들립니다.",
  },
  {
    section: "마무리",
    title: "마무리 메시지",
    subtitle: "오늘의 핵심은 도구가 아니라 작업 방식입니다.",
    body: `
      <div style="display:grid;place-items:center;height:58%;text-align:center">
        <h2 style="max-width:1080px;margin:0;font-size:42px;line-height:1.25">
          AI 에이전트 활용 능력은<br />
          '분석해줘'라고 말하는 능력이 아니라,<br />
          자료를 확인시키고, 이상한 점을 찾게 하고,<br />
          검증한 뒤, 산출물로 연결하는 능력입니다.
        </h2>
      </div>
      ${timeline([
        { title: "확인", subtitle: "무엇이 있는가" },
        { title: "질문", subtitle: "무엇을 알고 싶은가" },
        { title: "분석", subtitle: "어떻게 계산했나" },
        { title: "검증", subtitle: "맞는가" },
        { title: "전달", subtitle: "어떻게 말할까" },
      ])}
    `,
    notes: "마지막에는 오늘 만든 프롬프트 중 하나를 각자 저장하게 합니다. 내가 다음 주에 바로 써볼 질문으로 끝내면 좋습니다.",
  },
  {
    type: "section",
    sectionClass: "section-dark",
    sectionNumber: "APPENDIX",
    title: "프롬프트 카드",
    subtitle: "강사가 복사해서 바로 쓸 수 있는 실습 문장입니다.",
    notes: "부록은 시간 여유가 있을 때만 보여주고, 링크 공유용으로 남겨도 됩니다.",
  },
  {
    section: "부록",
    title: "프롬프트 카드 1: 탐색",
    subtitle: "파일을 읽기 전후에 근거를 남기게 합니다.",
    body: `
      <div class="two-column">
        ${promptBox("데이터 탐색", PROMPTS.structure)}
        ${promptBox("오류 진단", PROMPTS.failure)}
      </div>
    `,
    notes: "탐색 프롬프트는 모든 참가자가 성공해야 합니다. 여기서 흔들리면 뒤 실습이 어렵습니다.",
  },
  {
    section: "부록",
    title: "프롬프트 카드 2: 분석과 검증",
    subtitle: "분석 질문과 검증 질문을 붙여 씁니다.",
    body: `
      <div class="two-column">
        ${promptBox("분석", `외국학생 현황 2023-2025 파일을 분석해서
1) 총원 추이, 2) 국가별 상위 5개, 3) 증가분 상위 국가,
4) 해석상 주의점을 정리해줘.

표와 차트에 쓸 수 있는 데이터 형태로 결과를 만들어줘.`)}
        ${promptBox("검증", PROMPTS.validation)}
      </div>
    `,
    notes: "검증 프롬프트를 붙이는 습관을 워크숍의 가장 중요한 습관으로 남깁니다.",
  },
  {
    section: "부록",
    title: "프롬프트 카드 3: HTML 발표자료",
    subtitle: "분석 결과를 GitHub Pages용 산출물로 바꿉니다.",
    body: `
      <div class="two-column">
        ${promptBox("구성안", PROMPTS.storyboard)}
        ${promptBox("HTML 생성", PROMPTS.htmlDeck)}
      </div>
    `,
    notes: "참가자가 자기 자료에 적용할 때는 청중, 목적, 장수, 차트 종류를 반드시 바꾸게 합니다.",
  },
  {
    section: "부록",
    title: "개인정보와 민감정보 안내 문구",
    subtitle: "워크숍 시작 전에 짧게 읽어도 좋습니다.",
    body: `
      <div style="display:grid;place-items:center;height:70%;text-align:center">
        <p style="max-width:1080px;margin:0;font-size:30px;line-height:1.38;font-weight:800">
          오늘 실습에서는 공개 가능한 예제 데이터만 사용합니다.<br />
          학생 개인을 식별할 수 있는 이름, 학번, 연락처, 개별 성적,<br />
          상담 내용, 민감 설문 응답은 익명화 전에는 AI 도구에 입력하지 않습니다.<br /><br />
          업무 자료를 사용할 때는 기관 정책과 데이터 등급을 먼저 확인하고,<br />
          필요 최소한의 범위에서 집계·익명화한 뒤 분석합니다.
        </p>
      </div>
      <div class="note-strip">강사용 보충 | 개인정보 이슈는 AI를 쓰지 말자가 아니라 쓸 수 있는 데이터 상태로 만들자는 방향으로 설명합니다.</div>
    `,
    notes: "이 문구는 기관 정책에 맞춰 수정해서 쓰세요.",
  },
];

let currentIndex = getIndexFromHash();
let printing = false;

const stage = document.querySelector("#stage");
const slideNumber = document.querySelector("#slideNumber");
const progressBar = document.querySelector("#progressBar");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const notesBtn = document.querySelector("#notesBtn");
const closeNotes = document.querySelector("#closeNotes");
const notesPanel = document.querySelector("#notesPanel");
const notesBody = document.querySelector("#notesBody");
const overviewBtn = document.querySelector("#overviewBtn");
const closeOverview = document.querySelector("#closeOverview");
const overviewPanel = document.querySelector("#overviewPanel");
const overviewList = document.querySelector("#overviewList");
const printBtn = document.querySelector("#printBtn");

function getIndexFromHash() {
  const match = location.hash.match(/#\/(\d+)/);
  if (!match) return 0;
  return Math.min(Math.max(Number(match[1]) - 1, 0), slides.length - 1);
}

function slideClass(slide) {
  if (slide.type === "cover") return "slide slide--cover";
  if (slide.type === "section") return `slide slide--section ${slide.sectionClass || ""}`;
  return "slide";
}

function renderSlide(slide, index) {
  if (slide.type === "cover") {
    return `
      <article class="${slideClass(slide)}" data-slide="${index + 1}">
        <div class="slide__body">${slide.body}</div>
        <footer class="slide__footer">
          <span>자료 기준: data 폴더의 2023-2025년 대학 공시 엑셀 파일</span>
          <span>${String(index + 1).padStart(2, "0")}</span>
        </footer>
      </article>
    `;
  }

  if (slide.type === "section") {
    return `
      <article class="${slideClass(slide)}" data-slide="${index + 1}">
        <div class="section-layout">
          <div class="section-number">${escapeHtml(slide.sectionNumber || "")}</div>
          <h1 class="section-title">${escapeHtml(slide.title)}</h1>
          <p class="section-subtitle">${escapeHtml(slide.subtitle || "")}</p>
        </div>
        <footer class="slide__footer">
          <span>한성대학교 교수법 워크숍 | AI 에이전트로 데이터 분석 및 발표자료 제작</span>
          <span>${String(index + 1).padStart(2, "0")}</span>
        </footer>
      </article>
    `;
  }

  return `
    <article class="${slideClass(slide)}" data-slide="${index + 1}">
      <header class="slide__header">
        <div class="slide__section">${escapeHtml(slide.section || "")}</div>
        <h1 class="slide__title">${escapeHtml(slide.title)}</h1>
        ${slide.subtitle ? `<p class="slide__subtitle">${escapeHtml(slide.subtitle)}</p>` : ""}
      </header>
      <div class="slide__body">${slide.body}</div>
      <footer class="slide__footer">
        <span>한성대학교 교수법 워크숍 | AI 에이전트로 데이터 분석 및 발표자료 제작</span>
        <span>${String(index + 1).padStart(2, "0")}</span>
      </footer>
    </article>
  `;
}

function render() {
  if (printing) return;
  const slide = slides[currentIndex];
  stage.innerHTML = renderSlide(slide, currentIndex);
  slideNumber.textContent = `${currentIndex + 1} / ${slides.length}`;
  progressBar.style.width = `${((currentIndex + 1) / slides.length) * 100}%`;
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === slides.length - 1;
  document.title = `${slide.title.replace(/\n/g, " ")} | 한성대학교 교수법 워크숍`;
  updateNotes();
  updateOverview();
}

function goTo(index) {
  const nextIndex = Math.min(Math.max(index, 0), slides.length - 1);
  if (nextIndex === currentIndex) return;
  currentIndex = nextIndex;
  history.replaceState(null, "", `#/${currentIndex + 1}`);
  render();
}

function next() {
  goTo(currentIndex + 1);
}

function prev() {
  goTo(currentIndex - 1);
}

function updateNotes() {
  const slide = slides[currentIndex];
  notesBody.innerHTML = `
    <div class="note-block">${escapeHtml(slide.notes || "이 슬라이드에는 별도 강사 메모가 없습니다.")}</div>
  `;
}

function renderOverview() {
  overviewList.innerHTML = slides
    .map(
      (slide, index) => `
        <button class="overview-item ${index === currentIndex ? "is-active" : ""}" type="button" data-index="${index}">
          <span class="overview-item__num">${String(index + 1).padStart(2, "0")}</span>
          <span class="overview-item__title">${escapeHtml(slide.title.replace(/\n/g, " "))}</span>
        </button>
      `,
    )
    .join("");
}

function updateOverview() {
  if (!overviewList.innerHTML) {
    renderOverview();
    return;
  }
  overviewList.querySelectorAll(".overview-item").forEach((item, index) => {
    item.classList.toggle("is-active", index === currentIndex);
  });
}

function toggleNotes(force) {
  notesPanel.classList.toggle("is-open", force ?? !notesPanel.classList.contains("is-open"));
}

function toggleOverview(force) {
  if (!overviewList.innerHTML) renderOverview();
  overviewPanel.classList.toggle("is-open", force ?? !overviewPanel.classList.contains("is-open"));
}

function renderPrintDeck() {
  printing = true;
  document.body.classList.add("printing");
  stage.innerHTML = slides.map((slide, index) => renderSlide(slide, index)).join("");
}

function restoreFromPrint() {
  printing = false;
  document.body.classList.remove("printing");
  render();
}

prevBtn.addEventListener("click", prev);
nextBtn.addEventListener("click", next);
notesBtn.addEventListener("click", () => toggleNotes());
closeNotes.addEventListener("click", () => toggleNotes(false));
overviewBtn.addEventListener("click", () => toggleOverview());
closeOverview.addEventListener("click", () => toggleOverview(false));
printBtn.addEventListener("click", () => {
  renderPrintDeck();
  requestAnimationFrame(() => window.print());
});

stage.addEventListener("click", (event) => {
  const button = event.target.closest(".prompt__copy");
  if (!button) return;
  const text = button.dataset.prompt || "";
  const done = () => {
    const original = button.textContent;
    button.textContent = "복사됨";
    setTimeout(() => {
      button.textContent = original;
    }, 1200);
  };
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(done);
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    done();
  }
});

overviewList.addEventListener("click", (event) => {
  const item = event.target.closest(".overview-item");
  if (!item) return;
  goTo(Number(item.dataset.index));
  toggleOverview(false);
});

document.addEventListener("keydown", (event) => {
  if (event.target.closest("button")) return;
  if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
    event.preventDefault();
    next();
  }
  if (event.key === "ArrowLeft" || event.key === "PageUp") {
    event.preventDefault();
    prev();
  }
  if (event.key === "Home") {
    event.preventDefault();
    goTo(0);
  }
  if (event.key === "End") {
    event.preventDefault();
    goTo(slides.length - 1);
  }
  if (event.key.toLowerCase() === "n") {
    toggleNotes();
  }
  if (event.key.toLowerCase() === "o") {
    toggleOverview();
  }
  if (event.key === "Escape") {
    toggleNotes(false);
    toggleOverview(false);
  }
});

window.addEventListener("hashchange", () => {
  currentIndex = getIndexFromHash();
  render();
});

window.addEventListener("afterprint", restoreFromPrint);

history.replaceState(null, "", `#/${currentIndex + 1}`);
renderOverview();
render();
