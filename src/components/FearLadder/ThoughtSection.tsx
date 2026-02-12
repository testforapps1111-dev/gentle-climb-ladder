import { Info } from "lucide-react";
import { useState } from "react";

interface ThoughtSectionProps {
  thought: string;
  onThoughtChange: (val: string) => void;
}

const ThoughtSection = ({ thought, onThoughtChange }: ThoughtSectionProps) => {
  const [showTip, setShowTip] = useState(false);

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-serif font-semibold text-foreground">Thought / Expected Fear</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        What thought, image, or urge do you expect might show up while working on this?
        <br />
        <span className="italic">(Just name it. You don't need to solve or change it.)</span>
      </p>

      <div className="relative">
        <input
          type="text"
          value={thought}
          onChange={(e) => onThoughtChange(e.target.value)}
          placeholder={`"The dog might bite me"`}
          className="w-full bg-card border border-border rounded-lg px-4 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/30 transition-shadow"
          maxLength={200}
        />
        <button
          type="button"
          onClick={() => setShowTip(!showTip)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary/60 transition-colors"
          aria-label="Show reassurance"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {showTip && (
        <div className="bg-therapy-accent/50 text-accent-foreground text-xs rounded-lg px-4 py-3 leading-relaxed">
          Having a thought doesn't make it true or important. Naming it is an act of courage, not agreement.
        </div>
      )}
    </section>
  );
};

export default ThoughtSection;
