import { useState } from "react";
import { toast } from "sonner";
import IntroCard from "@/components/FearLadder/IntroCard";
import PracticeGoal from "@/components/FearLadder/PracticeGoal";
import { Button } from "@/components/ui/button";
import ThoughtSection from "@/components/FearLadder/ThoughtSection";
import RewardSection from "@/components/FearLadder/RewardSection";
import LadderBuilder from "@/components/FearLadder/LadderBuilder";
import TodaysPractice from "@/components/FearLadder/TodaysPractice";
import ExampleLadderModal from "@/components/FearLadder/ExampleLadderModal";
import ProgressVisual from "@/components/FearLadder/ProgressVisual";
import { useFearLadderStorage } from "@/hooks/useFearLadderStorage";

const Index = () => {
  const [showExample, setShowExample] = useState(false);
  const {
    data,
    currentDay,
    updateField,
    updateSteps,
    addLog,
    saveSession,
    todayLog,
    todayStep,
    sortedFilledSteps,
    completedStepIds,
    loading,
  } = useFearLadderStorage();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading your fear ladder…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-10">
        <IntroCard day={currentDay} />

        <div className="border-t border-border" />
        <PracticeGoal goal={data.goal} onGoalChange={(v) => updateField("goal", v)} />

        <div className="border-t border-border" />
        <ThoughtSection thought={data.thought} onThoughtChange={(v) => updateField("thought", v)} />

        <div className="border-t border-border" />
        <RewardSection reward={data.reward} onRewardChange={(v) => updateField("reward", v)} />

        <div className="border-t border-border" />
        <LadderBuilder
          steps={data.steps}
          onStepsChange={updateSteps}
          onShowExample={() => setShowExample(true)}
        />

        {/* Save & Begin Practice Button */}
        {!data.sessionId && (
          <div className="flex justify-center pt-2">
            <Button
              size="lg"
              className="w-full max-w-md"
              disabled={!data.goal.trim() || !data.thought.trim() || !data.reward.trim() || !data.steps.some(s => s.situation.trim())}
              onClick={async () => {
                const result = await saveSession();
                if (result.success) {
                  toast.success("Day 1 setup saved! Practice begins tomorrow.");
                } else {
                  toast.error("Failed to save. Please try again.");
                }
              }}
            >
              Save &amp; Begin Practice
            </Button>
          </div>
        )}

        <div className="border-t border-border" />
        <ProgressVisual
          steps={sortedFilledSteps}
          completedStepIds={completedStepIds}
          currentStepId={todayStep?.id ?? null}
        />

        {currentDay >= 2 && (
          <>
            <div className="border-t border-border" />
            <TodaysPractice
              currentDay={currentDay}
              todayStep={todayStep}
              todayLog={todayLog}
              onLogSave={addLog}
            />
          </>
        )}

        {/* Footer microcopy */}
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
