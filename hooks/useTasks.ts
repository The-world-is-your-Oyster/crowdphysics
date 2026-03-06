import { useEffect, useState, useCallback } from "react";
import type { Task, TaskCategory } from "../lib/types";
import api from "../lib/api";
import { getTasksByCategory, getTaskById } from "../lib/mockTasks";

/**
 * Hook to fetch and filter tasks — tries API first, falls back to mock data.
 */
export function useTasks(category?: TaskCategory) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      const params: Record<string, string> = {};
      if (category) params.category = category;
      const response = await api.get<{ tasks: Task[]; total: number }>(
        "/tasks/",
        { params }
      );
      setTasks(response.data.tasks);
    } catch {
      // Fallback to mock data when API is unavailable
      setTasks(getTasksByCategory(category));
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  }, [fetchTasks]);

  return { tasks, refreshing, onRefresh, loading };
}

/**
 * Hook to fetch a single task by ID — tries API first, falls back to mock.
 */
export function useTaskDetail(id: string) {
  const [task, setTask] = useState<Task | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await api.get<Task>(`/tasks/${id}`);
        setTask(response.data);
      } catch {
        setTask(getTaskById(id));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return { task, loading };
}
