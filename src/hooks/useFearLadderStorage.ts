import { useState, useEffect, useCallback } from "react";
import { LadderStep } from "@/components/FearLadder/LadderBuilder";

const STORAGE_KEY = "ocd-mantra-fear-ladder";

export interface DayLog {
  day: number;
  stepId: string;
  anxietyBefore: number;
  anxietyAfter: number;
  notes: string;
  completedAt: string;
}

export interface FearLadderData {
  goal: string;
  thought: string;
  reward: string;
  steps: LadderStep[];
  startDate: string; // ISO date string of day 1
  logs: DayLog[];
}

const createEmptySteps = (count: number): LadderStep[] =>
  Array.from({ length: count }, () => ({
    id: crypto.randomUUID(),
    situation: "",
    anxiety: 50,
  }));

const getDefaultData = (): FearLadderData => ({
  goal: "",
  thought: "",
  reward: "",
  steps: createEmptySteps(5),
  startDate: new Date().toISOString().split("T")[0],
  logs: [],
});

const loadData = (): FearLadderData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as FearLadderData;
      return parsed;
    }
  } catch {
    // ignore
  }
  return getDefaultData();
};

const saveData = (data: FearLadderData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getCurrentDay = (startDate: string): number => {
  const start = new Date(startDate + "T00:00:00");
  const now = new Date();
  const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff + 1);
};

export const getStepForDay = (
  steps: LadderStep[],
  logs: DayLog[],
  day: number
): LadderStep | null => {
  if (day <= 1) return null;
  // Sort steps by anxiety (lowest first)
  const filledSteps = steps
    .filter((s) => s.situation.trim().length > 0)
    .sort((a, b) => a.anxiety - b.anxiety);

  if (filledSteps.length === 0) return null;

  // Practice day index (day 2 = index 0, day 3 = index 1, etc.)
  const practiceIndex = day - 2;
  // Cycle through steps if more days than steps
  const stepIndex = practiceIndex % filledSteps.length;
  return filledSteps[stepIndex];
};

export const useFearLadderStorage = () => {
  const [data, setData] = useState<FearLadderData>(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const currentDay = getCurrentDay(data.startDate);

  const updateField = useCallback(<K extends keyof FearLadderData>(
    key: K,
    value: FearLadderData[K]
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const addLog = useCallback((log: DayLog) => {
    setData((prev) => ({
      ...prev,
      logs: [...prev.logs.filter((l) => l.day !== log.day), log],
    }));
  }, []);

  const todayLog = data.logs.find((l) => l.day === currentDay);
  const todayStep = getStepForDay(data.steps, data.logs, currentDay);

  // Get current progress step index (for visual)
  const sortedFilledSteps = data.steps
    .filter((s) => s.situation.trim().length > 0)
    .sort((a, b) => a.anxiety - b.anxiety);

  const completedStepIds = new Set(data.logs.map((l) => l.stepId));
  const currentStepIndex = todayStep
    ? sortedFilledSteps.findIndex((s) => s.id === todayStep.id)
    : -1;

  return {
    data,
    currentDay,
    updateField,
    addLog,
    todayLog,
    todayStep,
    sortedFilledSteps,
    completedStepIds,
    currentStepIndex,
  };
};
