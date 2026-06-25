# Profiler AI

> 대학생이 교수 정보를 검색하고 후기를 작성하는 AI 기반 플랫폼

## Tech Stack

| Layer | Tech |
|---|---|
| Mobile | React Native (Expo), Expo Router, Zustand, React Query |
| API | NestJS, TypeScript, JWT + Argon2, RBAC |
| Database | Supabase (PostgreSQL) |
| AI | OpenAI GPT (MockAI fallback 포함) |
| Monorepo | Yarn Workspaces |

---

## 빠른 시작

### 1. 의존성 설치

```bash
yarn install
```

### 2. Supabase 설정

1. [supabase.com](https://supabase.com)에서 프로젝트 생성
2. `docs/01-db-schema.md`의 SQL 마이그레이션을 Supabase SQL Editor에서 실행
3. Project URL, anon key, service role key 복사

### 3. API 환경변수 설정

```bash
cp apps/api/.env.example apps/api/.env.local
```

`.env.local`에 Supabase 정보와 JWT 시크릿 입력:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
JWT_SECRET=your-random-secret
JWT_REFRESH_SECRET=your-random-refresh-secret

# OpenAI (선택 — 없으면 Mock AI 사용)
OPENAI_API_KEY=sk-...
```

### 4. API 서버 실행

```bash
yarn dev:api
# → http://localhost:3000/v1
```

### 5. 모바일 앱 실행

```bash
# apps/mobile/.env 생성
echo "EXPO_PUBLIC_API_URL=http://localhost:3000/v1" > apps/mobile/.env

yarn dev:mobile
# → Expo Go 또는 시뮬레이터
```

---

## 프로젝트 구조

```
profiler-ai/
├── apps/
│   ├── api/          # NestJS Backend
│   └── mobile/       # React Native (Expo)
├── packages/
│   └── shared/       # 공유 TypeScript 타입
└── docs/             # 아키텍처 문서
    ├── 01-db-schema.md
    ├── 02-api-spec.md
    ├── 03-screens.md
    └── 04-folder-structure.md
```

## 주요 기능

- **회원가입/로그인** — JWT + Argon2 + 자동 토큰 갱신
- **학교/교수 검색** — 이름 검색, 학과 필터, 평점순 정렬
- **교수 상세 페이지** — 평점 분석, 태그 요약, 후기 목록
- **후기 작성** — 별점 4종, 태그 선택, 익명 옵션
- **좋아요 시스템** — 후기 공감 기능
- **AI 요약** — OpenAI GPT 기반 교수 강의 요약 (24시간 캐싱)
- **RBAC** — student/admin 권한 분리

## AI Layer

`apps/api/src/ai/interfaces/ai-provider.interface.ts`에 정의된 인터페이스를 구현하면 어떤 AI 프로바이더도 연동 가능합니다.

현재:
- `OpenAiProvider` — GPT API 연동 (OPENAI_API_KEY 필요)
- `MockAiProvider` — 개발/테스트용 Mock (API key 없을 때 자동 사용)

향후 추가 가능:
- Claude API, Gemini, 로컬 LLM 등

## API 문서

서버 실행 후 `http://localhost:3000/v1`에서 API 테스트 가능.
상세 명세는 `docs/02-api-spec.md` 참조.
