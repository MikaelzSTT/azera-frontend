"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type FeedbackItem = {
  id: string;
  businessSlug: string;
  rating: number;
  message: string;
  createdAt: string;
};

type GoogleReviewItem = {
  id: string;
  businessSlug: string;
  rating: number;
  createdAt: string;
};

export default function ReviewWallPage() {
  const params = useParams();
  const slug = String(params.slug);

  const [googleReviews, setGoogleReviews] = useState<GoogleReviewItem[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const googleRes = await fetch("http://localhost:5000/google-reviews");
        const googleData = await googleRes.json();

        const feedbackRes = await fetch("http://localhost:5000/feedback");
        const feedbackData = await feedbackRes.json();

        setGoogleReviews(
          googleData.filter((item: GoogleReviewItem) => item.businessSlug === slug)
        );

        setFeedbacks(
          feedbackData.filter((item: FeedbackItem) => item.businessSlug === slug)
        );
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [slug]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading reviews...
      </main>
    );
  }

  const ratings = [
    ...googleReviews.map((r) => r.rating),
    ...feedbacks.map((f) => f.rating),
  ];

  const average =
    ratings.length > 0
      ? (
          ratings.reduce((sum, current) => sum + current, 0) / ratings.length
        ).toFixed(1)
      : "0";

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-2xl text-center">

        <h1 className="text-4xl font-bold">{slug.toUpperCase()}</h1>

        <p className="mt-4 text-xl text-gray-300">
          ⭐ {average} average rating
        </p>

        <p className="mt-2 text-sm text-gray-400">
          Based on {ratings.length} customer reviews
        </p>

        <div className="mt-10 space-y-6">

          {googleReviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-white/10 bg-white/5 p-6 text-left"
            >
              <p className="text-yellow-400">
                {"⭐".repeat(review.rating)}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}

        </div>

      </div>
    </main>
  );
}