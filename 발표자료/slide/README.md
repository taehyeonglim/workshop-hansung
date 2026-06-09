# 한성대학교 교수법 워크숍 슬라이드

이 폴더는 GitHub Pages에서 바로 배포할 수 있는 정적 HTML 발표자료입니다.

- 로컬 확인: `index.html`을 브라우저에서 열기
- GitHub Pages 배포: `.github/workflows/deploy-slide.yml`이 이 폴더만 Pages 배포 파일로 올립니다.
- 저장소 Settings > Pages > Build and deployment에서 Source를 `GitHub Actions`로 설정하세요.
- 예상 URL: `https://<github-id>.github.io/workshop-hansung/`

파일 구성:

- `index.html`: 발표자료 진입점
- `styles.css`: 슬라이드 화면, 인쇄, 반응형 스타일
- `app.js`: 슬라이드 데이터, 내비게이션, SVG 차트 렌더링
