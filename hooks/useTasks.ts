import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import type { Task, PaginatedResponse } from "../lib/types";

export function useTasks(category?: string) {
  return useQuery<PaginatedResponse<Task>>({
    queryKey: ["tasks", category],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (category) params.category = category;
      const response = await api.get<PaginatedResponse<Task>>("/tasks", { params });
      return response.data;
    },
  });
}

export function useTask(id: string) {
  return useQuery<Task>({
    queryKey: ["task", id],
    queryFn: async () => {
      const response = await api.get<Task>(`/tasks/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}
