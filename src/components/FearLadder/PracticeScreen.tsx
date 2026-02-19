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
  const [completedDay, setCompletedDay] = useState<number | null>(null);

  const stepNumber = completedCount + 1;
  const dayNumber = completedCount + 2; // Day 1 is build, so step 1 = day 2

  const handleSave = async () => {
    if (saving || alreadyLogged) return;
    setSaving(true);

    // Capture the current day number before saving
    const currentDay = dayNumber;

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
      setCompletedDay(currentDay);
      setShowSuccess(true);
    }
  };

  const handleNextDay = () => {
    setShowSuccess(false);
    setCompletedDay(null);
    // Reset local sliders for next day
    setAnxietyBefore(50);
    setAnxietyAfter(50);
    setNotes("");
  };

  if (showSuccess || alreadyLogged) {
    const displayDay = completedDay || dayNumber;
    const isFinal = completedCount >= 10; // This will trigger phase change in parent anyway

    return (
      <div className="flex items-center justify-center py-6">
        <div className="bg-card border border-border rounded-[30px] p-8 text-center max-w-md w-full shadow-xl space-y-6 animate-in zoom-in-95 duration-500">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
            <span className="text-2xl font-bold">✓</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-serif font-bold text-foreground">
              Day {displayDay} Practice Completed
            </h2>
            <p className="text-sm text-muted-foreground">
              You showed up for yourself today. That's the most important part of the journey.
            </p>
            <div className="bg-therapy-soft/50 rounded-xl p-4 mt-4 border border-primary/5">
              <p className="text-[11px] text-primary/80 leading-relaxed italic">
                <strong>Progress Tip:</strong> We recommend waiting until tomorrow for the next step.
                Giving your brain time to process today's exposure is a key part of the therapeutic process.
                Consistency matters more than speed.
              </p>
            </div>
          </div>

          {!isFinal && (
            <button
              onClick={handleNextDay}
              className="w-full py-4 rounded-2xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Continue to Day {displayDay + 1}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current step card */}
      <div className="bg-card border border-primary/20 rounded-[20px] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-primary uppercase tracking-wide">
            Step {stepNumber}
          </p>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            Anxiety: {currentStep.anxiety}
          </span>
        </div>
        <p className="text-lg font-medium text-foreground">{currentStep.situation}</p>
      </div>

      {/* Anxiety Before */}
      <div className="bg-card border border-border rounded-[20px] p-6 space-y-4 shadow-sm">
        <label className="text-sm font-medium text-foreground block">
          Anxiety Before (0–100)
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            step="10"
            value={anxietyBefore}
            onChange={(e) => setAnxietyBefore(Number(e.target.value))}
            className="w-full h-1.5 accent-primary cursor-pointer appearance-none bg-secondary rounded-full"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
            <span>Low</span>
            <span className="text-primary">{anxietyBefore}</span>
            <span>High</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium">
          Notice what shows up. You don’t need to fix it.
        </p>
      </div>

      {/* Anxiety After */}
      <div className="bg-card border border-border rounded-[20px] p-6 space-y-4 shadow-sm">
        <label className="text-sm font-medium text-foreground block">
          Anxiety After (0–100)
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            step="10"
            value={anxietyAfter}
            onChange={(e) => setAnxietyAfter(Number(e.target.value))}
            className="w-full h-1.5 accent-primary cursor-pointer appearance-none bg-secondary rounded-full"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
            <span>Low</span>
            <span className="text-primary">{anxietyAfter}</span>
            <span>High</span>
          </div>
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
