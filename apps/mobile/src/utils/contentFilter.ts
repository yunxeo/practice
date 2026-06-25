// 클라이언트 사이드 1차 욕설 필터 (PRD: Abuse Prevention)
// 서버 측 AI 기반 필터링의 보조 역할 — 명확한 단어만 차단

const BLOCKED_PATTERNS = [
  /씨발/gi,
  /개새끼/gi,
  /병신/gi,
  /지랄/gi,
  /미친놈/gi,
  /개년/gi,
  /꺼져/gi,
  /죽어/gi,
  /fuck/gi,
  /shit/gi,
  /asshole/gi,
  /bitch/gi,
];

export function containsProfanity(text: string): boolean {
  return BLOCKED_PATTERNS.some((pattern) => pattern.test(text));
}

export function sanitizeContent(text: string): { isClean: boolean; message?: string } {
  if (containsProfanity(text)) {
    return {
      isClean: false,
      message: '정중한 언어로 작성해 주세요.',
    };
  }
  return { isClean: true };
}
