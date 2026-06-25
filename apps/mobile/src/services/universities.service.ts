import { api } from './api';
import { PaginatedResponse, University, UniversitySummary, Department } from '../types';

function unwrap<T>(res: { data: { data: T } }): T {
  return res.data.data;
}

export const universitiesService = {
  async search(params: { q?: string; limit?: number; offset?: number }) {
    const res = await api.get<{ data: PaginatedResponse<UniversitySummary & { location?: string; professorCount?: number }> }>(
      '/universities',
      { params },
    );
    return unwrap(res);
  },

  async findById(id: string): Promise<University> {
    const res = await api.get<{ data: University }>(`/universities/${id}`);
    return unwrap(res);
  },

  async getDepartments(universityId: string): Promise<Department[]> {
    const res = await api.get<{ data: Department[] }>(`/universities/${universityId}/departments`);
    return unwrap(res);
  },
};
