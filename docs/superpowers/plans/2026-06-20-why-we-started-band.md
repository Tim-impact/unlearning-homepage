# "Why We Started" 선언문 밴드 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** About 섹션 끝의 팀 카드(3명)를 제거하고, 그 자리에 "왜 이 일을 시작했는가" 풀블리드 다크 선언문 밴드를 넣는다.

**Architecture:** 단일 `index.html`(React + Babel standalone SPA). 기존 Work 섹션의 풀블리드 다크 밴드 패턴(`.work-hero-band` + `.aurora` + `.hero-grid`)을 재사용해 `WhyWeStartedBand` 컴포넌트를 만들고, `AboutSection` 안 `<TeamCards/>` 호출을 이 컴포넌트로 교체한다. 선언문 카피는 `CONTENT.about`에 데이터로 두고, `**강조**` 마커를 파싱하는 작은 렌더 헬퍼로 포인트색 강조를 표현한다.

**Tech Stack:** HTML, React 18 (UMD CDN), Babel standalone (브라우저 JSX 트랜스파일), 인라인 CSS-in-JS + `<style>` 블록. 빌드/번들러/테스트 러너 없음.

## Global Constraints

- 단일 파일 `index.html`만 수정한다 (별도 빌드 산출물 없음).
- 폰트 상수 사용: 라벨 `MONO`(JetBrains Mono), 제목/선언문 `HEAD`(Paperlogy), 본문 `SANS`(Pretendard). (정의: `index.html:239-241`)
- 다크 밴드 내부 텍스트 색은 Work 밴드와 동일하게 하드코딩: 본문 `#f0f6fc`, 포인트 그린 `#00ff88`, 보조 디밍 `#9aa7b8`. (About의 `ThemeContext`는 밝은 테마라 `C` 토큰을 쓰면 안 됨.)
- 한글 줄바꿈 보호: 텍스트에 `wordBreak: "keep-all"` 적용.
- 가로 스크롤 0 유지 (풀블리드는 기존 `.work-hero-band` 기법 그대로).
- `prefers-reduced-motion` 대응은 기존 CSS 규칙(`index.html:167`, `.aurora` 포함)으로 자동 적용 — 신규 CSS 추가 시 동일 규칙에 포함.
- 위쪽 About 구성(헤딩·subtext·Vision/Mission·PhilosophyBlock·HOW_WE_WORK)은 변경 금지.

---

### Task 1: 선언문 카피 데이터 + 리치텍스트 렌더 헬퍼 + WhyWeStartedBand 컴포넌트 추가, 사용처 교체

**Files:**
- Modify: `index.html` — `CONTENT.about` 객체(`375-407`)에 카피 필드 추가
- Modify: `index.html` — `TeamCards` 함수 바로 위(`1525` 근처)에 헬퍼 + 컴포넌트 추가
- Modify: `index.html` — `AboutSection`의 `<TeamCards visible={visible} />`(`1634`)를 교체

**Interfaces:**
- Consumes: 전역 상수 `MONO`, `HEAD`, `SANS`; 전역 `CONTENT`; 전역 `React`.
- Produces:
  - `CONTENT.about.whyLabel: string`, `CONTENT.about.whyBody: string`(`\n`·`**강조**` 포함), `CONTENT.about.whyClose: string`
  - `renderRich(text: string, accent: string): React.ReactNode[]` — `\n`은 `<br/>`로, `**...**`는 `<strong>`(색 `accent`, `fontWeight 800`)로 변환
  - `function WhyWeStartedBand({ visible: boolean })` — 풀블리드 다크 선언문 밴드

- [ ] **Step 1: 작업 브랜치 생성 (현재 main이므로 분리)**

```bash
git checkout -b feat/why-we-started-band
```

- [ ] **Step 2: `CONTENT.about`에 선언문 카피 필드 추가**

`index.html`에서 `team: [` 배열(`384`) 바로 앞, `tags: [...]` 줄 다음에 아래 필드를 추가한다. (team 배열은 Task 2에서 제거하므로 지금은 그대로 둔다.)

```js
    whyLabel: "# WHY_WE_STARTED",
    whyBody:
      "문제의 뿌리는 하나였습니다 — **연결의 부재.**\n\n" +
      "일 맡길 조직엔 자원이 없고,\n" +
      "일 배울 청년에겐 현장이 없었습니다.\n\n" +
      "우리는 그 둘을 한 프로젝트 안에서 만나게 합니다.\n" +
      "일은 더 잘 굴러가고, 사람은 현장에서 자랍니다.\n\n" +
      "오퍼레이션에 진심인 이유는 분명합니다.\n" +
      "**그것이 결국, 사람을 남기는 일이기 때문입니다.**",
    whyClose:
      "— 조직이라는 로켓이 미션이라는 궤도에 오르도록,\n" +
      "우리는 곁에서 일하는 **추진체**가 되기로 했습니다.",
```

