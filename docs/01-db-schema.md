# Profiler AI — Database Schema

## ERD Overview

```
universities ──< departments ──< professors ──< reviews >── users
     │                                │              │         │
     └──────────────< users           └── tags      └── review_likes
                                      │
                                      └── ai_profiles

reviews >── reports (신고)
```

---

## Tables

### `users`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| email | varchar(255) | UNIQUE, NOT NULL |
| password_hash | text | NOT NULL |
| nickname | varchar(50) | NOT NULL |
| university_id | uuid | FK → universities.id, NULLABLE |
| role | enum('student','admin') | DEFAULT 'student' |
| student_id | varchar(20) | NULLABLE |
| avatar_url | text | NULLABLE |
| bio | text | NULLABLE |
| is_verified | boolean | DEFAULT false |
| created_at | timestamptz | DEFAULT now() |
| updated_at | timestamptz | DEFAULT now() |

### `universities`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| name | varchar(100) | NOT NULL |
| short_name | varchar(20) | NULLABLE |
| domain | varchar(100) | NULLABLE (email domain) |
| logo_url | text | NULLABLE |
| location | varchar(100) | NULLABLE |
| established_year | int | NULLABLE |
| professor_count | int | DEFAULT 0 |
| created_at | timestamptz | DEFAULT now() |

### `departments`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| university_id | uuid | FK → universities.id |
| name | varchar(100) | NOT NULL |
| college | varchar(100) | NULLABLE (상위 단과대) |
| created_at | timestamptz | DEFAULT now() |

### `professors`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| university_id | uuid | FK → universities.id |
| department_id | uuid | FK → departments.id, NULLABLE |
| name | varchar(50) | NOT NULL |
| email | varchar(255) | NULLABLE |
| photo_url | text | NULLABLE |
| bio | text | NULLABLE |
| research_areas | text[] | DEFAULT '{}' |
| position | varchar(50) | NULLABLE (교수/부교수/조교수 등) |
| avg_rating | numeric(3,2) | DEFAULT 0 |
| avg_difficulty | numeric(3,2) | DEFAULT 0 |
| avg_clarity | numeric(3,2) | DEFAULT 0 |
| avg_helpfulness | numeric(3,2) | DEFAULT 0 |
| review_count | int | DEFAULT 0 |
| ai_summary | text | NULLABLE |
| ai_summary_updated_at | timestamptz | NULLABLE |
| created_at | timestamptz | DEFAULT now() |
| updated_at | timestamptz | DEFAULT now() |

### `reviews`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| professor_id | uuid | FK → professors.id |
| user_id | uuid | FK → users.id |
| content | text | NOT NULL, min 20 chars |
| rating_overall | smallint | NOT NULL, 1-5 |
| rating_difficulty | smallint | NOT NULL, 1-5 |
| rating_clarity | smallint | NOT NULL, 1-5 |
| rating_helpfulness | smallint | NOT NULL, 1-5 |
| course_name | varchar(100) | NULLABLE |
| semester | varchar(10) | NULLABLE (e.g. "2024-1") |
| is_anonymous | boolean | DEFAULT false |
| likes_count | int | DEFAULT 0 |
| is_deleted | boolean | DEFAULT false |
| created_at | timestamptz | DEFAULT now() |
| updated_at | timestamptz | DEFAULT now() |

**Unique constraint**: (professor_id, user_id) → 교수당 1인 1후기

### `review_likes`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| review_id | uuid | FK → reviews.id |
| user_id | uuid | FK → users.id |
| created_at | timestamptz | DEFAULT now() |

**Unique constraint**: (review_id, user_id)

### `professor_tags`
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| professor_id | uuid | FK → professors.id |
| label | varchar(30) | NOT NULL (e.g. "열정적", "과제많음") |
| count | int | DEFAULT 1 |

**Unique constraint**: (professor_id, label)

### `ai_profiles` (PRD: AIProfiles)
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| professor_id | uuid | FK → professors.id, UNIQUE |
| summary | text | NOT NULL |
| persona | text | NULLABLE (교수 페르소나 텍스트) |
| analysis_data | jsonb | NULLABLE (원시 분석 데이터) |
| review_count_at_gen | int | DEFAULT 0 (생성 당시 후기 수) |
| generated_at | timestamptz | DEFAULT now() |
| updated_at | timestamptz | DEFAULT now() |

### `reports` (신고 기능)
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| review_id | uuid | FK → reviews.id |
| reporter_id | uuid | FK → users.id |
| reason | enum('spam','inappropriate','false_info','other') | NOT NULL |
| detail | text | NULLABLE |
| status | enum('pending','reviewed','dismissed') | DEFAULT 'pending' |
| created_at | timestamptz | DEFAULT now() |

