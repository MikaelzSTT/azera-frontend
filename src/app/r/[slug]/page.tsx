"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Business = {
  id: string;
  name: string;
  slug: string;
  googleReviewUrl: string;
  createdAt: string;
};

export default function ReviewPage() {
  const params = useParams();
  const slug = String(params.slug);

  const [business, setBusiness] = useState<Business | null>(null);
  const [showPrivateFeedback, setShowPrivateFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<number>(3);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBusiness = async () => {
      try {
        const response = await fetch(`http://localhost:5000/businesses/${slug}`);
        const data = await response.json();

        if (response.ok) {
          setBusiness(data);
        }
      } catch (error) {
        console.error("Failed to load business:", error);
      } finally {
        setLoading(false);
      }
    };

    const registerScan = async () => {
      try {
        await fetch("http://localhost:5000/scans", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            businessSlug: slug,
          }),
        });
      } catch (error) {
        console.error("Failed to register scan:", error);
      }
    };

    if (slug) {
      loadBusiness();
      registerScan();
    }
  }, [slug]);

  const handleGoogleReview = async () => {
    if (!business?.googleReviewUrl) return;

    try {
      await fetch("http://localhost:5000/google-reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessSlug: slug,
          rating: 5,
        }),
      });
    } catch (error) {
      console.error("Failed to register google review:", error);
    }

    window.location.href = business.googleReviewUrl;
  };

  const handlePrivateFeedback = () => {
    setShowPrivateFeedback(true);
  };

  const sendFeedback = async () => {
    try {
      await fetch("http://localhost:5000/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessSlug: slug,
          rating: feedbackRating,
          message,
        }),
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Failed to send feedback:", error);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <h1 className="text-2xl">Loading...</h1>
      </main>
    );
  }

  if (!business) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <h1 className="text-2xl">Business not found</h1>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
        <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-10 text-center">
          <h1 className="text-2xl font-bold">Thank you for your feedback</h1>
          <p className="mt-4 text-gray-400">
            We appreciate you taking the time to help us improve.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-10 text-center">
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-gray-400">
          {business.name}
        </p>

        {!showPrivateFeedback ? (
          <>
            <h1 className="mb-3 text-3xl font-bold">
              How was your experience?
            </h1>

            <p className="mb-8 text-gray-400">
              Choose the option that best matches your visit.
            </p>

            <div className="space-y-4">
              <button
                type="button"
                onClick={handleGoogleReview}
                className="w-full rounded-xl bg-white px-6 py-4 text-lg font-semibold text-black transition hover:opacity-90"
              >
                ⭐ Leave a Google Review
              </button>

              <button
                type="button"
                onClick={handlePrivateFeedback}
                className="w-full rounded-xl border border-white/10 bg-black px-6 py-4 text-lg font-semibold text-white transition hover:bg-white/5"
              >
                Send Private Feedback
              </button>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              Your feedback helps improve future customer experiences.
            </p>
          </>
        ) : (
          <>
            <h1 className="mb-3 text-3xl font-bold">Send Private Feedback</h1>

            <p className="mb-6 text-gray-400">
              We&apos;re sorry your experience wasn&apos;t perfect. Tell us what
              happened.
            </p>

            <div className="mb-6 flex justify-center gap-3 text-4xl">
              {[1, 2, 3].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFeedbackRating(star)}
                  className={
                    star <= feedbackRating ? "text-yellow-400" : "text-gray-600"
                  }
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your feedback here..."
              className="w-full rounded-lg border border-white/10 bg-black p-4 text-white outline-none placeholder:text-gray-500"
              rows={5}
            />

            <button
              type="button"
              onClick={sendFeedback}
              className="mt-4 w-full rounded-lg bg-white px-6 py-3 font-semibold text-black"
            >
              Send Feedback
            </button>

            <button
              type="button"
              onClick={() => setShowPrivateFeedback(false)}
              className="mt-3 w-full rounded-lg border border-white/10 bg-transparent px-6 py-3 font-semibold text-white"
            >
              Back
            </button>
          </>
        )}
      </div>
    </main>
  );
}