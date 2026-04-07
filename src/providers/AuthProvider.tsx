"use client";

import { useEffect, useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = searchParams.get("token");
      const savedPath = sessionStorage.getItem("redirect_path");

      // 1. Handle incoming token from MantraCare Web redirect
      if (token) {
        try {
          const response = await fetch("https://api.mantracare.com/user/user-info", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.user_id) {
              sessionStorage.setItem("user_id", data.user_id.toString());
              localStorage.setItem("auth_token", token);
              
              const newSearchParams = new URLSearchParams(searchParams.toString());
              newSearchParams.delete("token");
              const searchStr = newSearchParams.toString();
              const cleanUrl = searchStr ? `${pathname}?${searchStr}` : pathname;

              // If we have a saved path from the initial 401, restore it!
              if (savedPath && savedPath !== pathname) {
                sessionStorage.removeItem("redirect_path");
                router.replace(savedPath);
                return;
              } else {
                router.replace(cleanUrl);
              }
              
              setIsAuthenticated(true);
              setIsInitializing(false);
              return;
            }
          }
        } catch (err) {
          console.warn("MantraCare API handshake failed", err);
        }
      }

      // 2. Check for existing session
      const storedToken = localStorage.getItem("auth_token");
      const storedUserId = sessionStorage.getItem("user_id");

      if (!storedToken || !storedUserId) {
        // No session found: save current path and kick to web subdomain for auth
        sessionStorage.setItem("redirect_path", pathname);
        window.location.href = "https://web.mantracare.com/app/therapy";
        return;
      }

      setIsAuthenticated(true);
      setIsInitializing(false);
    };

    initAuth();
  }, [pathname, searchParams, router]);

  if (isInitializing) {
    return <div className="min-h-screen flex items-center justify-center">Loading Auth...</div>;
  }

  return <>{children}</>;
}
