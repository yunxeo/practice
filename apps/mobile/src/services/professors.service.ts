import { api } from './api';
import { PaginatedResponse, Professor, ProfessorSummary, Review, AiSummaryResponse } from '../types';

function unwrap<T>(res: { data: { data: T } }): T {
  return res.data.data;
}

interface SearchParams {
  q?: string;
  universityId?: string;
  departmentId?: string;
  sortBy?: 'rating' | 'reviews' | 'name';
  order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export const professorsService = {
  async search(params: SearchParams): Promise<PaginatedResponse<ProfessorSummary>> {
    const res = await api.get<{ data: PaginatedResponse<ProfessorSummary> }>('/professors', { params });
    return unwrap(res);
  },

  async findById(id: string): Promise<Professor> {
    const res = await api.get<{ data: Professor }>(`/professors/${id}`);
    return unwrap(res);
  },

  async getReviews(id: string, params?: { limit?: number; offset?: number }): Promise<PaginatedResponse<Review>> {
    const res = await api.get<{ data: PaginatedResponse<Review> }>(`/professors/${id}/reviews`, { params });
    return unwrap(res);
  },

  async getAiSummary(id: string): Promise<AiSummaryResponse> {
    const res = await api.get<{ data: AiSummaryResponse }>(`/professors/${id}/ai-summary`);
    return unwrap(res);
  },
};
