import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your DealPilot password. We'll send a secure link to your email.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
