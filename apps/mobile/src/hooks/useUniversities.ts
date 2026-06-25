import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { universitiesService } from '../services/universities.service';

export function useSearchUniversities(q: string) {
  return useInfiniteQuery({
    queryKey: ['universities', q],
    queryFn: ({ pageParam = 0 }) =>
      universitiesService.search({ q, limit: 20, offset: pageParam as number }),
    getNextPageParam: (last, pages) => {
      const loaded = pages.reduce((acc, p) => acc + p.data.length, 0);
      return loaded < last.total ? loaded : undefined;
    },
    initialPageParam: 0,
  });
}

export function useUniversity(id: string) {
  return useQuery({
    queryKey: ['university', id],
    queryFn: () => universitiesService.findById(id),
    enabled: !!id,
  });
}
