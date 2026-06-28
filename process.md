# process.md — 언러닝컴퍼니 홈페이지 (ulc-home)

> 진행 상황 현장 일지. 큰 방향(설계도)은 `plan.md`에서 관리한다(아직 미작성).
> 작업 진행에 따라 자주 갱신한다.

**마지막 업데이트:** 2026-06-28 (PR #2 — Story 게시판 + Sanity 연동 — 로컬 main에 병합 완료, 푸터는 정본 유지·검증. push·CORS 보류)

---

## 프로젝트 개요

언러닝컴퍼니 홈페이지. `index.html` 단일 파일에 React(Babel standalone) 기반 SPA로 구현.
섹션 구성: `home`(히어로) → `work` → `curriculum` → `tracks` → `impact` → `about` + 푸터.
모달: 개인정보 처리방침, Contact 문의 폼.

---

## 완료된 작업

- [x] 초기 홈페이지 구축 — 단일 `index.html`, React + Babel standalone SPA (2026-04-22)
- [x] 섹션 구성 완료 — home / work / curriculum / tracks / impact / about + 푸터
- [x] Contact 문의 폼 → Vercel Notion API 연동
- [x] 개인정보 처리방침 모달 + 동의 체크박스
- [x] 모바일 UX — 햄버거 내비게이션, 트랙 셀렉터, 푸터 레이아웃
- [x] 팀 사진 추가·정리 (이왕수·박형호·박정웅), 파일명 ASCII로 정리(URL 안전)
- [x] 톤 & 보이스 가이드 작성 (`TONE_GUIDE.md` / `TONE_GUIDE.html`) 및 카피 전반 적용
- [x] AI 교육 트랙 추가 + 브라우저 뒤로가기 라우팅
- [x] 배포용 에셋 추가 — 폰트(Pretendard·Paperlogy·JetBrains Mono), 로고 SVG, value 이미지
- [x] References 기능 제거
- [x] 텍스트 대비·히어로 스케일링·Work 카드 구분 개선
- [x] **Work 섹션 플라이휠 재설계** — 입구→엔진→자산→확산 원형 순환 다이어그램(SVG) + 허브(사람·시스템·시간), 카피 전면 다듬음, 한글 폰트 폴백 정리 (2026-06-20)
- [x] **Work 섹션 컴팩트화 (v2)** — 세로로 길던 4개 풀카드 → 플라이휠(좌) + 2×2 밀도 카드 그리드(우) 2컬럼 레이아웃으로 압축(데스크톱 1화면). "남는 것" → "자산" 전면 변경, 카드별 before/after 단일 모노 블록으로 간결화 (2026-06-20)
- [x] **Work 섹션 궤도 애니메이션 (v3)** — 정적 플라이휠 폐기 → `OrbitScene`(조직=행성을 공전하는 로켓 SVG animateMotion + 코멧 트레일 + 펄스 웨이포인트 + 성장 입자 + 행성 호흡). 카드는 터미널 디자인 복원(창 헤더 + `entry/engine/asset/spread.sh`), 칩에서 불렛·번호 제거, 궤도 웨이포인트에서 번호 제거. prefers-reduced-motion 대응 (2026-06-20)
- [x] **궤도 디테일 보강 (v4)** — 궤도 라벨 대폭 확대(입구/엔진 21px·short 15px) + 궤도 반경 축소로 좌우 라벨 잘림 해결, 캡션 둘째 줄 삭제, 카드 칩 구분자 `·`→`Ι`(공동수주), 궤도 자산 short "AX 시스템·매뉴얼", 로켓 3D화(노즈콘·원통 셰이딩·창문 하이라이트·그라데이션 화염) (2026-06-20)
- [x] **터미널 사실감 강화 (v5)** — 캡션 Paperlogy 22px로 확대, 인트로 문단(flywheelIntro) 삭제, 카드 칩 `[입구] 공동수주` 대괄호 형식, 카드 상단 색상 캡 제거, 신호등 버튼 글로시 그라데이션, before/after를 실제 다크 콘솔(셸 프롬프트 + 밝은 터미널 색 + 화면 인셋 그림자)로 교체 — `ThemeContext.Provider value={THEMES.dark}`로 콘솔만 강제 다크 (2026-06-20)
- [x] **3D 지구본 + 레이아웃 재배치 (v6)** — 행성 "조직" 글자 삭제, Wise 히어로풍 3D 지구본으로 업그레이드(SVG `pattern`+`animateTransform`로 자전하는 점 표면 + 위경도 타원 + 낮/밤 명암 그라데이션 + 반짝이는 도시 + 대기광). 레이아웃을 좌우 2컬럼 → **1단 애니메이션(가운데) / 2단 터미널 카드 4개 한 줄**(grid 4열, 1080px↓ 2열·560px↓ 1열)로 변경. 콘솔 프롬프트 단축(`$ ./eng.sh`) + 커서 깜빡임 제거 (2026-06-20)
- [x] **몰입형 히어로 밴드 (v7)** — Wise/dope.security/osmo 풍으로 애니메이션을 **풀블리드(100vw) 다크 밴드**로 확장: 살아있는 오로라 그라데이션 3겹(green/cyan/blue blur drift) + 마스킹된 도트 그리드 + 풀블리드는 `left:50%/margin-left:-50vw`(work-layout align stretch). 가로 스크롤 0 검증 (2026-06-20)
- [x] **진짜 WebGL 3D 글로브 (v8)** — Three.js(UMD r128 CDN)로 SVG 궤도를 대체. 드래그 회전·점구체 버전(이후 v9에서 진짜 지구로 교체) (2026-06-20)
- [x] **디테일·우주 이펙트 (v14)** — 라벨 앞 불렛(컬러 점) 제거, 라벨 외곽 위치 1.2→1.32로 빼 **마커-텍스트 비겹침**, 로켓이 마커 통과 시 **펄스 이펙트**(각도 근접도 기반 마커/헤일로 scale·opacity 부풀림), 캡션 marginTop 14→-28로 **위로**, 배경에 **우주 요소**(근접 별 레이어 + 별 반짝임 + 슈팅스타 3개 주기적 횡단). 헤드리스는 rAF 저속이라 순간 이펙트 포착 어려우나 실제 60fps에서 동작 (2026-06-20) — 기운 궤도(rot.x 0.95)가 윗부분은 화면 위로 잘리고(로켓 포함) 아랫부분(자산·확산)은 지구 뒤로 가려지던 문제를, **거의 정면 궤도**(rot.x 0.3·rot.y 0)로 바꿔 해결. ORB 3.6→3.1, 대기광 R*1.34→1.22(마커 덮음 방지), 카메라 후퇴(z 10~16, aspect별)로 궤도 전체가 화면에 들어오게. 4 마커 전부 지구 밖·화면 안, 로켓 상단도 온전히 표시 (2026-06-20) — 로켓 축소(scale 1.7→1.0). 4단계를 균등 90° 대신 **네 모서리 각도**(입구138°·엔진42°·자산−42°·확산−138°)로 배치해 상하 극단 클리핑 제거(입구·자산 보임), 납작한 가로 궤도(rot.x 0.95). 캔버스 높이↑, 세로 화면 카메라 후퇴 강화(aspect별 z=8~14)로 좌우 라벨 잘림 해결. 데스크톱·모바일 모두 4단계 비겹침·전부 표시 확인 (2026-06-20)
- [x] **완전 카툰/로우폴리 (v11)** — 지구를 텍스처 폐기 → **로우폴리 행성**(IcosahedronGeometry detail3 non-indexed + 면별 vertexColor: 절차적 대륙 시드 9개로 바다/땅/빙하, MeshLambert flatShading)로 교체, 밝은 ambient로 색 또렷하게, 시안-그린 카툰 글로우. 로켓도 **카툰화**(통통한 동체+빨강 노즈콘+초록 핀+2단 화염, MeshLambert flatShading, scale↑). 라벨 폰트 **Paperlogy 900**(글로우 텍스트섀도)로 변경, 마커 확대. RedFormat 툰램프가 SwiftShader에서 색 왜곡 → Lambert flat로 안정화 (2026-06-20)
- [x] **툰 지구 + 자산 마커 분리 (v10)** — 지구를 `MeshToonMaterial`(3밴드 램프) + 밝은 시안-그린 대기광 + ambient↑ + 자전 가속으로 **애니메이션풍**(사실감 완화). 궤도 확대(ORB 3.3→3.85)·기울기 완화(rot.x 1.12→0.92)로 4 마커가 지구 실루엣 밖으로 나와 **자산 마커·라벨이 지구와 분리**(지구를 자산으로 마킹한 듯 보이던 문제 해결), 마커 크기↑ (2026-06-20)
- [x] **진짜 지구 + 궤도 순환 로켓 (v9)** — `Globe3D`를 텍스처 지구로 교체: jsDelivr(CORS) three.js examples의 earth_atmos/specular/normal/clouds 텍스처 + DirectionalLight 낮/밤 명암 + 구름 레이어 + 블루 프레넬 대기광 + 지축 기울기 자전. **드래그 회전 삭제**(자동 자전만). 기울어진 궤도(ring rot.x 1.12)에 4 단계를 동서남북이 아닌 궤도 위 배치(angFor 90/0/-90/-180), **3D 로켓**(원통+노즈콘+핀+화염)이 입구→엔진→자산→확산 순서로 공전(접선 정렬). 라벨은 한글 깨짐 방지 위해 **3D 좌표를 투영한 DOM 텍스트**(+발광 마커). 세로 화면은 카메라 후퇴(fitCamera)로 궤도 수용. 헤드리스 SwiftShader 검증, 가로 스크롤 0 (2026-06-20)
- [x] **푸터 사업자 정보 정식 표기** — 사업자등록번호 `572-81-04039` 입력(`bizNumber` 채워지면 자동 노출되도록 기설계), 주소 `…지정로 110, 108호` → `…지정로 110, 상가동 108호`, 표기 `대표` → `대표이사`. 보안 점검 병행: 클라이언트 시크릿 노출 없음, Contact 폼은 Web3Forms 공개 키(메일 발송 전용·노출 안전), `vercel.json`에 CSP·HSTS·X-Frame-Options 등 주요 헤더 구비 확인 (2026-06-24)
- [x] **`# HOW_WE_WORK` 값 카드 블록 삭제** — About 섹션 안에 있던 3개 값 카드(system·direction·share + 실사 이미지) 블록(`index.html` 1601~1628) 제거. 미디어쿼리의 죽은 `.value-img` CSS 규칙도 함께 정리 (2026-06-26)
- [x] **Work 헤드라인 모바일 줄바꿈 정리 (B안)** — "성장을 위한 더 큰 도전을 함께 하는 / AX 오퍼레이션 파트너" 헤드라인이 좁은 화면에서 1행이 넘쳐 3줄이 되던 문제. h2 폰트 `clamp` 바닥값을 26px→18px로 낮춰(`clamp(18px, 4vw, 38px)`) 폭 650px 미만(폰)에서 1행("성장을…하는")이 줄어들며 들어맞게 함. 단, 초록 키워드 "AX 오퍼레이션 파트너"는 span에 크기를 명시해 분리. 강제 `<br/>` + 초록 2행 단독 구조는 의도대로 보존 (2026-06-26)
- [x] **Work 헤딩↔3D 밴드 간격 축소** — h2 `marginBottom` 44→24, 밴드 `marginTop` 8→0. 헤딩과 다크 밴드 사이 간격 52px→24px (밴드 내부 top 패딩 `clamp(48,7vw,84)`은 유지) (2026-06-26)
- [x] **섹션 세로 리듬 비대칭 재설계 (A안)** — 구분선(`borderTop`)이 240px 빈 공간 한가운데 고립돼 어느 섹션에도 안 붙던 문제. 모든 섹션 패딩을 **상단 64 / 하단 96**(Work는 밴드 보정으로 상단 56)으로 통일 → 구분선이 아래 섹션 텍스트에 붙어 소속이 또렷해지고, 섹션 간 총 간격 240→160px로 축소. `SPACING` 토큰을 `sectionY:120`(+미사용 `sectionYSm`) → `sectionTop:64`/`sectionBottom:96`으로 교체하고 `STYLES.section` 헬퍼를 비대칭으로 변경(About 자동 반영), 나머지 5개 섹션은 인라인 수정. (직전의 Why It Matters 100→120은 이 작업으로 64로 대체됨) (2026-06-26)
- [x] **초록 키워드 크기를 표준 섹션 헤더에 맞춤** — "AX 오퍼레이션 파트너" span 크기를 `clamp(26px, 4vw, 38px)` → `clamp(28px, 5vw, 44px)`로 변경. 02 Curriculum·03 Tracks·04 Impact·05 About 섹션 헤더와 동일값. line1("성장을…하는")은 모바일 1행 유지 위해 `clamp(18px, 4vw, 38px)` 그대로 (2026-06-26)
- [x] **미사용 잔재 정리** — 위 삭제로 드러난 죽은 코드/자산 제거: ① 어디서도 렌더링되지 않던 `CoreValuesSection` 컴포넌트, ② 그에 따라 완전히 미사용이 된 `CONTENT.coreValues` 데이터(`// ⑤ 핵심 가치 섹션`), ③ 고아가 된 실사 이미지 3개(`assets/img/value-system.jpg`·`value-direction.jpg`·`value-share.jpg`). 데이터 주석 번호는 ④→⑥로 ⑤가 비지만 무관 주석 재정렬은 보류 (2026-06-26)
- [x] **소개 문구 SEO·GEO 최적화 + 구글 검색 등록** — Tim이 Google Search Console 등록·색인 요청 완료. 검색에 보이는 3개 슬롯을 역할별로 차등 개편(동일 문장 통일 X): ① `meta description`(스니펫) "가치·고객 중심" 톤(고객 선택) — 미션 몰입 혜택 앞배치 + 키워드(AI 전환·워크플로우 자동화·적정기술·AX 오퍼레이션 파트너), ② `og:description`(공유 카드) 한 줄 정돈, ③ `JSON-LD description`(GEO/AI 검색) 회사명(국문+영문)·대상·방법·범위·카테고리 완결 문장. 커밋 `59d5d16`, 프로덕션 배포 완료. (남은 것: Tim의 Google 비즈니스 프로필 등록 — 지식 패널/정보 카드 통제용) (2026-06-28)
- [x] **푸터 상단 초록 CTA 밴드 신설(gowid 풍)** — 푸터와 직전 섹션(About) 사이 경계를, 첨부 이미지(gowid)처럼 **풀블리드 초록 밴드**로 교체. `FooterCTA` 컴포넌트 신설, `App`에서 `<Footer>` 바로 앞에 렌더(모든 뷰 공통). 배경 `C.green`(헤더 "함께 자라기" 버튼과 동일색), 좌측 메인카피("함께 도전하고 싶은 일이 있다면 편하게 이야기를 시작해요.")+서브("현장에서 함께 일해 온 동료로서…"), 우측 흰 버튼 "함께 자라기 →"는 헤더와 **동일 표기·동일 액션(`openContact` 모달)**. 텍스트색은 헤더 버튼처럼 `C.bg`로 두어 라이트(흰 글자/녹색)·다크(검은 글자/형광녹색) 대비 자동 대응. 문구는 `CONTENT.footerCta`로 분리. 밴드가 경계 역할을 하도록 **푸터의 `borderTop`(얇은 선) 제거**. 모바일(≤768px)은 `.footer-cta` 세로 stack. 콘텐츠 폭 `maxWidth:1000`으로 아래 푸터와 좌우 정렬 일치 (2026-06-28)
- [x] **푸터 우측 링크 3종 규격 통일** — `개인정보처리방침` 버튼을 `회사소개서`·`패밀리 사이트` 링크와 동일 형식으로: 밑줄(`textDecoration:underline`+`textUnderlineOffset`) 제거→`none`, 끝에 `↗` 추가. 이로써 우측 묶음 3행(`회사소개서 ↗` / `패밀리 사이트 · 조직학교 이니셔티브 ↗` / `개인정보처리방침 ↗`)이 SANS 13px·`textDim`·`hover-green`·`↗`로 완전히 동일. (참고: `↗`는 본래 외부 새 탭 이동 신호이고 개인정보처리방침은 모달이라 의미상 차이가 있으나, 시각 규격 통일이 사용자 요청이라 적용) (2026-06-28)
- [x] **푸터 세로 간격·행간 정리** — ① 경계선↔로고 간격 축소(`footer` 상단 패딩 `60→40px`). ② 태그라인↔회사명 간격 축소(`footer-bizinfo` 상단 마진 `40→24px`). ③ 회사 정보 블록 행간 통일·안정화: `lineHeight 1.95→1.7`, 이메일 줄에만 있던 `marginTop:2`(리듬 깨짐) 제거, 우측 묶음 `개인정보처리방침` 버튼에 `lineHeight:"inherit"` 지정해 좌우 행 높이 일치. 폰트는 좌우 모두 SANS 13px로 이미 통일돼 있어 유지 (2026-06-28)
- [x] **푸터에 회사소개서·패밀리 사이트 링크 추가 + 사업자등록번호 줄바꿈 + 우측 2단 배치** — ① 사업자등록번호 `572-81-04039`를 `회사명 | 대표이사`와 같은 줄에서 떼어 독립 줄로 이동(`Sep` 구분자 제거). ② URL을 `CONTENT.footer`에 `brochureUrl`(Google Drive `/view` 공유 링크 — 새 탭 미리보기→다운로드)·`familySite{label,url}`(org-school.me)로 분리. ③ `footer-bizinfo`를 좌(사업자 정보)/우(링크) 2단 flex(`justify-content:space-between`, `align-items:flex-start`)로 재구성: 우측 컬럼에 `회사소개서 ↗` / `패밀리 사이트 · 조직학교 이니셔티브 ↗` / `개인정보처리방침`을 세로로 쌓고 우측 정렬(`flex-end`). 우측 묶음 시작점이 좌측 첫 줄(회사명·대표이사)과 같은 높이에 정렬됨. **개인정보처리방침은 맨 아랫줄(`footer-bottom`)에서 이 우측 묶음으로 이동**(SANS 13px로 통일, underline 유지). 외부 링크 2개는 `target="_blank" rel="noopener noreferrer"` + `↗` + `hover-green`. 모바일(≤768px)은 `.footer-bizinfo` 세로 stack + `.footer-links` 좌측 정렬로 전환. 배치·소개서 링크 방식·패밀리 표기는 객관식 확인 후 진행 (2026-06-28)
- [x] **About 팀 카드 → "Why We Started" 섹션 교체** — 팀원 3명 카드(`TeamCards`)·`CONTENT.about.team` 데이터·`.team-photo` CSS 제거. 그 자리에 "왜 이 일을 시작했는가" 서사 추가. 초기엔 풀블리드 다크 선언문 밴드로 구현했으나 전체 톤에서 튀어, **히어로의 `TerminalWindow` 패턴 재사용**(밝은 터미널 창 + 신호등 헤더 + `$ read why-we-started.md` 프롬프트 + `## unlearning`/`## the-bridge`/`## the-propellant` 섹션 + Pretendard 본문, 핵심 구절 파란색 강조)으로 최종 변경. `# WHY_WE_STARTED` 라벨은 `# HOW_WE_WORK`과 같은 선상 정렬. `**강조**`/`\n` 파싱용 `renderRich` 헬퍼 추가. 팀 사진 에셋은 보존. 브레인스토밍→스펙(`docs/superpowers/specs/`)→계획(`docs/superpowers/plans/`)→서브에이전트 실행. 커밋 `f7f22eb`·`a31f3b7`·`d43143d` (2026-06-20)
- [x] **Story 게시판(News·Blog) + Sanity CMS 연동 — PR #2 로컬 병합** — `feat/blog-studio`(PR #2, by bropumpkin)를 로컬 `main`에 병합(merge-tree 사전검증 충돌 0, 실제 병합 충돌 0). 네비 `Blog`→`Story` 단일 메뉴 + News/Blog 탭 전환, 목록 18개(3×6)+`더보기 N/총계` 페이지네이션, 글 상세 공유 버튼(URL 클립보드 복사·중앙 토스트), 태그 다중표시(`category` 배열, 구버전 문자열/참조 자동 호환 `getTags`), 본문 렌더 개선(빈 문단 제거·nbsp 치환·가로잘림 `overflowWrap`). Sanity 프로젝트 `77kdc69b`(production dataset 없음=깨짐)→`n6aij3q3`(글 데이터 정상)로 교체. `studio/` 신규(Sanity Studio 6.1.0 + `post` 스키마: 제목(필수)·메뉴구분(자동·hidden)·태그(공지/안내/후기/칼럼/인터뷰/사례)·발행일(필수)·대표이미지(16:9)·본문 + Content를 News/Blog로 분리하는 structure). **푸터: PR 재작성본 폐기, 현재 index.html(main)이 정본** — 병합 결과 Footer 컴포넌트가 main 푸터와 글자단위 동일함을 `diff`로 검증(FooterCTA 초록 밴드 포함, PR 흔적·중복 정의 0). `.gitignore`는 `inputs/`·`.vercel`·`.DS_Store` 모두 반영. **아직 push 안 함** — 로컬 main이 origin/main보다 7커밋 앞섬 (2026-06-28)
- [x] **Story 페이지 `// Narrative` 라벨 삭제** — `StoryView` 제목 위 초록 모노 라벨(`<div>// Narrative</div>`) 블록 제거. 이제 Story 제목 → 설명 → News/Blog 탭 순으로 시작. (병합분 위 추가 수정, 아직 미커밋) (2026-06-28)

---

## 현재 진행 중

- PR #2 로컬 병합 완료. push·라이브 배포는 **보류** — 아래 블로커(Sanity CORS) 해소 후 진행

---

## 다음 할 일 (즉시 착수 예정)

- [ ] (Tim) Sanity 콘솔에서 운영 도메인 `https://un-learning.co` **CORS 허용 등록** — 미등록 시 라이브에서 게시판 데이터 미로딩 (로컬 테스트 도메인만 등록된 상태)
- [ ] CORS 등록 후 `git push` → Vercel 라이브 배포 + 게시판 실제 로딩 검증
- [ ] 사용자 피드백 반영 (필요 시)

---

## 블로커 · 보류 사항

- **게시판 라이브 동작 전제조건(외부 설정)**: Sanity `n6aij3q3`에 `https://un-learning.co` CORS 등록 필요 — 미등록 시 push해도 라이브 게시판이 빈 채로 뜸. CSP(`connect-src https:`)는 Sanity 호출 허용하므로 CSP는 문제 아님
- `plan.md` 미작성 — 전체 계획·우선순위·의존관계 정리 필요
- 미커밋 항목: `CLAUDE.md`·`AGENTS.md`(프로젝트 메모리), `brand/`(슬랙 채널 아이콘 에셋), `assets/how-we-work.png`·`assets/team-소개.png`, `.gitignore`(`.vercel` 추가) — git untracked/unstaged 상태
- 실제 브라우저 픽셀 렌더 검증 미완 — 작업 환경에서 브라우저 설치에 root 권한 필요 (코드 트랜스파일·파싱 검증은 통과). 단 file:// 로컬 열람 시 Sanity CORS(Origin null 미등록)로 게시판 데이터는 안 보일 수 있음 — 레이아웃만 확인 가능
