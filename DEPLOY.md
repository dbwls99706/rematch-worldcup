# 🚀 배포 & GitHub 제출 가이드

빌드는 이미 검증되었습니다 (`npm run build` → `dist/`, 122KB gzip). 아래 중 하나만 하면 됩니다.

## 1. GitHub 저장소 (본인 계정 소유 필수)

> ⚠️ 규정: **8/3 10:00 이후 commit 이력이 있으면 실격.** 8/2까지 코드 프리즈.

github.com에서 빈 저장소(예: `rematch`)를 먼저 만든 뒤:

```bash
git remote add origin https://github.com/<본인아이디>/rematch.git
git branch -M main
git push -u origin main
```

`gh` CLI가 설치·로그인돼 있다면 한 번에:

```bash
gh repo create rematch --public --source=. --remote=origin --push
```

## 2. 배포 (외부 접속 가능한 URL — 심사 기준)

### 옵션 A. Vercel + GitHub 연결 (권장 · 자동 재배포)
1. https://vercel.com → **Add New → Project → Import** 위 GitHub 저장소 선택
2. Framework `Vite` 자동 감지, 그대로 **Deploy** (설정 변경 불필요)
3. 생성된 `https://<프로젝트>.vercel.app` 이 제출용 URL

### 옵션 B. Vercel CLI (저장소 없이 즉시)
```bash
npm i -g vercel   # 또는 npx 사용
vercel --prod     # 브라우저 로그인 후 자동 빌드·배포
```

### 옵션 C. Netlify Drop (가장 간단 · 설정 0)
1. `npm run build` 로 `dist/` 생성 (이미 되어 있음)
2. https://app.netlify.com/drop 에 **`dist` 폴더를 드래그앤드롭**
3. 즉시 생성되는 URL이 제출용 (안정적 URL 유지를 위해 로그인 권장)

## 3. 제출 체크리스트
- [ ] 배포 URL 외부 접속 확인 (시크릿창에서 무가입 플레이)
- [ ] GitHub 저장소 public + README 포함
- [ ] 유튜브 시연영상 (`docs/시연영상_구성안.md` 대본 참고)
- [ ] 세 링크를 DACON 제출 페이지에 등록
