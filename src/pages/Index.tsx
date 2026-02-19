import { useState, useEffect } from "react";
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
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [userId, setUserId] = useState<string | null>(sessionStorage.getItem("user_id"));

  // ============ HANDSHAKE AUTH PROTOCOL ============
  useEffect(() => {
    const performHandshake = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

      if (token) {
        try {
          // 1. Validate token with MantraCare API
          const response = await fetch("https://api.mantracare.com/user/user-info", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });

          if (response.ok) {
            const userData = await response.json();
            // 2. Store user_id in sessionStorage (Session Isolation)
            // Note: user_id is treated as a BIGINT/string source of truth
            const id = userData.user_id.toString();
            sessionStorage.setItem("user_id", id);
            setUserId(id);

            // 3. Clean URL without refreshing
            const originalUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, originalUrl);

            setIsAuthenticating(false);
          } else {
            throw new Error("Invalid token");
          }
        } catch (error) {
          console.error("Auth Handshake Failed:", error);
          window.location.href = "https://mantracare.com/token"; // External Redirect
        }
      } else {
        // 4. Handle Missing Token
        const existingUser = sessionStorage.getItem("user_id");
        if (existingUser) {
          setUserId(existingUser);
          setIsAuthenticating(false);
        } else {
          // 5. Production Redirect (No token and no session)
          window.location.href = "https://mantracare.com/token";
        }
      }
    };

    performHandshake();
  }, []);

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
  } = useFearLadderStorage(userId);

  if (loading || isAuthenticating) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-sm text-muted-foreground font-medium animate-pulse text-center max-w-xs">
          Your courage journey continues...
        </p>
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
        {phase === "build" && (
          <>
            {/* Intro */}
            <div className="bg-card border border-border rounded-[30px] p-8 md:p-10 shadow-sm space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />

              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-[18px] bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 3v18M18 3v18M6 7h12M6 11h12M6 15h12M6 19h12" />
                  </svg>
                </div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground tracking-tight">
                  Build Your Fear Ladder
                </h1>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                You will start small and gradually move upward. The goal is not to eliminate fear — but to practice staying present with it.
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

        {/* ============ JUST SAVED SUCCESS / REVIEW ============ */}
        {phase !== "build" && justSaved && (
          <div className="space-y-8 py-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-card border border-border rounded-[30px] p-8 md:p-12 text-center shadow-xl space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-2xl">🌱</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-foreground">
                Your Fear Ladder is Ready
              </h2>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                We've organized your fears from lowest to highest. This path is designed for gradual success.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest px-2">The Therapeutic Path</h3>
              <div className="bg-card border border-border rounded-[20px] p-5 shadow-sm space-y-3">
                {sortedSteps.map((step, idx) => (
                  <div key={step.id} className="flex items-center gap-4 p-4 bg-therapy-soft rounded-2xl border border-primary/5">
                    <span className="text-xs font-black text-primary w-6">{idx + 1}.</span>
                    <span className="flex-1 text-sm font-medium text-foreground">{step.situation}</span>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {step.anxiety}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setJustSaved(false)}
              className="w-full py-4 rounded-[20px] text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
            >
              Start Practice (Day 2)
            </button>
          </div>
        )}

        {/* ============ PRACTICE PHASE ============ */}
        {phase === "practice" && !justSaved && currentStep && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-[20px] p-6 md:p-8 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-serif font-semibold text-foreground">
                  Day {completedCount + 2} Practice
                </h1>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-therapy-glow text-primary">
                  Step {completedCount + 1} of {sortedSteps.length}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Today you will face this specific step from your ladder.
              </p>
            </div>

            <PracticeScreen
              completedCount={completedCount}
              currentStep={currentStep}
              alreadyLogged={currentStepAlreadyLogged}
              onSave={addLog}
            />
          </div>
        )}


        {/* ============ COMPLETED PHASE ============ */}
        {phase === "completed" && (
          <CompletionScreen
            logs={data.logs}
            steps={sortedSteps}
            onStartNew={resetLadder}
            onReviewProgress={() => { }}
          />
        )}

        {/* ============ PROGRESS PANEL (always when session exists) ============ */}
        {data.sessionId && sortedSteps.length > 0 && phase !== "completed" && (
          <div className="space-y-6 pt-4">
            <ProgressPanel
              steps={sortedSteps}
              completedStepIds={completedStepIds}
              currentStepId={currentStep?.id ?? null}
            />

          </div>
        )}

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
