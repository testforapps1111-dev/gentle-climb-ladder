import { LadderStep } from "./LadderBuilder";
import { DayLog } from "@/hooks/useFearLadderStorage";
import { Calendar, Leaf } from "lucide-react";

interface TodaysPracticeProps {
  currentDay: number;
  todayStep: LadderStep | null;
  todayLog: DayLog | undefined;
  onLogSave: (log: DayLog) => void;
}

import { useState, useEffect } from "react";

const TodaysPractice = ({
  currentDay,
  todayStep,
  todayLog,
  onLogSave,
}: TodaysPracticeProps) => {
  const [anxietyBefore, setAnxietyBefore] = useState(todayLog?.anxietyBefore ?? 50);
  const [anxietyAfter, setAnxietyAfter] = useState(todayLog?.anxietyAfter ?? 50);
  const [notes, setNotes] = useState(todayLog?.notes ?? "");

  useEffect(() => {
    if (todayLog) {
      setAnxietyBefore(todayLog.anxietyBefore);
      setAnxietyAfter(todayLog.anxietyAfter);
      setNotes(todayLog.notes);
    }
  }, [todayLog]);

  // Day 1: disclaimer
  if (currentDay <= 1 || !todayStep) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-serif font-semibold text-foreground">Today's Practice</h2>
        <div className="bg-therapy-glow border border-primary/20 rounded-xl p-6 text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h3 className="text-base font-serif font-medium text-foreground">
            Today is for preparation
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            Take your time building your fear ladder above. There's no rush.
            <br />
            Your exposure practice will begin from <span className="font-medium text-foreground">Day 2</span>, 
            where you'll work through your ladder one step at a time.
          </p>
          <p className="text-xs text-muted-foreground/70 italic">
            Setting up thoughtfully is itself an act of courage.
          </p>
        </div>
      </section>
    );
  }

  const handleSave = () => {
    onLogSave({
      day: currentDay,
      stepId: todayStep.id,
      anxietyBefore,
      anxietyAfter,
      notes,
      completedAt: new Date().toISOString(),
    });
  };

  const isCompleted = !!todayLog;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-serif font-semibold text-foreground">Today's Practice</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Here's your step for today. Take it at your own pace — showing up is what matters.
      </p>

      <div className="bg-card border border-border rounded-xl p-5 space-y-5 shadow-sm">
        {/* Assigned step */}
        <div className="bg-therapy-glow border border-primary/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-primary uppercase tracking-wide">Day {currentDay} Step</p>
              <p className="text-sm font-medium text-foreground mt-1">{todayStep.situation}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Anxiety level: {todayStep.anxiety}</p>
            </div>
          </div>
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
            step="10"
            value={anxietyBefore}
            onChange={(e) => setAnxietyBefore(Number(e.target.value))}
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
            step="10"
            value={anxietyAfter}
            onChange={(e) => setAnxietyAfter(Number(e.target.value))}
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
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did it go? What did you notice?"
            rows={3}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none"
            maxLength={500}
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isCompleted
              ? "bg-therapy-progress-done text-primary-foreground"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isCompleted ? "✓ Practice Logged — Update" : "Log Today's Practice"}
        </button>
      </div>

      <p className="text-xs text-muted-foreground/70 italic text-center">
        Progress happens through repetition, not perfection.
      </p>
    </section>
  );
};

export default TodaysPractice;
