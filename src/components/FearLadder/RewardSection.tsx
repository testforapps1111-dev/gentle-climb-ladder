import { useState } from "react";

interface RewardSectionProps {
  reward: string;
  onRewardChange: (val: string) => void;
}

const suggestions = [
  "Watching a favorite show",
  "Calling a friend",
  "Taking a walk",
];

const RewardSection = ({ reward, onRewardChange }: RewardSectionProps) => {
  const [selectedChip, setSelectedChip] = useState<string | null>(null);

  const handleChipClick = (s: string) => {
    if (selectedChip === s) {
      setSelectedChip(null);
      onRewardChange("");
    } else {
      setSelectedChip(s);
      onRewardChange(s);
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-serif font-semibold text-foreground">Plan Your Reward</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        After practicing, how will you reward yourself for showing up — regardless of how it feels?
      </p>

      <input
        type="text"
        value={reward}
        onChange={(e) => {
          onRewardChange(e.target.value);
          setSelectedChip(null);
        }}
        placeholder="Something kind for yourself…"
        className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/30 transition-shadow"
        maxLength={150}
      />

      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => handleChipClick(s)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              selectedChip === s
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-therapy-soft border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground/70 italic">
        Rewards are for effort, not for feeling calm.
      </p>
    </section>
  );
};

export default RewardSection;
