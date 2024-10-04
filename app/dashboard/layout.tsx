import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VIBE-Dashboard",
  description: "VIBE Admin-Dashboard",
};

export default function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {


  return (<>{children}</>  );
}
