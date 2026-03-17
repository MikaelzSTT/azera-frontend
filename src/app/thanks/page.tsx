"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ThanksContent() {
  const searchParams = useSearchParams();
  const business = searchParams.get("business") || "our business";

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-gray-400">
          Thank You
        </p>

        <h1 className="mt-4 text-4xl font-bold">We appreciate your feedback</h1>

        <p className="mt-4 text-base text-gray-300">
          Thanks for visiting <span className="font-semibold">{business}</span>.
        </p>

        <p className="mt-2 text-sm text-gray-400">
          Your response helps us improve and serve customers better.
        </p>

        <Link
          href="/login"
          className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:opacity-90"
        >
          Back to Login
        </Link>
      </div>
    </main>
  );
}

export default function ThanksPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-black text-white">
          <p>Loading...</p>
        </main>
      }
    >
      <ThanksContent />
    </Suspense>
  );
}