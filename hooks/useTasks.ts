import { useMemo, useState, useCallback } from "react";
import type { Task, TaskCategory } from "../lib/types";
import { getTasksByCategory, getTaskById } from "../lib/mockTasks";

/**
 * Hook to fetch and filter the task list from mock data.
 * Returns the filtered list, loading state, and a refresh callback.
 */
export function useTasks(category?: TaskCategory) {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const tasks = useMemo<Task[]>(() => {
    // refreshKey dependency forces re-computation on pull-to-refresh
    void refreshKey;
    return getTasksByCategory(category);
  }, [category, refreshKey]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate network delay
    setTimeout(() => {
      setRefreshKey((k) => k + 1);
      setRefreshing(false);
    }, 800);
  }, []);

  return { tasks, refreshing, onRefresh };
}

/**
 * Hook to fetch a single task by ID from mock data.
 */
export function useTaskDetail(id: string) {
  const task = useMemo<Task | undefined>(() => getTaskById(id), [id]);
  return { task };
}
