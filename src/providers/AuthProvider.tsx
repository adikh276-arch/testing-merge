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
            }
          }
        } catch (err) {
          console.warn("MantraCare API not reachable", err);
        }

        // Save token & clear it from URL securely via Next router
        localStorage.setItem("auth_token", token);
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.delete("token");
        const searchStr = newSearchParams.toString();
        const newUrl = searchStr ? `${pathname}?${searchStr}` : pathname;
        router.replace(newUrl);
      }
      
      const storedToken = localStorage.getItem("auth_token");
      const storedUserId = sessionStorage.getItem("user_id");
      
      if (!storedToken && !storedUserId) {
        const intendedPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
        const loginUrl = `https://web.mantracare.com/login?redirect=${encodeURIComponent(intendedPath)}`;
        // For actual production we'd do: window.location.href = loginUrl;
      } else {
        setIsAuthenticated(true);
      }

      setIsInitializing(false);
    };

    initAuth();
  }, [pathname, searchParams, router]);

  if (isInitializing) {
    return <div className="min-h-screen flex items-center justify-center">Loading Auth...</div>;
  }

  return <>{children}</>;
}
