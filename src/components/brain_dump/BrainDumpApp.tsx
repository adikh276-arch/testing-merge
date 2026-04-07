import { useState, useCallback, useEffect } from "react";
import { Welcome } from "./Welcome";
import { BrainDump } from "./BrainDump";
import { SortThoughts } from "./SortThoughts";
import { OneSmallStep } from "./OneSmallStep";
import { Reflection } from "./Reflection";
import { SavedThoughts, type SavedSession } from "./SavedThoughts";
import { History } from "lucide-react";
import { query } from "@/lib/db";

export interface ThoughtItem {
  id: string;
  text: string;
  bucket?: "action" | "later" | "letgo";
}

const BrainDumpApp = () => {
  const [screen, setScreen] = useState(0);
  const [thoughts, setThoughts] = useState<ThoughtItem[]>([]);
  const [transitioning, setTransitioning] = useState(false);
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);
  const [showSaved, setShowSaved] = useState(false);

  // Load saved sessions from Neon
  useEffect(() => {
    const fetchSessions = async () => {
      const userId = sessionStorage.getItem("user_id");
      if (!userId) return;

      try {
        const results = await query(
          "SELECT id, thoughts, reflection, created_at AS date FROM sessions WHERE user_id = $1 ORDER BY created_at DESC",
          [userId],
          "brain_dump"
        );
        setSavedSessions(results);
      } catch (e) {
        console.error("Failed to fetch sessions from Neon", e);
      }
    };
    fetchSessions();
  }, [showSaved]);

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

  const handleReflectionComplete = async (reflection: string) => {
    const userId = sessionStorage.getItem("user_id");
    if (!userId) {
      console.warn("No user_id found, can't save!");
      return;
    }

    try {
      await query(
        "INSERT INTO sessions (user_id, thoughts, reflection) VALUES ($1, $2, $3)",
        [userId, JSON.stringify(thoughts), reflection],
        "brain_dump"
      );
    } catch (e) {
      console.error("Failed to save session to Neon", e);
    }
    
    // Reset for new session
    setThoughts([]);
    goTo(0);
  };

  const handleDeleteSession = async (id: string) => {
    const userId = sessionStorage.getItem("user_id");
    if (!userId) return;

    try {
      setSavedSessions(savedSessions.filter((s) => s.id !== id));
      await query("DELETE FROM sessions WHERE id = $1 AND user_id = $2", [id, userId], "brain_dump");
    } catch (e) {
      console.error("Failed to delete session from Neon", e);
    }
  };

  return (
    <div className="min-h-screen gradient-calm relative overflow-hidden theme-brain-dump font-sans">
      {/* Breathing background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] rounded-full bg-primary/5 animate-breathe" />
        <div className="absolute bottom-[-30%] right-[-30%] w-[120%] h-[120%] rounded-full bg-secondary/5 animate-breathe" style={{ animationDelay: "3s" }} />
      </div>

      {showSaved ? (
        <div className="relative z-10">
          <SavedThoughts
            sessions={savedSessions}
            onBack={() => setShowSaved(false)}
            onDelete={handleDeleteSession}
          />
        </div>
      ) : (
        <>
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
            {[
              <Welcome key="welcome" onStart={() => goTo(1)} />,
              <BrainDump key="dump" onComplete={handleDumpComplete} />,
              <SortThoughts key="sort" thoughts={thoughts} onComplete={handleSortComplete} onBack={() => goTo(1)} />,
              <OneSmallStep key="step" thoughts={thoughts.filter((t) => t.bucket === "action")} onComplete={() => goTo(4)} onBack={() => goTo(2)} />,
              <Reflection key="reflect" onComplete={handleReflectionComplete} onBack={() => goTo(0)} />,
            ][screen]}
          </div>
        </>
      )}
    </div>
  );
};

export default BrainDumpApp;

