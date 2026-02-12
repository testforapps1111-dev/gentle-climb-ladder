import { LadderStep } from "./LadderBuilder";

interface TodaysPracticeProps {
  steps: LadderStep[];
  selectedStep: string;
  onSelectedStepChange: (val: string) => void;
  anxietyBefore: number;
  onAnxietyBeforeChange: (val: number) => void;
  anxietyAfter: number;
  onAnxietyAfterChange: (val: number) => void;
  notes: string;
  onNotesChange: (val: string) => void;
}

const TodaysPractice = ({
  steps,
  selectedStep,
  onSelectedStepChange,
  anxietyBefore,
  onAnxietyBeforeChange,
  anxietyAfter,
  onAnxietyAfterChange,
  notes,
  onNotesChange,
}: TodaysPracticeProps) => {
  const filledSteps = steps.filter((s) => s.situation.trim().length > 0);

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-serif font-semibold text-foreground">Today's Practice</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Choose one step from your ladder and record your experience today.
      </p>

      <div className="bg-card border border-border rounded-lg p-5 space-y-5">
        {/* Step selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Which step did you practice today?</label>
          <select
            value={selectedStep}
            onChange={(e) => onSelectedStepChange(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
          >
            <option value="">Select a step…</option>
            {filledSteps.map((s) => (
              <option key={s.id} value={s.id}>
                {s.situation}
              </option>
            ))}
          </select>
        </div>

        {/* Anxiety Before */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Anxiety Before <span className="text-muted-foreground font-normal">({anxietyBefore})</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={anxietyBefore}
            onChange={(e) => onAnxietyBeforeChange(Number(e.target.value))}
            className="w-full h-1.5 accent-primary cursor-pointer"
          />
        </div>

        {/* Anxiety After */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Anxiety After <span className="text-muted-foreground font-normal">({anxietyAfter})</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={anxietyAfter}
            onChange={(e) => onAnxietyAfterChange(Number(e.target.value))}
            className="w-full h-1.5 accent-primary cursor-pointer"
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Notes <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="How did it go? What did you notice?"
            rows={3}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none"
            maxLength={500}
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground/70 italic text-center">
        Progress happens through repetition, not perfection.
      </p>
    </section>
  );
};

export default TodaysPractice;