**Unique constraint**: (review_id, reporter_id)

---

## Supabase SQL (초기 마이그레이션)

```sql
-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Enums
create type user_role as enum ('student', 'admin');

-- Universities
create table universities (
  id uuid primary key default gen_random_uuid(),
  name varchar(100) not null,
  short_name varchar(20),
  domain varchar(100),
  logo_url text,
  location varchar(100),
  established_year int,
  professor_count int default 0,
  created_at timestamptz default now()
);

-- Departments
create table departments (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references universities(id) on delete cascade,
  name varchar(100) not null,
  college varchar(100),
  created_at timestamptz default now()
);

-- Users
create table users (
  id uuid primary key default gen_random_uuid(),
  email varchar(255) unique not null,
  password_hash text not null,
  nickname varchar(50) not null,
  university_id uuid references universities(id),
  role user_role default 'student',
  student_id varchar(20),
  avatar_url text,
  bio text,
  is_verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Professors
create table professors (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references universities(id) on delete cascade,
  department_id uuid references departments(id),
  name varchar(50) not null,
  email varchar(255),
  photo_url text,
  bio text,
  research_areas text[] default '{}',
  position varchar(50),
  avg_rating numeric(3,2) default 0,
  avg_difficulty numeric(3,2) default 0,
  avg_clarity numeric(3,2) default 0,
  avg_helpfulness numeric(3,2) default 0,
  review_count int default 0,
  ai_summary text,
  ai_summary_updated_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Reviews
create table reviews (
  id uuid primary key default gen_random_uuid(),
  professor_id uuid not null references professors(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  content text not null check (char_length(content) >= 20),
  rating_overall smallint not null check (rating_overall between 1 and 5),
  rating_difficulty smallint not null check (rating_difficulty between 1 and 5),
  rating_clarity smallint not null check (rating_clarity between 1 and 5),
  rating_helpfulness smallint not null check (rating_helpfulness between 1 and 5),
  course_name varchar(100),
  semester varchar(10),
  is_anonymous boolean default false,
  likes_count int default 0,
  is_deleted boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(professor_id, user_id)
);

-- Review Likes
create table review_likes (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references reviews(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz default now(),
  unique(review_id, user_id)
);

-- Professor Tags
create table professor_tags (
  id uuid primary key default gen_random_uuid(),
  professor_id uuid not null references professors(id) on delete cascade,
  label varchar(30) not null,
  count int default 1,
  unique(professor_id, label)
);

-- AI Profiles (PRD: AIProfiles — 교수별 AI 분석 결과를 별도 테이블로 관리)
create type report_reason as enum ('spam', 'inappropriate', 'false_info', 'other');
create type report_status as enum ('pending', 'reviewed', 'dismissed');

create table ai_profiles (
  id uuid primary key default gen_random_uuid(),
  professor_id uuid not null references professors(id) on delete cascade unique,
  summary text not null,
  persona text,
  analysis_data jsonb,
  review_count_at_gen int default 0,
  generated_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Reports (신고 기능)
create table reports (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references reviews(id) on delete cascade,
  reporter_id uuid not null references users(id) on delete cascade,
  reason report_reason not null,
  detail text,
  status report_status default 'pending',
  created_at timestamptz default now(),
  unique(review_id, reporter_id)
);

-- Indexes
create index idx_professors_university on professors(university_id);
create index idx_professors_department on professors(department_id);
create index idx_professors_name on professors using gin(to_tsvector('simple', name));
create index idx_reviews_professor on reviews(professor_id);
create index idx_reviews_user on reviews(user_id);
create index idx_users_email on users(email);

-- Trigger: update professors avg_rating on review insert/update
create or replace function update_professor_ratings()
returns trigger as $$
begin
  update professors set
    avg_rating = (select avg(rating_overall) from reviews where professor_id = NEW.professor_id and is_deleted = false),
    avg_difficulty = (select avg(rating_difficulty) from reviews where professor_id = NEW.professor_id and is_deleted = false),
    avg_clarity = (select avg(rating_clarity) from reviews where professor_id = NEW.professor_id and is_deleted = false),
    avg_helpfulness = (select avg(rating_helpfulness) from reviews where professor_id = NEW.professor_id and is_deleted = false),
    review_count = (select count(*) from reviews where professor_id = NEW.professor_id and is_deleted = false)
  where id = NEW.professor_id;
  return NEW;
end;
$$ language plpgsql;

create trigger trg_update_professor_ratings
after insert or update on reviews
for each row execute function update_professor_ratings();
```
