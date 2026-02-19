import { useState } from "react";
import { toast } from "sonner";
import PracticeGoal from "@/components/FearLadder/PracticeGoal";
import ThoughtSection from "@/components/FearLadder/ThoughtSection";
import RewardSection from "@/components/FearLadder/RewardSection";
import LadderBuilder from "@/components/FearLadder/LadderBuilder";
import ExampleLadderModal from "@/components/FearLadder/ExampleLadderModal";
import PracticeScreen from "@/components/FearLadder/PracticeScreen";
import CompletionScreen from "@/components/FearLadder/CompletionScreen";
import ProgressPanel from "@/components/FearLadder/ProgressPanel";
import { useFearLadderStorage } from "@/hooks/useFearLadderStorage";

const Index = () => {
  const [showExample, setShowExample] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const {
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
  } = useFearLadderStorage();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading your fear ladder…</p>
      </div>
    );
  }

  const canSave =
    data.goal.trim() !== "" &&
    data.thought.trim() !== "" &&
    data.reward.trim() !== "" &&
    data.steps.some((s) => s.situation.trim() !== "");

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-semibold tracking-wide text-foreground">
            🌿 OCD Mantra
          </span>
          <span className="text-xs text-muted-foreground">Fear Ladder Activity</span>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* ============ BUILD PHASE ============ */}
        {phase === "build" && !justSaved && (
          <>
            {/* Intro */}
            <div className="bg-card border border-border rounded-[20px] p-6 md:p-8 shadow-sm space-y-3">
              <h1 className="text-2xl md:text-3xl font-serif font-semibold text-foreground">
                Build Your Fear Ladder
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You will start small and gradually move upward. The goal is not to remove fear — but to practice staying present with it.
              </p>
            </div>

            <PracticeGoal goal={data.goal} onGoalChange={(v) => updateField("goal", v)} />
            <ThoughtSection thought={data.thought} onThoughtChange={(v) => updateField("thought", v)} />
            <RewardSection reward={data.reward} onRewardChange={(v) => updateField("reward", v)} />

            <LadderBuilder
              steps={data.steps}
              onStepsChange={updateSteps}
              onShowExample={() => setShowExample(true)}
            />

            {/* Save Button */}
            <button
              type="button"
              disabled={!canSave}
              onClick={async () => {
                const result = await saveSession();
                if (result.success) {
                  toast.success("Your fear ladder is saved!");
                } else {
                  toast.error("Failed to save. Please try again.");
                }
              }}
              className="w-full py-3 rounded-[20px] text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save My Fear Ladder
            </button>
          </>
        )}

        {/* ============ JUST SAVED SUCCESS ============ */}
        {phase === "practice" && justSaved && (
          <div className="flex items-center justify-center py-12">
            <div className="bg-card border border-border rounded-[20px] p-8 text-center max-w-md w-full shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-2xl">🌿</span>
              </div>
              <h2 className="text-xl font-serif font-semibold text-foreground">
                Day 1 completed — Your ladder is ready.
              </h2>
              <p className="text-sm text-muted-foreground">
                Practice begins next.
              </p>
              <button
                onClick={() => setJustSaved(false)}
                className="mt-4 px-6 py-2.5 rounded-[20px] text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Start Step 1
              </button>
            </div>
          </div>
        )}

        {/* ============ PRACTICE PHASE ============ */}
        {phase === "practice" && !justSaved && currentStep && (
          <PracticeScreen
            completedCount={completedCount}
            currentStep={currentStep}
            alreadyLogged={currentStepAlreadyLogged}
            onSave={addLog}
          />
        )}

        {/* ============ COMPLETED PHASE ============ */}
        {phase === "completed" && !showReview && (
          <CompletionScreen
            logs={data.logs}
            onStartNew={resetLadder}
            onReviewProgress={() => setShowReview(true)}
          />
        )}

        {/* ============ PROGRESS PANEL (always when session exists) ============ */}
        {data.sessionId && sortedSteps.length > 0 && (phase !== "completed" || showReview) && (
          <ProgressPanel
            steps={sortedSteps}
            completedStepIds={completedStepIds}
            currentStepId={currentStep?.id ?? null}
          />
        )}

        {/* Show progress panel in review mode */}
        {phase === "completed" && showReview && (
          <div className="text-center pt-4">
            <button
              onClick={() => setShowReview(false)}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              ← Back to completion
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pb-8">
          <p className="text-xs text-muted-foreground/60">
            Built with care for your therapeutic journey. 🌱
          </p>
        </div>
      </main>

      <ExampleLadderModal open={showExample} onClose={() => setShowExample(false)} />
    </div>
  );
};

export default Index;
