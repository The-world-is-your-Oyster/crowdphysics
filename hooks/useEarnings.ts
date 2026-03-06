import { useState, useEffect, useCallback, useMemo } from "react";
import api from "../lib/api";
import type { TaskCategory } from "../lib/types";
import { CATEGORY_EMOJI } from "../lib/mockTasks";

// ── Types ────────────────────────────────────────────────────────────

export interface EarningsBalance {
  balance: number;
  pending: number;
  total_earned: number;
}

export interface EarningEvent {
  id: string;
  task_title: string;
  amount: number;
  status: "approved" | "pending" | "rejected";
  rejection_reason?: string;
  category: TaskCategory;
  created_at: string;
}

export type TimeFilter = "week" | "month" | "all";

// ── Mock Data ────────────────────────────────────────────────────────

const MOCK_BALANCE: EarningsBalance = {
  balance: 23.5,
  pending: 5.25,
  total_earned: 148.75,
};

const MOCK_HISTORY: EarningEvent[] = [
  {
    id: "e1",
    task_title: "Pour Water",
    amount: 0.5,
    status: "approved",
    category: "kitchen",
    created_at: "2026-03-06T14:30:00Z",
  },
  {
    id: "e2",
    task_title: "Fold T-Shirt",
    amount: 0.75,
    status: "pending",
    category: "cleaning",
    created_at: "2026-03-06T12:15:00Z",
  },
  {
    id: "e3",
    task_title: "Organize Drawer",
    amount: 1.25,
    status: "approved",
    category: "organization",
    created_at: "2026-03-05T18:45:00Z",
  },
  {
    id: "e4",
    task_title: "Cut Paper with Scissors",
    amount: 0.5,
    status: "rejected",
    rejection_reason: "Video too dark, hands not clearly visible",
    category: "office",
    created_at: "2026-03-05T10:20:00Z",
  },
  {
    id: "e5",
    task_title: "Tie Shoelaces",
    amount: 0.75,
    status: "approved",
    category: "personal_care",
    created_at: "2026-03-04T16:00:00Z",
  },
  {
    id: "e6",
    task_title: "Screw a Bolt",
    amount: 1.0,
    status: "pending",
    category: "assembly",
    created_at: "2026-03-04T11:30:00Z",
  },
  {
    id: "e7",
    task_title: "Wash a Dish",
    amount: 0.75,
    status: "approved",
    category: "kitchen",
    created_at: "2026-03-03T15:00:00Z",
  },
  {
    id: "e8",
    task_title: "Make Bed",
    amount: 1.25,
    status: "rejected",
    rejection_reason: "Camera angle too far, details not visible",
    category: "cleaning",
    created_at: "2026-03-03T09:00:00Z",
  },
  {
    id: "e9",
    task_title: "Plug USB Cable",
    amount: 0.5,
    status: "approved",
    category: "assembly",
    created_at: "2026-03-02T17:45:00Z",
  },
  {
    id: "e10",
    task_title: "Arrange Books",
    amount: 0.75,
    status: "pending",
    category: "organization",
    created_at: "2026-03-02T08:30:00Z",
  },
];

// ── Hook ─────────────────────────────────────────────────────────────

export function useEarnings() {
  const [balance, setBalance] = useState<EarningsBalance>(MOCK_BALANCE);
  const [history, setHistory] = useState<EarningEvent[]>(MOCK_HISTORY);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");

  const fetchBalance = useCallback(async () => {
    try {
      const response = await api.get<{
        balance: string;
        pending: string;
        total_earned: string;
      }>("/earnings/balance");
      setBalance({
        balance: parseFloat(response.data.balance),
        pending: parseFloat(response.data.pending),
        total_earned: parseFloat(response.data.total_earned),
      });
    } catch {
      // API unreachable, keep mock data
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const response = await api.get<{
        events: Array<{
          submission_id: string;
          task_title: string;
          payout_amount: string;
          processed_at: string;
        }>;
        total: number;
      }>("/earnings/history", { params: { limit: 50 } });

      const mapped: EarningEvent[] = response.data.events.map((e) => ({
        id: e.submission_id,
        task_title: e.task_title,
        amount: parseFloat(e.payout_amount),
        status: "approved" as const,
        category: "kitchen" as TaskCategory,
        created_at: e.processed_at,
      }));
      if (mapped.length > 0) {
        setHistory(mapped);
      }
    } catch {
      // API unreachable, keep mock data
    }
  }, []);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([fetchBalance(), fetchHistory()]);
    setIsLoading(false);
  }, [fetchBalance, fetchHistory]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const filteredHistory = useMemo(() => {
    if (timeFilter === "all") return history;

    const now = new Date();
    let cutoff: Date;

    if (timeFilter === "week") {
      cutoff = new Date(now);
      cutoff.setDate(cutoff.getDate() - 7);
    } else {
      cutoff = new Date(now);
      cutoff.setMonth(cutoff.getMonth() - 1);
    }

    return history.filter((e) => new Date(e.created_at) >= cutoff);
  }, [history, timeFilter]);

  return {
    balance,
    history: filteredHistory,
    allHistory: history,
    isLoading,
    timeFilter,
    setTimeFilter,
    refresh: loadAll,
  };
}

/** Get emoji for a category, with fallback. */
export function getCategoryEmoji(category: TaskCategory): string {
  return CATEGORY_EMOJI[category] || "\uD83D\uDCCB";
}
