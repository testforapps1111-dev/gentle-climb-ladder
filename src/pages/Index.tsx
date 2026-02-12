import { useState } from "react";
import IntroCard from "@/components/FearLadder/IntroCard";
import PracticeGoal from "@/components/FearLadder/PracticeGoal";
import ThoughtSection from "@/components/FearLadder/ThoughtSection";
import RewardSection from "@/components/FearLadder/RewardSection";
import LadderBuilder, { LadderStep } from "@/components/FearLadder/LadderBuilder";
import TodaysPractice from "@/components/FearLadder/TodaysPractice";
import ExampleLadderModal from "@/components/FearLadder/ExampleLadderModal";

const createEmptySteps = (count: number): LadderStep[] =>
  Array.from({ length: count }, () => ({
    id: crypto.randomUUID(),
    situation: "",
    anxiety: 50,
  }));

const Index = () => {
  const [showExample, setShowExample] = useState(false);
  const [goal, setGoal] = useState("");
  const [thought, setThought] = useState("");
  const [reward, setReward] = useState("");
  const [steps, setSteps] = useState<LadderStep[]>(createEmptySteps(5));

  // Today's practice state
  const [selectedStep, setSelectedStep] = useState("");
  const [anxietyBefore, setAnxietyBefore] = useState(50);
  const [anxietyAfter, setAnxietyAfter] = useState(50);
  const [notes, setNotes] = useState("");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-semibold tracking-wide text-foreground">
            OCD Mantra
          </span>
          <span className="text-xs text-muted-foreground">Fear Ladder Activity</span>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-10">
        <IntroCard day={1} onShowExample={() => setShowExample(true)} />

        <div className="border-t border-border" />
        <PracticeGoal goal={goal} onGoalChange={setGoal} />

        <div className="border-t border-border" />
        <ThoughtSection thought={thought} onThoughtChange={setThought} />

        <div className="border-t border-border" />
        <RewardSection reward={reward} onRewardChange={setReward} />

        <div className="border-t border-border" />
        <LadderBuilder steps={steps} onStepsChange={setSteps} />

        <div className="border-t border-border" />
        <TodaysPractice
          steps={steps}
          selectedStep={selectedStep}
          onSelectedStepChange={setSelectedStep}
          anxietyBefore={anxietyBefore}
          onAnxietyBeforeChange={setAnxietyBefore}
          anxietyAfter={anxietyAfter}
          onAnxietyAfterChange={setAnxietyAfter}
          notes={notes}
          onNotesChange={setNotes}
        />

        {/* Footer microcopy */}
        <div className="text-center pb-8">
          <p className="text-xs text-muted-foreground/60">
            Built with care for your therapeutic journey.
          </p>
        </div>
      </main>

      <ExampleLadderModal open={showExample} onClose={() => setShowExample(false)} />
    </div>
  );
};

export default Index;
