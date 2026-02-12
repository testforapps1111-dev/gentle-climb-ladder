import { Info } from "lucide-react";

const LadderIcon = () => (
  <svg width="64" height="80" viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60">
    <line x1="16" y1="8" x2="16" y2="72" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="48" y1="8" x2="48" y2="72" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="16" y1="16" x2="48" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="16" y1="30" x2="48" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="16" y1="44" x2="48" y2="44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="16" y1="58" x2="48" y2="58" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

interface IntroCardProps {
  day: number;
  onShowExample: () => void;
}

const IntroCard = ({ day, onShowExample }: IntroCardProps) => {
  return (
    <div className="bg-card rounded-xl border border-border p-6 md:p-8">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1" />
        <span className="text-xs font-medium tracking-wide uppercase text-muted-foreground bg-therapy-soft px-3 py-1 rounded-full">
          Day {day} Practice
        </span>
      </div>

      <div className="flex items-start gap-6">
        <div className="hidden sm:flex items-center justify-center text-primary/50 flex-shrink-0 mt-1">
          <LadderIcon />
        </div>

        <div className="flex-1 space-y-3">
          <h1 className="text-2xl md:text-3xl font-serif font-semibold text-foreground">
            Build Your Fear Ladder
          </h1>
          <div className="space-y-2 text-sm md:text-base text-muted-foreground leading-relaxed">
            <p>This fear ladder helps you practice facing situations OCD usually pushes you to avoid or fix.</p>
            <p>You'll start with small, manageable steps and gradually work upward.</p>
            <p className="flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary/60" />
              <span>Feeling uncomfortable or uncertain is expected — and safe to experience.</span>
            </p>
            <p>The goal is not to feel calm, but to practice staying present without responding.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={onShowExample}
          className="text-sm font-medium text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
        >
          See Example Ladder
        </button>
      </div>
    </div>
  );
};

export default IntroCard;
