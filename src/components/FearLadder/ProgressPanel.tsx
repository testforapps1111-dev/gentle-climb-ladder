import { Check, Circle, ArrowRight } from "lucide-react";
import { LadderStep } from "./LadderBuilder";

interface ProgressPanelProps {
  steps: LadderStep[];
  completedStepIds: Set<string>;
  currentStepId: string | null;
}

const ProgressPanel = ({ steps, completedStepIds, currentStepId }: ProgressPanelProps) => {
  if (steps.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-serif font-semibold text-foreground">Your Progress</h2>

      <div className="bg-card border border-border rounded-[20px] p-5 shadow-sm">
        <div className="relative">
          {steps.map((step, idx) => {
            const isCompleted = completedStepIds.has(step.id);
            const isCurrent = step.id === currentStepId;
            const isLocked = !isCompleted && !isCurrent;

            return (
              <div key={step.id} className="flex items-start gap-3 relative">
                {/* Connector line */}
                {idx < steps.length - 1 && (
                  <div
                    className={`absolute left-[15px] top-[30px] w-0.5 h-[calc(100%-6px)] ${
                      isCompleted ? "bg-primary" : "bg-therapy-progress-pending"
                    }`}
                  />
                )}

                {/* Step indicator */}
                <div className="flex-shrink-0 mt-0.5 z-10">
                  {isCompleted ? (
                    <div className="w-[30px] h-[30px] rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-[30px] h-[30px] rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                      <ArrowRight className="w-3.5 h-3.5 text-primary" />
                    </div>
                  ) : (
                    <div className="w-[30px] h-[30px] rounded-full bg-therapy-progress-pending border border-border flex items-center justify-center">
                      <Circle className="w-3 h-3 text-muted-foreground/30" />
                    </div>
                  )}
                </div>

                {/* Step content */}
                <div
                  className={`flex-1 pb-4 ${
                    isCurrent ? "opacity-100" : isCompleted ? "opacity-80" : "opacity-40"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2.5 text-sm ${
                      isCurrent
                        ? "bg-therapy-glow border border-primary/30 text-foreground font-medium"
                        : isCompleted
                        ? "bg-therapy-soft text-foreground/80"
                        : "text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{step.situation}</span>
                      <span className="text-xs text-muted-foreground ml-2">{step.anxiety}</span>
                    </div>
                  </div>
                  {isCurrent && (
                    <p className="text-xs text-primary mt-1 ml-1 font-medium">
                      ← Current step
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

export default ProgressPanel;
