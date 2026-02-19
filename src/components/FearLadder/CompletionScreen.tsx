import { DayLog } from "@/hooks/useFearLadderStorage";
import { LadderStep } from "./LadderBuilder";
import { useEffect, useState } from "react";

interface CompletionScreenProps {
  logs: DayLog[];
  steps: LadderStep[];
  onStartNew: () => void;
  onReviewProgress: () => void;
}

// Simple confetti particle
const ConfettiParticle = ({ delay, left }: { delay: number; left: number }) => (
  <div
    className="absolute w-2 h-2 rounded-full opacity-0 animate-confetti"
    style={{
      left: `${left}%`,
      animationDelay: `${delay}s`,
      backgroundColor: `hsl(${160 + Math.random() * 40}, ${40 + Math.random() * 20}%, ${40 + Math.random() * 30}%)`,
    }}
  />
);

const CompletionScreen = ({ logs, steps, onStartNew, onReviewProgress }: CompletionScreenProps) => {
  const [showConfetti, setShowConfetti] = useState(true);

  // Map step data for easy lookup
  const stepMap = new Map(steps.map(s => [s.id, s]));

  // Derive steps from logs for the summary ladder (ordered by day)
  const completedSteps = [...logs].sort((a, b) => a.day - b.day);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] relative overflow-hidden py-10">
      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <ConfettiParticle key={i} delay={i * 0.1} left={Math.random() * 100} />
          ))}
        </div>
      )}

      <div className="bg-card border border-border rounded-[30px] p-8 md:p-12 text-center max-w-xl w-full shadow-xl space-y-8 relative z-10 mx-4">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
          <span className="text-4xl">👑</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-serif font-bold text-foreground">
            10 Practices Complete
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            You showed up and faced your fears for 10 straight steps. This is the foundation of courage.
          </p>
        </div>

        {/* Centerpiece */}
        <div className="bg-therapy-glow rounded-2xl p-6 border border-primary/10">
          <p className="text-sm font-medium text-primary">
            You faced all {logs.length} fears on your ladder.
            <br />
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Total Mastery</span>
          </p>
        </div>

        {/* Final Ladder View */}
        <div className="space-y-4 text-left">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-2">Your Therapeutic Journey</h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar p-1">
            {completedSteps.map((log, idx) => {
              const step = stepMap.get(log.stepId);
              return (
                <div key={log.stepId} className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl border border-border/60 hover:border-primary/20 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-black text-[10px]">{idx + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-foreground leading-tight">
                      {step?.situation || log.notes || `Practice ${idx + 1}`}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-medium text-muted-foreground">Anxiety: {log.anxietyBefore} → {log.anxietyAfter}</span>
                      <span className="text-[10px] text-primary/40 font-black">✓</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={onStartNew}
            className="w-full py-4 rounded-[20px] text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
          >
            Start a New Journey
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionScreen;
