import AuthProvider from "@/providers/AuthProvider";

export default function TherapyLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
