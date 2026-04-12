import { Suspense } from "react";
import GenerateClient from "@/components/GenerateClient";

export default function GeneratePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-brand-600 animate-pulse flex items-center gap-3">
          <span className="text-3xl animate-spin inline-block">⚡</span>
          <span className="font-medium text-lg">Loading…</span>
        </div>
      </div>
    }>
      <GenerateClient />
    </Suspense>
  );
}
