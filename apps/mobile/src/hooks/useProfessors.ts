import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { professorsService } from '../services/professors.service';

interface SearchParams {
  q?: string;
  universityId?: string;
  departmentId?: string;
  sortBy?: 'rating' | 'reviews' | 'name';
}

export function useSearchProfessors(params: SearchParams) {
  return useInfiniteQuery({
    queryKey: ['professors', params],
    queryFn: ({ pageParam = 0 }) =>
      professorsService.search({ ...params, limit: 20, offset: pageParam as number }),
    getNextPageParam: (last, pages) => {
      const loaded = pages.reduce((acc, p) => acc + p.data.length, 0);
      return loaded < last.total ? loaded : undefined;
    },
    initialPageParam: 0,
    enabled: true,
  });
}

export function useProfessor(id: string) {
  return useQuery({
    queryKey: ['professor', id],
    queryFn: () => professorsService.findById(id),
    enabled: !!id,
  });
}

export function useProfessorReviews(id: string) {
  return useInfiniteQuery({
    queryKey: ['professor-reviews', id],
    queryFn: ({ pageParam = 0 }) =>
      professorsService.getReviews(id, { limit: 20, offset: pageParam as number }),
    getNextPageParam: (last, pages) => {
      const loaded = pages.reduce((acc, p) => acc + p.data.length, 0);
      return loaded < last.total ? loaded : undefined;
    },
    initialPageParam: 0,
    enabled: !!id,
  });
}

export function useAiSummary(id: string) {
  return useQuery({
    queryKey: ['ai-summary', id],
    queryFn: () => professorsService.getAiSummary(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
  });
}
