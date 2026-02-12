import { Plus, GripVertical, X } from "lucide-react";

export interface LadderStep {
  id: string;
  situation: string;
  anxiety: number;
}

interface LadderBuilderProps {
  steps: LadderStep[];
  onStepsChange: (steps: LadderStep[]) => void;
}

const LadderBuilder = ({ steps, onStepsChange }: LadderBuilderProps) => {
  const updateStep = (id: string, field: keyof LadderStep, value: string | number) => {
    onStepsChange(steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const addStep = () => {
    onStepsChange([
      ...steps,
      { id: crypto.randomUUID(), situation: "", anxiety: 50 },
    ]);
  };

  const removeStep = (id: string) => {
    if (steps.length <= 1) return;
    onStepsChange(steps.filter((s) => s.id !== id));
  };

  const moveStep = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= steps.length) return;
    const newSteps = [...steps];
    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
    onStepsChange(newSteps);
  };

  const getAnxietyColor = (val: number) => {
    if (val <= 30) return "bg-therapy-low";
    if (val <= 60) return "bg-therapy-mid";
    return "bg-therapy-high";
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-serif font-semibold text-foreground">Build Your Practice Ladder</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Arrange situations from least uncomfortable to most uncomfortable.
        <br />
        Start where willingness feels possible.
      </p>

      <div className="relative pl-6">
        {/* Ladder line */}
        <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-therapy-ladder-line rounded-full" />

        <div className="space-y-3">
          {steps.map((step, idx) => (
            <div key={step.id} className="relative">
              {/* Ladder rung dot */}
              <div className="absolute -left-6 top-5 w-3 h-3 rounded-full border-2 border-therapy-ladder-line bg-card z-10" />

              <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <div className="flex flex-col gap-0.5 pt-1">
                    <button
                      type="button"
                      onClick={() => moveStep(idx, "up")}
                      disabled={idx === 0}
                      className="text-muted-foreground/40 hover:text-muted-foreground disabled:opacity-20 transition-colors"
                      aria-label="Move up"
                    >
                      <GripVertical className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground/50 w-6">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        value={step.situation}
                        onChange={(e) => updateStep(step.id, "situation", e.target.value)}
                        placeholder={
                          idx === 0
                            ? "Touching a public door handle"
                            : idx === 1
                            ? "Shaking hands with a stranger"
                            : idx === 2
                            ? "Using a public washroom"
                            : "Describe the situation…"
                        }
                        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                        maxLength={200}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground/60 w-16">Anxiety</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={step.anxiety}
                        onChange={(e) => updateStep(step.id, "anxiety", Number(e.target.value))}
                        className="flex-1 h-1.5 accent-primary cursor-pointer"
                      />
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${getAnxietyColor(step.anxiety)} text-foreground/70`}
                      >
                        {step.anxiety}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeStep(step.id)}
                    className="text-muted-foreground/30 hover:text-destructive transition-colors mt-1"
                    aria-label="Remove step"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={addStep}
        className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors ml-6"
      >
        <Plus className="w-4 h-4" />
        Add another step
      </button>
    </section>
  );
};

export default LadderBuilder;
