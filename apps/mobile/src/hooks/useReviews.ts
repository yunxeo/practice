import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsService } from '../services/reviews.service';

interface CreateReviewParams {
  professorId: string;
  content: string;
  ratingOverall: number;
  ratingDifficulty: number;
  ratingClarity: number;
  ratingHelpfulness: number;
  courseName?: string;
  semester?: string;
  isAnonymous?: boolean;
  tags?: string[];
}

export function useCreateReview() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateReviewParams) => reviewsService.create(params),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['professor', variables.professorId] });
      qc.invalidateQueries({ queryKey: ['professor-reviews', variables.professorId] });
    },
  });
}

export function useDeleteReview(professorId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => reviewsService.remove(reviewId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['professor-reviews', professorId] });
    },
  });
}

export function useLikeReview(professorId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, liked }: { reviewId: string; liked: boolean }) =>
      liked ? reviewsService.unlike(reviewId) : reviewsService.like(reviewId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['professor-reviews', professorId] });
    },
  });
}
