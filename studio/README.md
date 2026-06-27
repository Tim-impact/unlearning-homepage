# 언러닝컴퍼니 블로그 관리자 (Sanity Studio)

홈페이지 **Blog**에 노출되는 글을 작성·관리하는 내부 어드민입니다.
DB는 Sanity 프로젝트 `77kdc69b` / dataset `production`.

---

## 1. 처음 1회 준비

```bash
cd studio
npm install          # 의존성 설치 (최초 1회)
npx sanity login     # 본인 Sanity 계정으로 로그인 (브라우저 열림)
```

## 2. 로컬에서 띄워 글쓰기 (본인 확인용)

```bash
npm run dev          # http://localhost:3333 접속
```

- 좌측 **글** → **＋** 로 새 글 작성
- 입력 항목: **제목 / 분류 / 발행일 / 대표 이미지 / 본문**
- 본문은 노션처럼 블록 편집(제목·인용·굵게·링크·이미지·유튜브)
- 우측 하단 **Publish** 를 눌러야 홈페이지에 노출됩니다 (초안 상태로는 안 보임)

## 3. 동료들이 쓸 수 있게 배포 (호스팅 어드민)

```bash
npm run deploy       # 주소(hostname) 한 번 정하면 됨
# → https://[정한이름].sanity.studio 로 접속 가능
```

동료 초대: <https://www.sanity.io/manage> → 프로젝트 `77kdc69b` →
**Members → Invite members** 에서 동료 이메일 추가 (역할 Editor면 글쓰기 가능).
초대받은 동료는 위 `*.sanity.studio` 주소로 로그인해 글을 씁니다.

---

## ⚠️ 홈페이지 Blog에 글이 안 보일 때 (중요)

Studio 작성과 별개로, **공개 홈페이지(un-learning.co)가 Sanity를 읽으려면 CORS 허용**이 필요합니다.
<https://www.sanity.io/manage> → 프로젝트 `77kdc69b` → **API → CORS Origins → Add** 에서 아래를 추가하세요
(`Allow credentials`는 체크 해제):

- `https://un-learning.co`
- `https://www.un-learning.co`

이게 빠지면 글을 발행해도 홈페이지 Blog가 "아직 게시된 글이 없습니다"로 보입니다.

---

## 스키마 요약

| 필드 | 설명 |
|------|------|
| `title` | 제목 (필수) |
| `category` | 분류 — 공지 / 아카이브 / 사례 / 소식 |
| `publishedAt` | 발행일 (기본값: 현재 시각) |
| `mainImage` | 대표 이미지(썸네일, 선택) |
| `body` | 본문 — 문단·제목2~4·인용·굵게·기울임·밑줄·링크·이미지·유튜브 |

홈페이지 프론트엔드(`index.html`)가 위 필드를 그대로 읽어 Blog 목록·상세에 렌더링합니다.
