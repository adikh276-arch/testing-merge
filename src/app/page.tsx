import Link from "next/link";

export default function TherapyHome() {
  return (
    <div className="min-h-screen gradient-calm flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-card/50 backdrop-blur-md rounded-3xl p-12 shadow-soft text-center space-y-8 border border-white/20">
        <h1 className="text-4xl font-light text-foreground/80 tracking-tight">Therapy Platform</h1>
        <p className="text-muted-foreground text-lg font-light leading-relaxed">
          Welcome to the unified therapy center. Please select a resource below to continue your journey.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <Link href="/brain_dump" className="p-6 rounded-2xl bg-white/40 hover:bg-white/60 transition-all border border-white/30 text-left group">
            <h3 className="font-medium text-foreground/80 group-hover:text-primary transition-colors">Brain Dump & Sort</h3>
            <p className="text-sm text-muted-foreground mt-2">Declutter your mind and organize your thoughts.</p>
          </Link>
          
          <Link href="/mission_statement" className="p-6 rounded-2xl bg-white/40 hover:bg-white/60 transition-all border border-white/30 text-left group">
            <h3 className="font-medium text-foreground/80 group-hover:text-primary transition-colors">Mission Statement</h3>
            <p className="text-sm text-muted-foreground mt-2">Discover and articulate your core personal values.</p>
          </Link>
        </div>
        
        <div className="pt-8 border-t border-white/20">
          <p className="text-xs text-muted-foreground/60 uppercase tracking-widest">Powered by MantraCare</p>
        </div>
      </div>
    </div>
  );
}
