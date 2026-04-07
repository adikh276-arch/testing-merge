import { Suspense } from "react";
import AuthProvider from "@/providers/AuthProvider";
import "./globals.css";

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
