import { useState, useEffect, useCallback, useRef } from "react";
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
  steps: createEmptySteps(10),
  logs: [],
});

async function loadFromSupabase(): Promise<FearLadderData> {
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

  if (!session) return getDefaultData();

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
    steps: steps.length > 0 ? steps : createEmptySteps(10),
    logs,
  };
}

export type AppPhase = "build" | "practice" | "completed";

export const useFearLadderStorage = () => {
  const [data, setData] = useState<FearLadderData>(getDefaultData);
  const [loading, setLoading] = useState(true);
  const [justSaved, setJustSaved] = useState(false);
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    loadFromSupabase()
      .then((loaded) => setData(loaded))
      .catch((err) => console.error("Failed to load fear ladder data:", err))
      .finally(() => setLoading(false));
  }, []);

  const completedCount = data.logs.length;

  // Sorted steps by anxiety (low to high)
  const sortedSteps = data.steps
    .filter((s) => s.situation.trim().length > 0)
    .sort((a, b) => a.anxiety - b.anxiety);

  // Determine phase — if session exists but has no steps, stay in build
  const phase: AppPhase = !data.sessionId || (sortedSteps.length === 0 && completedCount === 0)
    ? "build"
    : completedCount >= sortedSteps.length && sortedSteps.length > 0
    ? "completed"
    : "practice";

  // Current step is based on completedCount
  const currentStep = completedCount < sortedSteps.length ? sortedSteps[completedCount] : null;

  // Completed step IDs from logs
  const completedStepIds = new Set(data.logs.map((l) => l.stepId));

  // Check if current step already has a log (prevent duplicates)
  const currentStepAlreadyLogged = currentStep
    ? data.logs.some((l) => l.stepId === currentStep.id)
    : false;

  // Update local field
  const updateField = useCallback(<K extends keyof FearLadderData>(
    key: K,
    value: FearLadderData[K]
  ) => {
    setData((prev) => {
      const next = { ...prev, [key]: value };

      if (prev.sessionId && (key === "goal" || key === "thought" || key === "reward")) {
        const dbField = key === "goal" ? "practice_goal" : key === "thought" ? "expected_fear" : "reward_plan";
        if (debounceTimers.current[key]) clearTimeout(debounceTimers.current[key]);
        debounceTimers.current[key] = setTimeout(() => {
          supabase
            .from("fear_ladder_sessions")
            .update({ [dbField]: value as string })
            .eq("id", prev.sessionId!)
            .then(({ error }) => {
              if (error) console.error(`Failed to update ${key}:`, error);
            });
        }, 500);
      }

      return next;
    });
  }, []);

  // Update steps (only in build phase)
  const updateSteps = useCallback((newSteps: LadderStep[]) => {
    setData((prev) => ({ ...prev, steps: newSteps }));
  }, []);

  // Save session + steps to Supabase
  const saveSession = useCallback(async () => {
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
    const filledSteps = data.steps.filter((s) => s.situation.trim().length > 0);

    if (filledSteps.length > 0) {
      const { data: insertedSteps, error: stepsError } = await supabase
        .from("fear_ladder_steps")
        .insert(
          filledSteps.map((step, index) => ({
            session_id: sessionId,
            user_id: USER_ID,
            step_order: index,
            step_description: step.situation,
            anxiety_rating: step.anxiety,
          }))
        )
        .select("id, step_order, step_description, anxiety_rating");

      if (stepsError) {
        console.error("Failed to save steps:", stepsError);
        return { success: false as const };
      }

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

    setJustSaved(true);
    return { success: true as const };
  }, [data.goal, data.thought, data.reward, data.steps]);

  // Add practice log
  const addLog = useCallback(async (log: DayLog) => {
    if (!data.sessionId) {
      console.error("Cannot log practice: no active session");
      return { success: false as const };
    }

    // Prevent duplicate for same step
    if (data.logs.some((l) => l.stepId === log.stepId)) {
      console.warn("Log already exists for this step");
      return { success: false as const };
    }

    const { error } = await supabase.from("fear_ladder_logs").insert({
      session_id: data.sessionId,
      step_id: log.stepId || null,
      user_id: USER_ID,
      day_number: log.day,
      anxiety_before: log.anxietyBefore,
      anxiety_after: log.anxietyAfter,
      notes: log.notes || null,
    });

    if (error) {
      console.error("Failed to save log:", error);
      return { success: false as const };
    }

    setData((prev) => ({
      ...prev,
      logs: [...prev.logs, log],
    }));

    return { success: true as const };
  }, [data.sessionId, data.logs]);

  // Reset for new ladder
  const resetLadder = useCallback(() => {
    setData(getDefaultData());
    setJustSaved(false);
  }, []);

  return {
    data,
    phase,
    completedCount,
    sortedSteps,
    currentStep,
    completedStepIds,
    currentStepAlreadyLogged,
    updateField,
    updateSteps,
    saveSession,
    addLog,
    resetLadder,
    justSaved,
    setJustSaved,
    loading,
  };
};
