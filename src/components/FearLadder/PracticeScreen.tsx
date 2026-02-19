import { useState } from "react";
import { LadderStep } from "./LadderBuilder";
import { DayLog } from "@/hooks/useFearLadderStorage";

interface PracticeScreenProps {
  completedCount: number;
  currentStep: LadderStep;
  alreadyLogged: boolean;
  onSave: (log: DayLog) => Promise<{ success: boolean }>;
}

const PracticeScreen = ({
  completedCount,
  currentStep,
  alreadyLogged,
  onSave,
}: PracticeScreenProps) => {
  const [anxietyBefore, setAnxietyBefore] = useState(50);
  const [anxietyAfter, setAnxietyAfter] = useState(50);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const stepNumber = completedCount + 1;
  const dayNumber = completedCount + 2; // Day 1 is build, so step 1 = day 2

  const handleSave = async () => {
    if (saving || alreadyLogged) return;
    setSaving(true);

    const result = await onSave({
      day: stepNumber,
      stepId: currentStep.id,
      anxietyBefore,
      anxietyAfter,
      notes,
      completedAt: new Date().toISOString(),
    });

    setSaving(false);
    if (result.success) {
      setShowSuccess(true);
    }
  };

  if (showSuccess || alreadyLogged) {
    const message =
      completedCount >= 9
        ? "Day 10 practice completed — One more step tomorrow."
        : `Day ${dayNumber} practice completed — Be ready for Day ${dayNumber + 1}.`;

    return (
      <div className="flex items-center justify-center py-12">
        <div className="bg-card border border-border rounded-[20px] p-8 text-center max-w-md w-full shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <span className="text-2xl">✓</span>
          </div>
          <h2 className="text-xl font-serif font-semibold text-foreground">{message}</h2>
          <p className="text-sm text-muted-foreground">
            You showed up today. That's what matters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-serif font-semibold text-foreground">
          Today's Practice
        </h1>
        <p className="text-sm text-muted-foreground">Step {stepNumber} of {Math.max(stepNumber, 10)}</p>
      </div>

      {/* Current step card */}
      <div className="bg-card border border-primary/20 rounded-[20px] p-6 shadow-sm">
        <p className="text-xs font-medium text-primary uppercase tracking-wide mb-2">
          Step {stepNumber}
        </p>
        <p className="text-base font-medium text-foreground">{currentStep.situation}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Anxiety level: {currentStep.anxiety}
        </p>
      </div>

      {/* Anxiety Before */}
      <div className="bg-card border border-border rounded-[20px] p-6 space-y-3 shadow-sm">
        <label className="text-sm font-medium text-foreground">
          Anxiety Before{" "}
          <span className="text-muted-foreground font-normal">(0–100)</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="10"
          value={anxietyBefore}
          onChange={(e) => setAnxietyBefore(Number(e.target.value))}
          className="w-full h-2 accent-primary cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span className="font-medium text-foreground">{anxietyBefore}</span>
          <span>100</span>
        </div>
        <p className="text-xs text-muted-foreground/70 italic">
          Notice what shows up. You don't need to fix it.
        </p>
      </div>

      {/* Anxiety After */}
      <div className="bg-card border border-border rounded-[20px] p-6 space-y-3 shadow-sm">
        <label className="text-sm font-medium text-foreground">
          Anxiety After{" "}
          <span className="text-muted-foreground font-normal">(0–100)</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="10"
          value={anxietyAfter}
          onChange={(e) => setAnxietyAfter(Number(e.target.value))}
          className="w-full h-2 accent-primary cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span className="font-medium text-foreground">{anxietyAfter}</span>
          <span>100</span>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-card border border-border rounded-[20px] p-6 space-y-3 shadow-sm">
        <label className="text-sm font-medium text-foreground">
          Reflection Notes{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How did it go? What did you notice?"
          rows={3}
          className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none"
          maxLength={500}
        />
      </div>

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 rounded-[20px] text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save Today's Practice"}
      </button>
    </div>
  );
};

export default PracticeScreen;
