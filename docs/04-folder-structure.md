# Profiler AI — Folder Structure

```
profiler-ai/
├── apps/
│   ├── api/                          # NestJS Backend
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── config/
│   │   │   │   ├── configuration.ts      # env 설정
│   │   │   │   └── supabase.config.ts    # Supabase 클라이언트
│   │   │   ├── common/
│   │   │   │   ├── decorators/
│   │   │   │   │   ├── current-user.decorator.ts
│   │   │   │   │   └── roles.decorator.ts
│   │   │   │   ├── guards/
│   │   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   │   └── roles.guard.ts
│   │   │   │   ├── filters/
│   │   │   │   │   └── http-exception.filter.ts
│   │   │   │   └── interceptors/
│   │   │   │       └── transform.interceptor.ts
│   │   │   ├── auth/
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── strategies/
│   │   │   │   │   └── jwt.strategy.ts
│   │   │   │   └── dto/
│   │   │   │       ├── register.dto.ts
│   │   │   │       └── login.dto.ts
│   │   │   ├── users/
│   │   │   │   ├── users.module.ts
│   │   │   │   ├── users.controller.ts
│   │   │   │   ├── users.service.ts
│   │   │   │   └── dto/
│   │   │   │       └── update-user.dto.ts
│   │   │   ├── universities/
│   │   │   │   ├── universities.module.ts
│   │   │   │   ├── universities.controller.ts
│   │   │   │   ├── universities.service.ts
│   │   │   │   └── dto/
│   │   │   │       └── search-university.dto.ts
│   │   │   ├── professors/
│   │   │   │   ├── professors.module.ts
│   │   │   │   ├── professors.controller.ts
│   │   │   │   ├── professors.service.ts
│   │   │   │   └── dto/
│   │   │   │       └── search-professor.dto.ts
│   │   │   ├── reviews/
│   │   │   │   ├── reviews.module.ts
│   │   │   │   ├── reviews.controller.ts
│   │   │   │   ├── reviews.service.ts
│   │   │   │   └── dto/
│   │   │   │       ├── create-review.dto.ts
│   │   │   │       └── update-review.dto.ts
│   │   │   └── ai/
│   │   │       ├── ai.module.ts
│   │   │       ├── ai.service.ts
│   │   │       ├── interfaces/
│   │   │       │   └── ai-provider.interface.ts  # OpenAI 연동용 인터페이스
│   │   │       └── providers/
│   │   │           ├── openai.provider.ts        # 실제 OpenAI 구현체
│   │   │           └── mock-ai.provider.ts       # 개발용 Mock
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── mobile/                       # React Native (Expo)
│       ├── src/
│       │   ├── app/                  # Expo Router (파일 기반 라우팅)
│       │   │   ├── _layout.tsx       # Root layout (토큰 체크 → 리다이렉트)
│       │   │   ├── (auth)/
│       │   │   │   ├── _layout.tsx
│       │   │   │   ├── welcome.tsx
│       │   │   │   ├── login.tsx
│       │   │   │   └── register/
│       │   │   │       ├── index.tsx
│       │   │   │       └── university.tsx
│       │   │   ├── (tabs)/
│       │   │   │   ├── _layout.tsx
│       │   │   │   ├── index.tsx     # Home
│       │   │   │   ├── explore.tsx
│       │   │   │   └── profile/
│       │   │   │       ├── index.tsx
│       │   │   │       ├── reviews.tsx
│       │   │   │       └── settings.tsx
│       │   │   ├── professor/
│       │   │   │   ├── [id].tsx      # 교수 상세
│       │   │   │   └── [id]/
│       │   │   │       └── review.tsx  # 후기 작성
│       │   │   └── university/
│       │   │       └── [id].tsx      # 대학교 상세
│       │   │
│       │   ├── components/
│       │   │   ├── ui/               # 기본 디자인 시스템
│       │   │   │   ├── Button.tsx
│       │   │   │   ├── Card.tsx
│       │   │   │   ├── Input.tsx
│       │   │   │   ├── Badge.tsx
│       │   │   │   ├── Avatar.tsx
│       │   │   │   ├── StarRating.tsx
│       │   │   │   ├── TagChip.tsx
│       │   │   │   └── RatingBar.tsx
│       │   │   ├── ProfessorCard.tsx
│       │   │   ├── ReviewCard.tsx
│       │   │   ├── UniversityCard.tsx
│       │   │   ├── SearchBar.tsx
│       │   │   └── AiSummaryCard.tsx
│       │   │
│       │   ├── hooks/
│       │   │   ├── useAuth.ts
│       │   │   ├── useProfessors.ts
│       │   │   ├── useReviews.ts
│       │   │   └── useUniversities.ts
│       │   │
│       │   ├── services/             # API 호출 레이어
│       │   │   ├── api.ts            # Axios 인스턴스 + 인터셉터
│       │   │   ├── auth.service.ts
│       │   │   ├── professors.service.ts
│       │   │   ├── reviews.service.ts
│       │   │   └── universities.service.ts
│       │   │
│       │   ├── stores/               # Zustand 전역 상태
│       │   │   ├── auth.store.ts
│       │   │   └── search.store.ts
│       │   │
│       │   ├── types/
│       │   │   └── index.ts          # 공유 TypeScript 타입
│       │   │
│       │   └── utils/
│       │       ├── colors.ts         # 디자인 토큰
│       │       ├── typography.ts
│       │       └── formatters.ts
│       │
│       ├── assets/
│       │   └── images/
│       ├── app.json
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   └── shared/                       # 공유 타입 패키지
│       ├── src/
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── docs/
│   ├── 01-db-schema.md
│   ├── 02-api-spec.md
│   ├── 03-screens.md
│   └── 04-folder-structure.md
│
├── package.json                      # Workspace root
└── README.md
```

## 의존성 흐름

```
mobile → packages/shared (타입)
api    → packages/shared (타입)
api    → Supabase (DB)
api    → OpenAI (AI, 선택적)
mobile → api (REST)
```

## 주요 라이브러리

### API (NestJS)
| 패키지 | 용도 |
|---|---|
| @nestjs/jwt | JWT 토큰 |
| @nestjs/passport | 인증 전략 |
| @nestjs/config | 환경변수 |
| @supabase/supabase-js | Supabase 클라이언트 |
| argon2 | 비밀번호 해시 |
| class-validator | DTO 유효성 검사 |
| class-transformer | 직렬화 |

### Mobile (Expo)
| 패키지 | 용도 |
|---|---|
| expo-router | 파일 기반 라우팅 |
| @tanstack/react-query | 서버 상태 관리 |
| zustand | 클라이언트 상태 관리 |
| axios | HTTP 클라이언트 |
| expo-secure-store | 토큰 저장 |
| @expo/vector-icons | 아이콘 |
| react-native-reanimated | 애니메이션 |
