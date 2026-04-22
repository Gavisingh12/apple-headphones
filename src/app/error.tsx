"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In a real production app, send this to Sentry or Datadog
    console.error("Global Application Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
      <div className="max-w-md space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Something went wrong.
        </h2>
        <p className="text-sm text-white/60">
          We encountered an unexpected issue while rendering this cinematic experience.
        </p>
        <button
          onClick={() => reset()}
          className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