- [ ] **Step 3: `renderRich` 헬퍼와 `WhyWeStartedBand` 컴포넌트 추가**

`index.html`에서 `function TeamCards({ visible }) {`(`1526`) 줄 바로 앞에 아래를 삽입한다.

```jsx
/* 선언문 리치텍스트 렌더 — "\n" → <br/>, "**강조**" → 포인트색 <strong> */
function renderRich(text, accent) {
  return text.split("\n").map((line, li) => (
    <React.Fragment key={li}>
      {li > 0 && <br />}
      {line.split("**").map((seg, si) =>
        si % 2 === 1
          ? <strong key={si} style={{ color: accent, fontWeight: 800 }}>{seg}</strong>
          : seg
      )}
    </React.Fragment>
  ));
}

/* WHY WE STARTED — 풀블리드 다크 선언문 밴드 (About 마무리) */
function WhyWeStartedBand({ visible }) {
  return (
    <div className="work-hero-band" style={{
      padding: "clamp(64px, 9vw, 104px) 20px",
      marginTop: 8,
      opacity: visible ? 1 : 0,
      transition: "opacity .6s ease",
    }}>
      <div className="aurora aurora-1" />
      <div className="aurora aurora-2" />
      <div className="aurora aurora-3" />
      <div className="hero-grid" />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 840, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontFamily: MONO, fontSize: 14, color: "#00ff88", fontWeight: 700, letterSpacing: ".1em", marginBottom: 28 }}>
          {CONTENT.about.whyLabel}
        </div>
        <p style={{ fontFamily: HEAD, fontSize: "clamp(22px, 3.4vw, 36px)", fontWeight: 700, color: "#f0f6fc", lineHeight: 1.55, wordBreak: "keep-all", margin: 0 }}>
          {renderRich(CONTENT.about.whyBody, "#00ff88")}
        </p>
        <p style={{ fontFamily: HEAD, fontSize: "clamp(15px, 1.8vw, 19px)", fontWeight: 400, color: "#9aa7b8", lineHeight: 1.7, wordBreak: "keep-all", marginTop: 32, marginBottom: 0 }}>
          {renderRich(CONTENT.about.whyClose, "#22d3ee")}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: `AboutSection`의 팀 카드 호출을 밴드로 교체**

`index.html:1634`의

```jsx
        <TeamCards visible={visible} />
```

를 아래로 바꾼다.

```jsx
        <WhyWeStartedBand visible={visible} />
```

- [ ] **Step 5: 로컬 서버 실행 후 브라우저로 렌더 검증**

Run:
```bash
python3 -m http.server 8765 >/tmp/ulc-serve.log 2>&1 &
```

Playwright(MCP)로 `http://localhost:8765/` 열고 `#about` 섹션까지 스크롤 후 확인:
- `# WHY_WE_STARTED` 라벨과 선언문 텍스트("연결의 부재", "사람을 남기는 일", "추진체")가 다크 밴드 안에 렌더됨
- 팀 사진 3장(`assets/team-*.png`)이 더 이상 화면에 없음
- 강조 단어가 그린/시안 색으로 표시됨

Expected: 위 3개 모두 충족, JS 콘솔 에러 없음.

- [ ] **Step 6: 가로 스크롤 0 검증**

Playwright에서 평가:
```js
document.documentElement.scrollWidth <= window.innerWidth
```
Expected: `true` (데스크톱 폭과 모바일 폭 375px 양쪽에서).

- [ ] **Step 7: 커밋**

```bash
git add index.html
git commit -m "feat(about): 팀 카드를 'Why We Started' 선언문 밴드로 교체"
```

---

### Task 2: 죽은 팀 코드 제거 (컴포넌트·데이터·CSS)

**Files:**
- Modify: `index.html` — `TeamCards` 함수 제거(`1526-1570` 근처)
- Modify: `index.html` — `CONTENT.about.team` 배열 제거(`384-406` 근처)
- Modify: `index.html` — `.team-photo` CSS 정리(`122`)

**Interfaces:**
- Consumes: 없음 (Task 1에서 `<TeamCards/>` 참조가 이미 사라진 상태)
- Produces: 없음 (정리 작업)

- [ ] **Step 1: `TeamCards` 함수 전체 삭제**

