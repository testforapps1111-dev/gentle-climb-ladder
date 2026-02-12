import { Check, Circle, ArrowRight } from "lucide-react";
import { LadderStep } from "./LadderBuilder";

interface ProgressVisualProps {
  steps: LadderStep[];
  completedStepIds: Set<string>;
  currentStepId: string | null;
}

const ProgressVisual = ({ steps, completedStepIds, currentStepId }: ProgressVisualProps) => {
  if (steps.length === 0) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-serif font-semibold text-foreground">Your Progress</h2>
        <div className="bg-card border border-border rounded-lg p-5 text-center">
          <p className="text-sm text-muted-foreground">
            Complete your fear ladder above to see your progress here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-serif font-semibold text-foreground">Your Progress</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Each step you take is a step toward freedom. You're building courage, not comfort.
      </p>

      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <div className="relative">
          {steps.map((step, idx) => {
            const isCompleted = completedStepIds.has(step.id);
            const isCurrent = step.id === currentStepId;
            const isPending = !isCompleted && !isCurrent;

            return (
              <div key={step.id} className="flex items-start gap-3 relative">
                {/* Connector line */}
                {idx < steps.length - 1 && (
                  <div
                    className={`absolute left-[15px] top-[30px] w-0.5 h-[calc(100%-6px)] ${
                      isCompleted ? "bg-therapy-progress-done" : "bg-therapy-progress-pending"
                    }`}
                  />
                )}

                {/* Step indicator */}
                <div className="flex-shrink-0 mt-0.5 z-10">
                  {isCompleted ? (
                    <div className="w-[30px] h-[30px] rounded-full bg-therapy-progress-done flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-[30px] h-[30px] rounded-full bg-therapy-progress border-2 border-primary flex items-center justify-center animate-pulse">
                      <ArrowRight className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                  ) : (
                    <div className="w-[30px] h-[30px] rounded-full bg-therapy-progress-pending border border-border flex items-center justify-center">
                      <Circle className="w-3 h-3 text-muted-foreground/40" />
                    </div>
                  )}
                </div>

                {/* Step content */}
                <div
                  className={`flex-1 pb-5 ${
                    isCurrent ? "opacity-100" : isCompleted ? "opacity-70" : "opacity-40"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2.5 text-sm ${
                      isCurrent
                        ? "bg-therapy-glow border border-primary/30 text-foreground font-medium"
                        : isCompleted
                        ? "bg-therapy-soft text-foreground/80 line-through"
                        : "text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{step.situation}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {step.anxiety}
                      </span>
                    </div>
                  </div>
                  {isCurrent && (
                    <p className="text-xs text-primary mt-1.5 ml-1 font-medium">
                      ← You are here today
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProgressVisual;
