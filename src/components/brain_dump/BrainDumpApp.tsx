import { useState, useCallback, useEffect } from "react";
import { Welcome } from "./Welcome";
import { BrainDump } from "./BrainDump";
import { SortThoughts } from "./SortThoughts";
import { OneSmallStep } from "./OneSmallStep";
import { Reflection } from "./Reflection";
import { SavedThoughts, type SavedSession } from "./SavedThoughts";
import { History } from "lucide-react";

export interface ThoughtItem {
  id: string;
  text: string;
  bucket?: "action" | "later" | "letgo";
}

const STORAGE_KEY = "brain-dump-sessions";

const BrainDumpApp = () => {
  const [screen, setScreen] = useState(0);
  const [thoughts, setThoughts] = useState<ThoughtItem[]>([]);
  const [transitioning, setTransitioning] = useState(false);
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);
  const [showSaved, setShowSaved] = useState(false);

  // Load saved sessions from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedSessions(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse saved sessions", e);
      }
    }
  }, []);

  // Save sessions to localStorage
  const saveSessions = (sessions: SavedSession[]) => {
    setSavedSessions(sessions);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  };

  const goTo = useCallback((next: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setScreen(next);
      setTransitioning(false);
    }, 400);
  }, []);

  const handleDumpComplete = (text: string) => {
    const lines = text
      .split(/[\n,.;]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const items: ThoughtItem[] = lines.map((t, i) => ({
      id: `t-${i}`,
      text: t,
    }));
    setThoughts(items);
    goTo(2);
  };

  const handleSortComplete = (sorted: ThoughtItem[]) => {
    setThoughts(sorted);
    goTo(3);
  };

  const handleReflectionComplete = (reflection: string) => {
    // Save session
    const newSession: SavedSession = {
      id: `session-${Date.now()}`,
      date: new Date().toISOString(),
      thoughts: thoughts,
      reflection: reflection,
    };
    saveSessions([newSession, ...savedSessions]);
    
    // Reset for new session
    setThoughts([]);
    goTo(0);
  };

  const handleDeleteSession = (id: string) => {
    saveSessions(savedSessions.filter((s) => s.id !== id));
  };

  if (showSaved) {
    return (
      <div className="min-h-screen gradient-calm relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] rounded-full bg-primary/5 animate-breathe" />
        </div>
        <div className="relative z-10">
          <SavedThoughts
            sessions={savedSessions}
            onBack={() => setShowSaved(false)}
            onDelete={handleDeleteSession}
          />
        </div>
      </div>
    );
  }

  const screens = [
    <Welcome key="welcome" onStart={() => goTo(1)} />,
    <BrainDump key="dump" onComplete={handleDumpComplete} />,
    <SortThoughts key="sort" thoughts={thoughts} onComplete={handleSortComplete} onBack={() => goTo(1)} />,
    <OneSmallStep key="step" thoughts={thoughts.filter((t) => t.bucket === "action")} onComplete={() => goTo(4)} onBack={() => goTo(2)} />,
    <Reflection key="reflect" onComplete={handleReflectionComplete} onBack={() => goTo(0)} />,
  ];

  return (
    <div className="min-h-screen gradient-calm relative overflow-hidden">
      {/* Breathing background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] rounded-full bg-primary/5 animate-breathe" />
        <div className="absolute bottom-[-30%] right-[-30%] w-[120%] h-[120%] rounded-full bg-secondary/5 animate-breathe" style={{ animationDelay: "3s" }} />
      </div>

      {/* History button */}
      {screen === 0 && savedSessions.length > 0 && (
        <button
          onClick={() => setShowSaved(true)}
          className="fixed top-4 right-4 z-20 p-3 rounded-full bg-card/80 backdrop-blur-sm shadow-soft hover:shadow-md transition-all"
        >
          <History size={20} className="text-foreground" />
        </button>
      )}

      <div
        className={`relative z-10 transition-all duration-500 ease-in-out ${
          transitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        {screens[screen]}
      </div>
    </div>
  );
};

export default BrainDumpApp;
