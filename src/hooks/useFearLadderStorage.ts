import { useState, useEffect, useCallback } from "react";
import { LadderStep } from "@/components/FearLadder/LadderBuilder";
import { supabase } from "@/integrations/supabase/client";

const USER_ID = "test-user";

export interface DayLog {
  day: number;
  stepId: string;
  anxietyBefore: number;
  anxietyAfter: number;
  notes: string;
  completedAt: string;
}

export interface FearLadderData {
  sessionId: string | null;
  goal: string;
  thought: string;
  reward: string;
  steps: LadderStep[];
  startDate: string;
  logs: DayLog[];
}

const createEmptySteps = (count: number): LadderStep[] =>
  Array.from({ length: count }, () => ({
    id: crypto.randomUUID(),
    situation: "",
    anxiety: 50,
  }));

const getDefaultData = (): FearLadderData => ({
  sessionId: null,
  goal: "",
  thought: "",
  reward: "",
  steps: createEmptySteps(5),
  startDate: new Date().toISOString().split("T")[0],
  logs: [],
});

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
  const filledSteps = steps
    .filter((s) => s.situation.trim().length > 0)
    .sort((a, b) => a.anxiety - b.anxiety);

  if (filledSteps.length === 0) return null;

  const practiceIndex = day - 2;
  const stepIndex = practiceIndex % filledSteps.length;
  return filledSteps[stepIndex];
};

async function loadFromSupabase(): Promise<FearLadderData> {
  // Fetch latest session
  const { data: session, error: sessionError } = await supabase
    .from("fear_ladder_sessions")
    .select("*")
    .eq("user_id", USER_ID)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (sessionError) {
    console.error("Failed to load session:", sessionError);
    return getDefaultData();
  }

  if (!session) {
    return getDefaultData();
  }

  // Fetch steps and logs in parallel
  const [stepsResult, logsResult] = await Promise.all([
    supabase
      .from("fear_ladder_steps")
      .select("*")
      .eq("session_id", session.id)
      .order("step_order", { ascending: true }),
    supabase
      .from("fear_ladder_logs")
      .select("*")
      .eq("session_id", session.id)
      .order("day_number", { ascending: true }),
  ]);

  if (stepsResult.error) console.error("Failed to load steps:", stepsResult.error);
  if (logsResult.error) console.error("Failed to load logs:", logsResult.error);

  const steps: LadderStep[] = (stepsResult.data ?? []).map((s) => ({
    id: s.id,
    situation: s.step_description,
    anxiety: s.anxiety_rating,
  }));

  const logs: DayLog[] = (logsResult.data ?? []).map((l) => ({
    day: l.day_number,
    stepId: l.step_id ?? "",
    anxietyBefore: l.anxiety_before ?? 50,
    anxietyAfter: l.anxiety_after ?? 50,
    notes: l.notes ?? "",
    completedAt: l.created_at ?? new Date().toISOString(),
  }));

  return {
    sessionId: session.id,
    goal: session.practice_goal ?? "",
    thought: session.expected_fear ?? "",
    reward: session.reward_plan ?? "",
    steps: steps.length > 0 ? steps : createEmptySteps(5),
    startDate: session.start_date ?? new Date().toISOString().split("T")[0],
    logs,
  };
}

export const useFearLadderStorage = () => {
  const [data, setData] = useState<FearLadderData>(getDefaultData);
  const [loading, setLoading] = useState(true);

  // Load from Supabase on mount
  useEffect(() => {
    loadFromSupabase()
      .then((loaded) => setData(loaded))
      .catch((err) => console.error("Failed to load fear ladder data:", err))
      .finally(() => setLoading(false));
  }, []);

  const currentDay = getCurrentDay(data.startDate);

  const updateField = useCallback(<K extends keyof FearLadderData>(
    key: K,
    value: FearLadderData[K]
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const saveSession = useCallback(async () => {
    // Insert session
    const { data: session, error: sessionError } = await supabase
      .from("fear_ladder_sessions")
      .insert({
        user_id: USER_ID,
        practice_goal: data.goal || null,
        expected_fear: data.thought || null,
        reward_plan: data.reward || null,
      })
      .select("id")
      .single();

    if (sessionError || !session) {
      console.error("Failed to save session:", sessionError);
      return { success: false as const };
    }

    const sessionId = session.id;

    // Insert steps
    const filledSteps = data.steps.filter((s) => s.situation.trim().length > 0);
    if (filledSteps.length > 0) {
      const stepsToInsert = filledSteps.map((step, index) => ({
        session_id: sessionId,
        user_id: USER_ID,
        step_order: index,
        step_description: step.situation,
        anxiety_rating: step.anxiety,
      }));

      const { data: insertedSteps, error: stepsError } = await supabase
        .from("fear_ladder_steps")
        .insert(stepsToInsert)
        .select("id, step_order, step_description, anxiety_rating");

      if (stepsError) {
        console.error("Failed to save steps:", stepsError);
        return { success: false as const };
      }

      // Update local state with DB-generated IDs
      if (insertedSteps) {
        const newSteps: LadderStep[] = insertedSteps.map((s) => ({
          id: s.id,
          situation: s.step_description,
          anxiety: s.anxiety_rating,
        }));
        setData((prev) => ({ ...prev, sessionId, steps: newSteps }));
      }
    } else {
      setData((prev) => ({ ...prev, sessionId }));
    }

    return { success: true as const };
  }, [data.goal, data.thought, data.reward, data.steps]);

  const addLog = useCallback(async (log: DayLog) => {
    setData((prev) => {
      const sessionId = prev.sessionId;
      if (!sessionId) {
        console.error("Cannot log practice: no active session");
        return prev;
      }

      // Fire and forget the insert
      supabase
        .from("fear_ladder_logs")
        .insert({
          session_id: sessionId,
          step_id: log.stepId || null,
          user_id: USER_ID,
          day_number: log.day,
          anxiety_before: log.anxietyBefore,
          anxiety_after: log.anxietyAfter,
          notes: log.notes || null,
        })
        .then(({ error }) => {
          if (error) console.error("Failed to save log:", error);
        });

      return {
        ...prev,
        logs: [...prev.logs, log],
      };
    });
  }, []);

  const todayLog = data.logs.find((l) => l.day === currentDay);
  const todayStep = getStepForDay(data.steps, data.logs, currentDay);

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
    saveSession,
    todayLog,
    todayStep,
    sortedFilledSteps,
    completedStepIds,
    currentStepIndex,
    loading,
  };
};
