export * from '@profiler-ai/shared';

export const PREDEFINED_TAGS = [
  '열정적', '친절함', '명확한 설명', '과제많음', '출석엄격',
  '학점관대', '학점엄격', '시험어려움', '시험쉬움', '소통잘됨',
  '준비충실', '유머있음', '지각허용', '실습위주', '이론위주',
] as const;

export type PredefinedTag = typeof PREDEFINED_TAGS[number];
