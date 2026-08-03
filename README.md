# 어브로디 (Abrody)

여행하는 동안 **하루에 쓸 수 있는 돈**을 정확하게 관리하는 여행 가계부.
목적지 검색으로 프로젝트를 만들고, 스캔·직접 입력·1/N 정산·통화 전환까지 모두 실제로 동작하는 인터랙티브 목업입니다.

빌드 도구 없이 순수 HTML/CSS/JS로 되어 있어 **GitHub Pages에 그대로 올리면 바로 배포**되고, Safari에서 홈 화면/Dock에 추가하면 **앱처럼 실행(PWA)** 됩니다.

## 화면

| 파일 | 내용 |
| --- | --- |
| `index.html` | 시작 화면(front door). 아래 두 목업으로 이동 |
| `onboarding.html` | **온보딩 / 첫 실행** — 프로젝트도 지출도 없는 빈 상태에서 시작 |
| `features.html` | **기능 목업** — 가상 데이터가 채워진 상태로 8가지 핵심 기능 체험 |

두 목업의 마크업과 동작(JavaScript)은 원본과 **완전히 동일**합니다. 디자인만 글래스모피즘/그라데이션 스타일로 다시 입혔고, 폰트는 **Pretendard**를 적용했습니다.

## 프로젝트 구조

```
.
├─ index.html               # 시작 화면
├─ onboarding.html          # 온보딩 목업
├─ features.html            # 기능 목업
├─ assets/
│  └─ theme.css             # 글래스/그라데이션 테마 (원본 스타일 위에 덧입힘)
├─ icons/                   # 앱 아이콘 (SVG + PNG)
├─ manifest.webmanifest     # PWA 설치 정보
├─ sw.js                    # 서비스 워커 (오프라인 캐시)
└─ .nojekyll                # GitHub Pages가 파일을 그대로 서빙
```

디자인은 원본 파일을 건드리지 않는 방식으로 얹혔습니다. 각 HTML의 `<head>`에 폰트·테마·PWA 태그만 추가했고, 실제 스타일 변경은 `assets/theme.css`가 원본 인라인 스타일 **뒤에서** 덮어씁니다. 덕분에 모든 요소·기능이 원본과 동일하게 유지됩니다.

## 로컬에서 보기

정적 파일이라 아무 정적 서버로나 열면 됩니다. (서비스 워커 때문에 `file://` 직접 열기 대신 서버 권장)

```bash
# 이 폴더에서
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000 접속
```

## GitHub에 올리고 배포하기

```bash
git add -A
git commit -m "어브로디 목업 · 글래스모피즘 리디자인 + PWA"
git branch -M main
git remote add origin https://github.com/<사용자>/<저장소>.git
git push -u origin main
```

그다음 GitHub 저장소에서 **Settings → Pages → Build and deployment → Source: `Deploy from a branch` → Branch: `main` / `/ (root)`** 를 선택해 저장하면, 잠시 뒤 `https://<사용자>.github.io/<저장소>/` 주소로 공개됩니다.

## 지인에게 배포 후 "앱처럼" 쓰게 하기

공개된 주소를 전달한 뒤 Safari에서:

- **iPhone/iPad** — 공유 버튼 → **홈 화면에 추가**
- **Mac** — 공유 버튼 → **Dock에 추가**

추가하면 아이콘이 생기고, 브라우저 UI 없이 전체 화면(standalone)으로 실행됩니다. 서비스 워커가 화면을 캐시하므로 한 번 연 뒤에는 오프라인에서도 열립니다.

## 디자인 노트

- **밝은 톤 유지** — 카드·버튼 등 콘텐츠 표면은 흰색 그대로. 가독성 우선.
- **그라데이션 스카이** — 배경은 블루→바이올렛 오로라가 은은히 흐르는 그라데이션. `prefers-reduced-motion`에서는 정지.
- **프로스티드 글래스** — 폰 목업과 기능 카드가 배경 위에 떠 있는 반투명 유리 패널.
- **그라데이션 강조** — 주요 버튼·활성 상태·진행 바 등 강조 요소에만 블루→바이올렛 그라데이션.
- **Pretendard** — 전체 폰트. jsDelivr CDN의 dynamic-subset으로 로드(서비스 워커가 캐시).
