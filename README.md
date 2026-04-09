# 구성요건 판례 탐색기 MVP

현직 경찰관을 위한 법령 구성요건별 판례 큐레이션 도구.
법제처 Open API 기반 + 동표 매뉴얼 큐레이션.

## 프로젝트 구조

```
legal-explorer/
├── index.html           ← 웹 UI (화면)
├── api/
│   └── precedents.js    ← 법제처 API 중계 서버
└── README.md
```

## 배포하기 (Vercel, 10분 소요)

### 1단계: GitHub 계정 만들기

1. https://github.com 접속
2. 이메일로 무료 가입
3. 새 Repository 만들기 (이름: `legal-explorer`, Public 또는 Private)

### 2단계: 파일 업로드

**방법 A — 웹에서 직접 업로드 (가장 쉬움)**
1. 만든 Repository 페이지에서 "Add file" → "Upload files"
2. `legal-explorer` 폴더 안의 모든 파일 드래그앤드롭
   - `index.html`
   - `api/precedents.js` (api 폴더 그대로)
   - `README.md`
3. "Commit changes" 클릭

**방법 B — Git 명령어 (터미널 익숙하면)**
```bash
cd legal-explorer
git init
git add .
git commit -m "initial"
git remote add origin https://github.com/본인아이디/legal-explorer.git
git push -u origin main
```

### 3단계: Vercel 배포

1. https://vercel.com 접속
2. "Sign Up" → "Continue with GitHub" (GitHub 계정으로 로그인)
3. 로그인 후 "Add New..." → "Project" 클릭
4. 아까 만든 `legal-explorer` Repository 선택 → "Import"
5. 설정 화면에서:
   - Framework Preset: **Other**
   - 나머지는 기본값 유지
6. **"Environment Variables"** 섹션 펼치기
   - Key: `LAW_OC`
   - Value: `boy806` (법제처 API 인증값)
   - "Add" 클릭
7. "Deploy" 클릭

1~2분 기다리면 배포 완료. `https://legal-explorer-XXXX.vercel.app` 같은 주소가 생김.

### 4단계: 확인

배포된 주소 접속 → 스토킹 법조문에서 "의사에 반하여" 터치 → 큐레이션 판례 + 법제처 실시간 검색 결과가 둘 다 나와야 정상.

## 환경 변수

- `LAW_OC`: 법제처 Open API 인증값 (필수)

## 로컬 테스트

Node.js 18+ 설치 후:
```bash
npx vercel dev
```

## 주의사항

- 법제처 API는 HTTP (HTTPS 아님) 요청이라 브라우저에서 직접 호출 불가
- 반드시 `api/precedents.js`를 통해 서버 경유해야 함
- 법제처 API 사용량 제한: 하루 수천 건 (충분함)
- 현재 3개 죄명(스토킹·가정폭력·아동학대) 수록, 추후 확장 가능

## 다음 단계

1. 다른 죄명 추가 (사기, 절도, 상해, 성폭력 등)
2. 사용자 피드백 수집 기능
3. 결제 시스템 연동 (유료 전환)
4. 도메인 연결

---

v0.1 · 현직 경찰관 큐레이션
