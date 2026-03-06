import { create } from "zustand";
import type { User, Task, Submission } from "./types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

interface TaskState {
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  selectedTask: null,
  setSelectedTask: (selectedTask) => set({ selectedTask }),
}));

interface RecordingState {
  isRecording: boolean;
  currentTaskId: string | null;
  elapsedSeconds: number;
  videoUri: string | null;
  setRecording: (recording: boolean) => void;
  setCurrentTaskId: (id: string | null) => void;
  setElapsedSeconds: (seconds: number) => void;
  setVideoUri: (uri: string | null) => void;
  reset: () => void;
}

export const useRecordingStore = create<RecordingState>((set) => ({
  isRecording: false,
  currentTaskId: null,
  elapsedSeconds: 0,
  videoUri: null,
  setRecording: (isRecording) => set({ isRecording }),
  setCurrentTaskId: (currentTaskId) => set({ currentTaskId }),
  setElapsedSeconds: (elapsedSeconds) => set({ elapsedSeconds }),
  setVideoUri: (videoUri) => set({ videoUri }),
  reset: () =>
    set({
      isRecording: false,
      currentTaskId: null,
      elapsedSeconds: 0,
      videoUri: null,
    }),
}));

interface SubmissionState {
  submissions: Submission[];
  addSubmission: (submission: Submission) => void;
  updateSubmission: (id: string, updates: Partial<Submission>) => void;
}

export const useSubmissionStore = create<SubmissionState>((set) => ({
  submissions: [],
  addSubmission: (submission) =>
    set((state) => ({ submissions: [submission, ...state.submissions] })),
  updateSubmission: (id, updates) =>
    set((state) => ({
      submissions: state.submissions.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),
}));
