# Profiler AI — REST API Specification

**Base URL**: `https://api.profiler-ai.com/v1`  
**Auth**: Bearer JWT (Authorization header)

---

## 1. Auth

### POST `/auth/register`
회원가입

**Request Body**
```json
{
  "email": "student@yonsei.ac.kr",
  "password": "SecurePass!1",
  "nickname": "김연세",
  "universityId": "uuid-optional"
}
```
**Response 201**
```json
{
  "accessToken": "jwt...",
  "refreshToken": "jwt...",
  "user": { "id": "...", "email": "...", "nickname": "...", "role": "student" }
}
```

---

### POST `/auth/login`
로그인

**Request Body**
```json
{ "email": "student@yonsei.ac.kr", "password": "SecurePass!1" }
```
**Response 200** — 동일한 토큰 구조

---

### POST `/auth/refresh`
액세스 토큰 갱신

**Request Body**
```json
{ "refreshToken": "jwt..." }
```
**Response 200**
```json
{ "accessToken": "jwt..." }
```

---

### GET `/auth/me`
🔒 현재 로그인 유저 정보

**Response 200**
```json
{
  "id": "uuid",
  "email": "...",
  "nickname": "...",
  "role": "student",
  "university": { "id": "...", "name": "연세대학교" },
  "avatarUrl": null,
  "bio": null,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

## 2. Universities

### GET `/universities`
대학교 검색/목록

**Query Params**
| Param | Type | Description |
|---|---|---|
| q | string | 검색어 (이름) |
| limit | int | 기본 20 |
| offset | int | 기본 0 |

**Response 200**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "연세대학교",
      "shortName": "연세대",
      "logoUrl": "https://...",
      "location": "서울",
      "professorCount": 1200
    }
  ],
  "total": 45,
  "limit": 20,
  "offset": 0
}
```

---

### GET `/universities/:id`
대학교 상세

**Response 200**
```json
{
  "id": "uuid",
  "name": "연세대학교",
  "shortName": "연세대",
  "domain": "yonsei.ac.kr",
  "logoUrl": "https://...",
  "location": "서울",
  "establishedYear": 1885,
  "professorCount": 1200,
  "departments": [
    { "id": "uuid", "name": "컴퓨터과학과", "college": "공과대학" }
  ]
}
```

---

### GET `/universities/:id/departments`
단과대/학과 목록

**Response 200**
```json
{
  "data": [
    { "id": "uuid", "name": "컴퓨터과학과", "college": "공과대학" }
  ]
}
```

---

## 3. Professors

### GET `/professors`
교수 검색

**Query Params**
| Param | Type | Description |
|---|---|---|
| q | string | 교수 이름 검색어 |
| courseName | string | **과목명 검색** (FR-003) — 해당 과목을 가르친 교수 검색 |
| universityId | uuid | 대학교 필터 |
| departmentId | uuid | 학과 필터 |
| sortBy | string | rating \| reviews \| name (기본: rating) |
| order | string | asc \| desc (기본: desc) |
| limit | int | 기본 20 |
| offset | int | 기본 0 |

