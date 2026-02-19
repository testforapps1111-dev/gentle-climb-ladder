import { DayLog } from "@/hooks/useFearLadderStorage";
import { useEffect, useState } from "react";

interface CompletionScreenProps {
  logs: DayLog[];
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

const CompletionScreen = ({ logs, onStartNew, onReviewProgress }: CompletionScreenProps) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const avgBefore = logs.length > 0
    ? Math.round(logs.reduce((sum, l) => sum + l.anxietyBefore, 0) / logs.length)
    : 0;
  const avgAfter = logs.length > 0
    ? Math.round(logs.reduce((sum, l) => sum + l.anxietyAfter, 0) / logs.length)
    : 0;

  return (
    <div className="flex items-center justify-center min-h-[70vh] relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <ConfettiParticle key={i} delay={i * 0.15} left={5 + Math.random() * 90} />
          ))}
        </div>
      )}

      <div className="bg-card border border-border rounded-[20px] p-8 md:p-12 text-center max-w-lg w-full shadow-sm space-y-6 relative z-10">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <span className="text-4xl">🎉</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-serif font-semibold text-foreground">
            Congratulations — You Completed Your Fear Ladder
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            You practiced courage 10 times. You showed up despite discomfort. That is real progress.
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 py-4">
          <div className="space-y-1">
            <p className="text-2xl font-serif font-semibold text-primary">10</p>
            <p className="text-xs text-muted-foreground">Steps Completed</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-serif font-semibold text-foreground">{avgBefore}</p>
            <p className="text-xs text-muted-foreground">Avg. Anxiety Before</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-serif font-semibold text-foreground">{avgAfter}</p>
            <p className="text-xs text-muted-foreground">Avg. Anxiety After</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={onStartNew}
            className="w-full py-3 rounded-[20px] text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Start a New Ladder
          </button>
          <button
            onClick={onReviewProgress}
            className="w-full py-3 rounded-[20px] text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            Review My Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionScreen;
