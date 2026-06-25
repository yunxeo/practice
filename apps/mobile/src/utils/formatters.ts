export function formatRating(value: number, decimals = 1): string {
  return value.toFixed(decimals);
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return '오늘';
  if (days === 1) return '어제';
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  if (days < 365) return `${Math.floor(days / 30)}달 전`;
  return `${Math.floor(days / 365)}년 전`;
}

export function formatSemester(semester: string | null): string {
  if (!semester) return '';
  const [year, term] = semester.split('-');
  return `${year}년 ${term}학기`;
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return '#10B981';
  if (rating >= 3.5) return '#F59E0B';
  return '#EF4444';
}
