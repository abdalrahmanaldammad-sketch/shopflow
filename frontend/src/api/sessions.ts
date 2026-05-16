import api from './client';
import type { ApiResponse, Session } from '@/types';

export const sessionsApi = {
  list: () => api.get<ApiResponse<Session[]>>('/sessions'),

  revoke: (id: string) => api.delete<ApiResponse<null>>(`/sessions/${id}`),

  revokeAll: () => api.delete<ApiResponse<null>>('/sessions'),
};
