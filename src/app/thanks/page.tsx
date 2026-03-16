"use client";

import { useSearchParams } from "next/navigation";

export default function ThanksPage() {
  const params = useSearchParams();

  const googleUrl = params.get("googleUrl") || "https://google.com";

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <div className="max-w-md rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
        <h1 className="text-3xl font-bold">Thank you! ⭐</h1>

        <p className="mt-4 text-gray-400">
          We&apos;re glad you had a great experience.
        </p>

        <p className="mt-2 text-gray-400">
          Would you mind leaving us a quick Google review?
        </p>

        <a
          href={googleUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-black"
        >
          Leave Google Review
        </a>
      </div>
    </main>
  );
}