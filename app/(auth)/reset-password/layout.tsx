import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set a new password",
  description: "Choose a new password for your DealPilot account.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
