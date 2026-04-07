import { Sparkles, Brain, FileText } from "lucide-react";

interface Props {
  onStart: () => void;
}

export const Welcome = ({ onStart }: Props) => {
  return (
    <div className="max-w-md mx-auto px-6 py-8 min-h-screen flex flex-col justify-center">
      <div className="animate-fade-in">
        {/* Headline */}
        <h1 className="text-3xl font-bold text-foreground mb-3 text-center">
          Welcome to Brain Dump & Sort
        </h1>

        {/* Subheading */}
        <p className="text-muted-foreground text-center mb-8">
          A gentle space to unload your thoughts and organize what matters.
        </p>

        {/* Body copy */}
        <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-soft">
          <p className="text-foreground/80 text-sm leading-relaxed mb-4">
            Your mind holds a lot — tasks, worries, ideas, reminders, unfinished loops.
          </p>
          <p className="text-foreground/80 text-sm leading-relaxed mb-4">
            Before we sort anything, let's simply let it out.
          </p>
          <div className="space-y-1 text-foreground/70 text-sm italic">
            <p>No structure.</p>
            <p>No pressure.</p>
            <p>Just clarity through release.</p>
          </div>
        </div>

        {/* Steps preview */}
        <div className="mb-10">
          <p className="text-foreground/80 text-sm mb-4">In the next steps, you'll:</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText size={18} className="text-primary" />
              </div>
              <span className="text-sm text-foreground/80">Write down everything on your mind</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain size={18} className="text-primary" />
              </div>
              <span className="text-sm text-foreground/80">Clear mental clutter</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles size={18} className="text-primary" />
              </div>
              <span className="text-sm text-foreground/80">Sort it into simple, manageable pieces</span>
            </div>
          </div>
        </div>

        {/* Primary Button */}
        <button
          onClick={onStart}
          className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-base transition-all duration-300 hover:shadow-soft active:scale-[0.98]"
        >
          Start → Brain Dump
        </button>
      </div>
    </div>
  );
};
