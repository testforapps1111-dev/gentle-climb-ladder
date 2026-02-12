interface PracticeGoalProps {
  goal: string;
  onGoalChange: (val: string) => void;
}

const PracticeGoal = ({ goal, onGoalChange }: PracticeGoalProps) => {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-serif font-semibold text-foreground">Set Your Practice Goal</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        What fear would you like to practice approaching — step by step?
        <br />
        <span className="italic">(Focus on learning to tolerate discomfort, not eliminating fear.)</span>
      </p>
      <input
        type="text"
        value={goal}
        onChange={(e) => onGoalChange(e.target.value)}
        placeholder="Fear of dogs, contamination, checking, intrusive thoughts…"
        className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/30 transition-shadow"
        maxLength={200}
      />
      <p className="text-xs text-muted-foreground/70">
        Notice what shows up — you don't need to fix it.
      </p>
    </section>
  );
};

export default PracticeGoal;
