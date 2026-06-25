# Profiler AI — Screen Structure

## Navigation Architecture

```
Root Stack
├── (auth) Stack — 비로그인
│   ├── /welcome           Splash / Onboarding
│   ├── /login             로그인
│   └── /register
│       ├── /register/     Step 1: 기본 정보
│       └── /register/university  Step 2: 학교 선택
│
└── (tabs) Tab Navigator — 로그인 후
    ├── / (index)          홈 · 검색 허브
    ├── /explore           탐색 (대학/교수 브라우저)
    └── /profile
        ├── /profile/      내 프로필
        ├── /profile/reviews  내 후기 목록
        └── /profile/settings 설정

+ Modal Stack (전체 앱)
    ├── /professor/[id]          교수 상세
    ├── /professor/[id]/review   후기 작성/수정
    └── /university/[id]         대학교 상세
```

---

## Screen Descriptions

### 1. Welcome (Splash/Onboarding)
- 앱 로고 + 슬로건
- "로그인" / "회원가입" CTA 버튼
- 배경: 그라데이션 (Duolingo 스타일 에너지)

### 2. Login
- 이메일 / 비밀번호 입력
- "로그인" 버튼
- "회원가입" 링크
- 에러 인라인 표시

### 3. Register Step 1 — 기본 정보
- 이메일 입력
- 닉네임 입력
- 비밀번호 / 확인 입력
- 진행 표시 바 (1/2)
- "다음" 버튼

### 4. Register Step 2 — 학교 선택
- 대학교 검색 입력
- 검색 결과 카드 목록
- "건너뛰기" 옵션
- "완료" 버튼

### 5. Home (검색 허브)
- 상단: 인사말 + 알림 아이콘
- 대형 검색 바 (교수/학교 통합 검색)
- 섹션: 최근 검색
- 섹션: 높은 평점 교수 카드 슬라이더
- 섹션: 최신 후기 피드 (Threads 스타일)

### 6. Explore (탐색)
- 탭: 교수 | 대학교
- 필터 칩: 학과, 평점, 정렬
- 무한 스크롤 카드 그리드

### 7. Professor Detail
```
┌─────────────────────────────┐
│  [photo]  홍길동 교수        │
│           연세대 · 컴퓨터공학 │
│  ★ 4.2  후기 47개           │
├─────────────────────────────┤
│  [태그 칩들: 열정적, 과제많음] │
├─────────────────────────────┤
│  📊 평점 상세                │
│  전반  ████████░░ 4.2       │
│  난이도 ███████░░░ 3.8       │
│  명확성 █████████░ 4.5       │
│  친절함 ████████░░ 4.0       │
├─────────────────────────────┤
│  🤖 AI 요약 (카드)           │
│  "홍길동 교수는 열정적인..."  │
├─────────────────────────────┤
│  💬 후기 목록 (정렬: 좋아요순) │
│  [ReviewCard]               │
│  [ReviewCard]               │
└─────────────────────────────┘
         [후기 쓰기] FAB
```

### 8. Write Review
- 교수 미니 프로필 상단 고정
- 과목명 입력
- 학기 선택 (드롭다운)
- 4가지 별점 슬라이더
  - 전반적 평점 ★
  - 강의 난이도 ★
  - 전달력 ★
  - 친절도 ★
- 태그 선택 (다중 선택 칩)
- 본문 입력 (최소 20자)
- 익명 여부 토글
- "제출" 버튼

### 9. My Profile
- 아바타 + 닉네임 + 대학교
- 작성 후기 수
- 내 후기 목록 (간략)
- "프로필 편집" 버튼

### 10. University Detail
- 대학교 로고 + 이름 + 위치
- 교수 수 · 후기 수
- 학과 목록 탭
- 소속 교수 카드 그리드

---

## Component System (Design Tokens)

### Colors (Threads × Duolingo × Notion)
```
Primary:    #4F46E5  (Indigo-600) — 주 CTA
Secondary:  #10B981  (Emerald-500) — 성공/완료
Accent:     #F59E0B  (Amber-500) — 별점/하이라이트
Surface:    #FFFFFF  / #F9FAFB (카드 배경)
Background: #F3F4F6  (앱 배경)
Text:       #111827  / #6B7280 (primary/secondary)
Border:     #E5E7EB
Error:      #EF4444
```

### Typography
```
Title-XL:   28px, 700, -0.5 letterSpacing
Title-L:    22px, 700
Title-M:    18px, 600
Body:       15px, 400
Body-SM:    13px, 400
Caption:    11px, 400, #6B7280
```

### Spacing Scale
```
xs: 4  sm: 8  md: 16  lg: 24  xl: 32  2xl: 48
```

### Border Radius
```
sm: 8  md: 12  lg: 16  xl: 24  full: 9999
```

### Shadows
```
card:   0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)
modal:  0 4px 24px rgba(0,0,0,0.12)
```

### Core Components
| Component | Props |
|---|---|
| `Button` | variant(primary/secondary/ghost/danger), size(sm/md/lg), loading |
| `Card` | padding, shadow, onPress |
| `Input` | label, error, leftIcon, rightIcon, secureEntry |
| `Badge` | label, color |
| `Avatar` | uri, size, fallbackText |
| `StarRating` | value, max, onChange, size, color |
| `ProfessorCard` | professor, onPress, compact |
| `ReviewCard` | review, onLike, onDelete, currentUserId |
| `SearchBar` | value, onChange, placeholder, loading |
| `TagChip` | label, selected, onPress |
| `RatingBar` | label, value, max |
