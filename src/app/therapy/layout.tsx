import { Suspense } from "react";
import AuthProvider from "@/providers/AuthProvider";

export const dynamic = 'force-dynamic';

export default function TherapySubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Suspense>
  );
}