`index.html`의 주석 `/* 팀 카드 목록 — AboutSection에서 분리 */`부터 `function TeamCards({ visible }) { ... }` 닫는 `}`까지(`1525-1570` 근처) 통째로 삭제한다.

- [ ] **Step 2: `CONTENT.about.team` 배열 삭제**

`index.html`의 `team: [` 부터 대응하는 `],`(박정웅·박형호·이왕수 객체 3개를 감싸는 배열, `384-406` 근처)까지 삭제한다. `whyLabel/whyBody/whyClose`(Task 1에서 추가)와 `about` 객체 닫는 `}`는 남긴다.

- [ ] **Step 3: `.team-photo` CSS 셀렉터 정리**

`index.html:122`는 다음과 같다.
```css
      .team-photo, .value-img { height: auto !important; object-fit: contain !important; }
```
`.value-img`는 HOW_WE_WORK 이미지에서 계속 쓰이므로 남기고, 더 이상 참조 없는 `.team-photo, `만 제거한다.
```css
      .value-img { height: auto !important; object-fit: contain !important; }
```

- [ ] **Step 4: 잔여 참조 grep 검증**

Run:
```bash
grep -n -E "TeamCards|\.team-photo|about\.team|CONTENT\.about\.team" index.html
```
Expected: 출력 없음 (빈 결과).

- [ ] **Step 5: 브라우저 재검증 (회귀 확인)**

이미 떠 있는 `http://localhost:8765/`를 Playwright로 새로고침하고 확인:
- `#about` 섹션이 정상 렌더되고 선언문 밴드가 그대로 보임
- HOW_WE_WORK의 `value-*.jpg` 이미지 3장은 여전히 정상 표시
- JS 콘솔 에러 없음

Expected: 모두 충족.

- [ ] **Step 6: 커밋**

```bash
git add index.html
git commit -m "refactor(about): 사용되지 않는 팀 카드 컴포넌트·데이터·CSS 제거"
```

---

### Task 3: (선택) 팀 사진 에셋 제거 — 사용자 확인 필요

**Files:**
- Delete: `assets/team-jungwoong.png`, `assets/team-hyungho.png`, `assets/team-wangsoo.png`

**Interfaces:**
- Consumes: 없음
- Produces: 없음

> **주의(파괴적 작업):** 파일 삭제는 되돌리기 번거롭다. Task 2의 grep에서 코드 내 참조가 0임을 확인한 뒤에만 진행하고, 실행 전 사용자에게 한 번 더 확인한다. 사진을 향후 다른 용도로 쓸 가능성이 있으면 이 Task는 건너뛴다.

- [ ] **Step 1: 코드 내 참조 0 재확인**

Run:
```bash
grep -rn "team-jungwoong\|team-hyungho\|team-wangsoo" index.html
```
Expected: 출력 없음.

- [ ] **Step 2: 사용자 확인 후 파일 삭제**

```bash
git rm assets/team-jungwoong.png assets/team-hyungho.png assets/team-wangsoo.png
```

- [ ] **Step 3: 커밋**

```bash
git commit -m "chore(assets): 사용하지 않는 팀 사진 제거"
```

---

## 마무리 (계획 실행 후)

- 로컬 서버 종료: `kill %1` 또는 `pkill -f "http.server 8765"`.
- `process.md` 갱신(About 팀 카드 → Why We Started 밴드 교체 완료) — 사용자 요청/Phase 완료 시점에.
- 변경을 `main`에 반영하는 방식(PR vs 직접 머지)은 `finishing-a-development-branch` 단계에서 사용자와 결정.

## Self-Review 메모

- **Spec 커버리지:** 팀 카드 제거(Task 2) · 풀블리드 다크 밴드(Task 1 Step 3) · aurora 재사용(Step 3) · 철학 카드와 차별화되는 큰 선언문 타이포(Step 3) · 카피(Step 2) · 가로 스크롤 0(Task 1 Step 6) · reduced-motion(Global Constraints, 기존 CSS) · 에셋 제거(Task 3) — 모두 대응됨.
- **Placeholder 스캔:** 모든 코드 스텝에 실제 코드 포함, "TBD/적절히 처리" 없음.
- **타입 일관성:** `renderRich(text, accent)` 시그니처가 정의(Task 1 Step 3)와 호출(같은 컴포넌트 내 2회) 일치. `WhyWeStartedBand({ visible })`가 정의와 호출(`AboutSection`) 일치.
- **테스트 러너 부재 적응:** 단위 테스트 대신 grep + Playwright 렌더 검증으로 각 Task의 독립 검증 사이클 구성.
