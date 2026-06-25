import { api } from './api';
import { Review } from '../types';

function unwrap<T>(res: { data: { data: T } }): T {
  return res.data.data;
}

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

export const reviewsService = {
  async create(params: CreateReviewParams): Promise<Review> {
    const res = await api.post<{ data: Review }>('/reviews', params);
    return unwrap(res);
  },

  async update(id: string, params: Partial<CreateReviewParams>): Promise<Review> {
    const res = await api.put<{ data: Review }>(`/reviews/${id}`, params);
    return unwrap(res);
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/reviews/${id}`);
  },

  async like(id: string): Promise<{ likesCount: number }> {
    const res = await api.post<{ data: { likesCount: number } }>(`/reviews/${id}/like`);
    return unwrap(res);
  },

  async unlike(id: string): Promise<{ likesCount: number }> {
    const res = await api.delete<{ data: { likesCount: number } }>(`/reviews/${id}/like`);
    return unwrap(res);
  },
};