**Response 200**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "홍길동",
      "position": "교수",
      "photoUrl": "https://...",
      "department": { "id": "uuid", "name": "컴퓨터과학과" },
      "university": { "id": "uuid", "name": "연세대학교" },
      "avgRating": 4.2,
      "avgDifficulty": 3.8,
      "reviewCount": 47,
      "topTags": ["열정적", "과제많음", "친절함"]
    }
  ],
  "total": 120,
  "limit": 20,
  "offset": 0
}
```

---

### GET `/professors/:id`
교수 상세

**Response 200**
```json
{
  "id": "uuid",
  "name": "홍길동",
  "position": "교수",
  "email": "hong@yonsei.ac.kr",
  "photoUrl": "https://...",
  "bio": "...",
  "researchAreas": ["머신러닝", "컴퓨터비전"],
  "department": { "id": "uuid", "name": "컴퓨터과학과", "college": "공과대학" },
  "university": { "id": "uuid", "name": "연세대학교" },
  "ratings": {
    "overall": 4.2,
    "difficulty": 3.8,
    "clarity": 4.5,
    "helpfulness": 4.0
  },
  "reviewCount": 47,
  "tags": [
    { "label": "열정적", "count": 32 },
    { "label": "과제많음", "count": 25 }
  ],
  "aiSummary": "홍길동 교수는...",
  "aiSummaryUpdatedAt": "2024-06-01T00:00:00Z"
}
```

---

### GET `/professors/:id/reviews`
교수 후기 목록

**Query Params**: limit, offset, sortBy (likes|date)

**Response 200**
```json
{
  "data": [
    {
      "id": "uuid",
      "content": "정말 열정적인 교수님...",
      "ratings": {
        "overall": 5,
        "difficulty": 4,
        "clarity": 5,
        "helpfulness": 5
      },
      "courseName": "운영체제",
      "semester": "2024-1",
      "isAnonymous": false,
      "author": { "id": "uuid", "nickname": "김연세", "avatarUrl": null },
      "likesCount": 12,
      "isLikedByMe": false,
      "createdAt": "2024-06-15T12:00:00Z"
    }
  ],
  "total": 47,
  "limit": 20,
  "offset": 0
}
```

---

### GET `/professors/:id/ai-summary`
🔒 AI 요약 조회/재생성

**Response 200**
```json
{
  "professorId": "uuid",
  "summary": "홍길동 교수는 연세대학교 컴퓨터과학과 소속으로...",
  "updatedAt": "2024-06-01T00:00:00Z",
  "reviewCount": 47
}
```

---

## 4. Reviews

### POST `/reviews`
🔒 후기 작성

**Request Body**
```json
{
  "professorId": "uuid",
  "content": "정말 열정적인 교수님입니다. 강의가 체계적이고...",
  "ratingOverall": 5,
  "ratingDifficulty": 4,
  "ratingClarity": 5,
  "ratingHelpfulness": 5,
  "courseName": "운영체제",
  "semester": "2024-1",
  "isAnonymous": false,
  "tags": ["열정적", "친절함"]
}
```
**Response 201** — 생성된 리뷰 객체

---

### PUT `/reviews/:id`
🔒 후기 수정 (본인만)

**Request Body** — 변경할 필드만

**Response 200** — 수정된 리뷰 객체

---

### DELETE `/reviews/:id`
🔒 후기 삭제 (본인 또는 admin)

**Response 204**

---

### POST `/reviews/:id/like`
🔒 후기 좋아요

**Response 201**
```json
{ "likesCount": 13 }
```

---

### DELETE `/reviews/:id/like`
🔒 후기 좋아요 취소

**Response 200**
```json
{ "likesCount": 12 }
```

---

## 5. Users

### GET `/users/me`
🔒 내 프로필

**Response 200** — auth/me와 동일 구조

---

### PUT `/users/me`
🔒 내 프로필 수정

**Request Body**
```json
{
  "nickname": "새닉네임",
  "bio": "자기소개",
  "universityId": "uuid",
  "studentId": "2024123456"
}
```

---

### GET `/users/me/reviews`
🔒 내가 작성한 후기 목록

**Response 200** — reviews 배열

---

## 6. Reports (신고)

### POST `/reports`
🔒 후기 신고

**Request Body**
```json
{
  "reviewId": "uuid",
  "reason": "spam",
  "detail": "광고성 게시물입니다."
}
```
`reason`: `spam` | `inappropriate` | `false_info` | `other`

**Response 201**
```json
{ "message": "신고가 접수되었습니다.", "reportId": "uuid" }
```

---

### GET `/reports`
🔒 Admin 신고 목록 조회

**Response 200** — 신고 목록 배열

---

### PATCH `/reports/:id/status`
🔒 Admin 신고 상태 변경

**Request Body**
```json
{ "status": "reviewed" }
```
`status`: `reviewed` | `dismissed`

---

## Error Format

```json
{
  "statusCode": 400,
  "message": "이미 등록된 이메일입니다.",
  "error": "Bad Request",
  "timestamp": "2024-06-25T10:00:00Z",
  "path": "/v1/auth/register"
}
```

## RBAC

| Role | 권한 |
|---|---|
| student | 후기 CRUD (본인), 좋아요, 검색, 조회 |
| admin | 모든 리소스 CRUD, 교수 등록/수정, 대학 관리 |
