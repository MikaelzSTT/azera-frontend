"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";

type FeedbackItem = {
  id: string;
  businessSlug: string;
  rating: number;
  message: string;
  createdAt: string;
};

type BusinessItem = {
  id: string;
  userId: string;
  name: string;
  slug: string;
  googleReviewUrl: string;
  logoUrl?: string;
  createdAt: string;
};

type ScanItem = {
  id: string;
  businessSlug: string;
  createdAt: string;
};

type GoogleReviewItem = {
  id: string;
  businessSlug: string;
  rating: number;
  createdAt: string;
};

type DailyScanItem = {
  label: string;
  fullDate: string;
  count: number;
};

type StarDistributionItem = {
  stars: number;
  count: number;
};

export default function DashboardPage() {
  const router = useRouter();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");

  const [businessName, setBusinessName] = useState("My Business");
  const [googleReviewUrl, setGoogleReviewUrl] = useState("https://google.com");
  const [logoUrl, setLogoUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [businesses, setBusinesses] = useState<BusinessItem[]>([]);
  const [selectedBusinessSlug, setSelectedBusinessSlug] = useState("");
  const [scans, setScans] = useState<ScanItem[]>([]);
  const [googleReviews, setGoogleReviews] = useState<GoogleReviewItem[]>([]);

  const qrWrapperRef = useRef<HTMLDivElement>(null);
  const printableCardRef = useRef<HTMLDivElement>(null);

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const slug = useMemo(() => {
    return businessName.trim().toLowerCase().replace(/\s+/g, "-");
  }, [businessName]);

  const reviewLink = `${appUrl}/r/${slug}`;
  const reviewWallLink = `${appUrl}/w/${slug}`;

  const whatsappMessage = `Hi! Thanks for visiting ${businessName}. We'd love your feedback. Leave a quick review here: ${reviewLink}`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const reviewRequestMessage = `Hi! Thanks for visiting ${businessName}.

If you enjoyed your experience, we'd really appreciate a quick review.

${reviewLink}`;

  const whatsappReviewUrl = `https://wa.me/?text=${encodeURIComponent(
    reviewRequestMessage
  )}`;

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("reviewsaas_auth");
    const savedEmail = localStorage.getItem("reviewsaas_user_email") || "";
    const savedUserId = localStorage.getItem("reviewsaas_user_id") || "";

    if (isLoggedIn !== "true" || !savedUserId) {
      router.replace("/login");
      return;
    }

    setUserEmail(savedEmail);
    setUserId(savedUserId);
    setIsCheckingAuth(false);
  }, [router]);

  useEffect(() => {
    if (!userId) return;

    setBusinesses([]);
    setFeedbacks([]);
    setScans([]);
    setGoogleReviews([]);
    setSelectedBusinessSlug("");
    setBusinessName("My Business");
    setGoogleReviewUrl("https://google.com");
    setLogoUrl("");
    setMessage("");
  }, [userId]);

  const loadBusinesses = async (currentUserId: string) => {
    try {
      const response = await fetch(
        `${apiUrl}/businesses?userId=${currentUserId}`
      );
      const data = await response.json();

      setBusinesses(data);

      if (data.length === 0) {
        setSelectedBusinessSlug("");
        setBusinessName("My Business");
        setGoogleReviewUrl("https://google.com");
        setLogoUrl("");
        return;
      }

      const currentSelected = data.find(
        (item: BusinessItem) => item.slug === selectedBusinessSlug
      );

      if (currentSelected) {
        setBusinessName(currentSelected.name);
        setGoogleReviewUrl(currentSelected.googleReviewUrl);
        setLogoUrl(currentSelected.logoUrl || "");
        return;
      }

      const firstBusiness = data[0];
      setSelectedBusinessSlug(firstBusiness.slug);
      setBusinessName(firstBusiness.name);
      setGoogleReviewUrl(firstBusiness.googleReviewUrl);
      setLogoUrl(firstBusiness.logoUrl || "");
      setMessage(`Loaded business: ${firstBusiness.name}`);
    } catch (error) {
      console.error("Failed to load businesses:", error);
    }
  };

  const loadFeedbacks = async (currentUserId: string) => {
    try {
      const response = await fetch(
        `${apiUrl}/feedback?userId=${currentUserId}`
      );
      const data = await response.json();
      setFeedbacks(data);
    } catch (error) {
      console.error("Failed to load feedbacks:", error);
    }
  };

  const loadScans = async (currentUserId: string) => {
    try {
      const response = await fetch(
        `${apiUrl}/scans?userId=${currentUserId}`
      );
      const data = await response.json();
      setScans(data);
    } catch (error) {
      console.error("Failed to load scans:", error);
    }
  };

  const loadGoogleReviews = async (currentUserId: string) => {
    try {
      const response = await fetch(
        `${apiUrl}/google-reviews?userId=${currentUserId}`
      );
      const data = await response.json();
      setGoogleReviews(data);
    } catch (error) {
      console.error("Failed to load google reviews:", error);
    }
  };

  const loadAllData = async (currentUserId: string) => {
    await Promise.all([
      loadBusinesses(currentUserId),
      loadFeedbacks(currentUserId),
      loadScans(currentUserId),
      loadGoogleReviews(currentUserId),
    ]);
  };

  useEffect(() => {
    if (isCheckingAuth || !userId) return;
    loadAllData(userId);
  }, [isCheckingAuth, userId]);

  const filteredFeedbacks = selectedBusinessSlug
    ? feedbacks.filter((item) => item.businessSlug === selectedBusinessSlug)
    : [];

  const filteredScans = selectedBusinessSlug
    ? scans.filter((item) => item.businessSlug === selectedBusinessSlug)
    : [];

  const filteredGoogleReviews = selectedBusinessSlug
    ? googleReviews.filter((item) => item.businessSlug === selectedBusinessSlug)
    : [];

  const now = new Date();

  const scansToday = filteredScans.filter((scan) => {
    const scanDate = new Date(scan.createdAt);

    return (
      scanDate.getDate() === now.getDate() &&
      scanDate.getMonth() === now.getMonth() &&
      scanDate.getFullYear() === now.getFullYear()
    );
  });

  const scansThisWeek = filteredScans.filter((scan) => {
    const scanDate = new Date(scan.createdAt);
    const diff = now.getTime() - scanDate.getTime();
    const diffDays = diff / (1000 * 60 * 60 * 24);

    return diffDays <= 7;
  });

  const googleReviewsThisWeek = filteredGoogleReviews.filter((review) => {
    const reviewDate = new Date(review.createdAt);
    const diff = now.getTime() - reviewDate.getTime();
    const diffDays = diff / (1000 * 60 * 60 * 24);

    return diffDays <= 7;
  });

  const totalInteractions =
    filteredFeedbacks.length + filteredGoogleReviews.length;

  const allRatings = [
    ...filteredFeedbacks.map((item) => item.rating),
    ...filteredGoogleReviews.map((item) => item.rating),
  ];

  const averageRating =
    allRatings.length > 0
      ? (
          allRatings.reduce((sum, current) => sum + current, 0) /
          allRatings.length
        ).toFixed(1)
      : "0.0";

  const conversionRate =
    filteredScans.length > 0
      ? ((totalInteractions / filteredScans.length) * 100).toFixed(1)
      : "0.0";

  const dailyScans: DailyScanItem[] = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));

    const count = filteredScans.filter((scan) => {
      const scanDate = new Date(scan.createdAt);

      return (
        scanDate.getDate() === date.getDate() &&
        scanDate.getMonth() === date.getMonth() &&
        scanDate.getFullYear() === date.getFullYear()
      );
    }).length;

    const label = date.toLocaleDateString("en-US", { weekday: "short" });
    const fullDate = date.toLocaleDateString();

    return {
      label,
      fullDate,
      count,
    };
  });

  const maxDailyScans = Math.max(...dailyScans.map((item) => item.count), 1);

  const starDistribution: StarDistributionItem[] = [5, 4, 3, 2, 1].map(
    (stars) => {
      const count = allRatings.filter((rating) => rating === stars).length;

      return {
        stars,
        count,
      };
    }
  );

  const maxStarCount = Math.max(
    ...starDistribution.map((item) => item.count),
    1
  );

  const getSuggestedReply = (rating: number, currentBusinessName: string) => {
    if (rating === 5) {
      return `Thank you for your 5-star review! We’re so happy you had a great experience with ${currentBusinessName}. We truly appreciate your support and look forward to seeing you again.`;
    }

    if (rating === 4) {
      return `Thank you for your review! We’re glad you had a positive experience with ${currentBusinessName}. We appreciate your support and hope to serve you again soon.`;
    }

    return "";
  };

  const handleCopyReply = async (reply: string) => {
    try {
      await navigator.clipboard.writeText(reply);
      setMessage("Reply copied successfully!");
      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error) {
      console.error("Failed to copy reply:", error);
      setMessage("Could not copy reply.");
    }
  };

  const handleSelectBusiness = (business: BusinessItem) => {
    setBusinessName(business.name);
    setGoogleReviewUrl(business.googleReviewUrl);
    setLogoUrl(business.logoUrl || "");
    setSelectedBusinessSlug(business.slug);
    setMessage(`Loaded business: ${business.name}`);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reviewLink);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleCopyWall = async () => {
    try {
      await navigator.clipboard.writeText(reviewWallLink);
      setMessage("Review wall link copied!");
      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error) {
      console.error("Failed to copy review wall link:", error);
      setMessage("Failed to copy review wall link");
    }
  };

  const handleOpenReviewPage = () => {
    window.open(reviewLink, "_blank");
  };

  const handleOpenReviewWall = () => {
    window.open(reviewWallLink, "_blank");
  };

  const handleShareWhatsApp = () => {
    window.open(whatsappUrl, "_blank");
  };

  const handleCopyReviewRequest = async () => {
    try {
      await navigator.clipboard.writeText(reviewRequestMessage);
      setMessage("Review request copied!");
      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error) {
      console.error("Failed to copy review request:", error);
      setMessage("Failed to copy review request");
    }
  };

  const handleSendWhatsAppRequest = () => {
    window.open(whatsappReviewUrl, "_blank");
  };

  const handleSaveBusiness = async () => {
    try {
      setSaving(true);
      setMessage("");

      const response = await fetch(`${apiUrl}/businesses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          name: businessName,
          slug,
          googleReviewUrl,
          logoUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Failed to save business");
        return;
      }

      setSelectedBusinessSlug(data.slug);
      setMessage("Business saved successfully!");

      await loadAllData(userId);
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to backend");
    } finally {
      setSaving(false);
    }
  };

  const handleRefreshAll = async () => {
    if (!userId) return;
    await loadAllData(userId);
  };

  const handleLogout = () => {
    localStorage.removeItem("reviewsaas_auth");
    localStorage.removeItem("reviewsaas_user_email");
    localStorage.removeItem("reviewsaas_user_id");

    setUserEmail("");
    setUserId("");
    setBusinesses([]);
    setFeedbacks([]);
    setScans([]);
    setGoogleReviews([]);
    setSelectedBusinessSlug("");
    setBusinessName("My Business");
    setGoogleReviewUrl("https://google.com");
    setLogoUrl("");
    setMessage("");

    router.replace("/login");
  };

  const handleDownloadQr = () => {
    const svg = qrWrapperRef.current?.querySelector("svg");

    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slug}-qr-code.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCard = async () => {
    if (!printableCardRef.current) return;

    try {
      const dataUrl = await toPng(printableCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        canvasWidth: printableCardRef.current.offsetWidth,
        canvasHeight: printableCardRef.current.offsetHeight,
      });

      const link = document.createElement("a");
      link.download = `${slug}-review-card.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to download card:", error);
    }
  };

  if (isCheckingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p>Checking access...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-2 text-sm text-gray-400">
              Logged in as: {userEmail || "owner@business.com"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-white px-5 py-3 font-semibold text-black"
          >
            Logout
          </button>
        </div>

        <div className="mb-10 rounded-xl border border-white/10 bg-white/5 p-8">
          <h2 className="mb-4 text-xl font-semibold">Business Setup</h2>

          <label className="mb-2 block text-sm text-gray-300">
            Business Name
          </label>

          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Enter your business name"
            className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-gray-500"
          />

          <label className="mb-2 mt-4 block text-sm text-gray-300">
            Google Review URL
          </label>

          <input
            type="text"
            value={googleReviewUrl}
            onChange={(e) => setGoogleReviewUrl(e.target.value)}
            placeholder="Paste your Google review link"
            className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-gray-500"
          />

          <label className="mb-2 mt-4 block text-sm text-gray-300">
            Logo URL
          </label>

          <input
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="Paste your logo URL (optional)"
            className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-gray-500"
          />

          <button
            type="button"
            onClick={handleSaveBusiness}
            disabled={saving}
            className="mt-4 rounded-lg bg-white px-6 py-3 font-semibold text-black"
          >
            {saving ? "Saving..." : "Save Business"}
          </button>

          {message && <p className="mt-4 text-sm text-gray-300">{message}</p>}
        </div>

        <div className="mb-10 rounded-xl border border-white/10 bg-white/5 p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Saved Businesses</h2>

            <button
              type="button"
              onClick={handleRefreshAll}
              className="rounded-lg bg-white px-4 py-2 font-semibold text-black"
            >
              Refresh
            </button>
          </div>

          {businesses.length === 0 ? (
            <p className="text-sm text-gray-400">No businesses yet.</p>
          ) : (
            <div className="space-y-4">
              {businesses.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-xl border border-white/10 bg-black p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-sm text-gray-400">Slug: {item.slug}</p>
                    <p className="break-all text-xs text-gray-500">
                      Google URL: {item.googleReviewUrl}
                    </p>
                    {item.logoUrl && (
                      <p className="break-all text-xs text-gray-500">
                        Logo URL: {item.logoUrl}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectBusiness(item)}
                    className="rounded-lg bg-white px-4 py-2 font-semibold text-black"
                  >
                    Load
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-7">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-gray-400">Total Scans</p>
            <h2 className="mt-2 text-3xl font-bold">{filteredScans.length}</h2>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-gray-400">Scans Today</p>
            <h2 className="mt-2 text-3xl font-bold">{scansToday.length}</h2>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-gray-400">Scans This Week</p>
            <h2 className="mt-2 text-3xl font-bold">{scansThisWeek.length}</h2>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-gray-400">Reviews Sent to Google</p>
            <h2 className="mt-2 text-3xl font-bold">
              {filteredGoogleReviews.length}
            </h2>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-gray-400">Negative Feedback</p>
            <h2 className="mt-2 text-3xl font-bold">
              {filteredFeedbacks.length}
            </h2>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-gray-400">Average Rating</p>
            <h2 className="mt-2 text-3xl font-bold">{averageRating}</h2>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-gray-400">Conversion Rate</p>
            <h2 className="mt-2 text-3xl font-bold">{conversionRate}%</h2>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-green-400/20 bg-green-400/5 p-8">
          <h2 className="text-xl font-semibold text-green-400">
            Review Booster
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Track how your reviews are improving your reputation.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-4">
            <div className="rounded-lg border border-white/10 bg-black p-6">
              <p className="text-sm text-gray-400">New Reviews This Week</p>
              <h3 className="mt-2 text-2xl font-bold text-white">
                +{googleReviewsThisWeek.length}
              </h3>
            </div>

            <div className="rounded-lg border border-white/10 bg-black p-6">
              <p className="text-sm text-gray-400">
                Total Customer Interactions
              </p>
              <h3 className="mt-2 text-2xl font-bold text-white">
                {totalInteractions}
              </h3>
            </div>

            <div className="rounded-lg border border-white/10 bg-black p-6">
              <p className="text-sm text-gray-400">Average Rating</p>
              <h3 className="mt-2 text-2xl font-bold text-white">
                ⭐ {averageRating}
              </h3>
            </div>

            <div className="rounded-lg border border-white/10 bg-black p-6">
              <p className="text-sm text-gray-400">Reviews Prevented</p>
              <h3 className="mt-2 text-2xl font-bold text-white">
                {filteredFeedbacks.length}
              </h3>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Scans Last 7 Days</h2>
            <p className="mt-2 text-sm text-gray-400">
              Daily scan activity for the selected business
            </p>
          </div>

          <div className="space-y-4">
            {dailyScans.map((item) => {
              const widthPercent = (item.count / maxDailyScans) * 100;

              return (
                <div key={item.fullDate}>
                  <div className="mb-2 flex items-center justify-between text-sm text-gray-300">
                    <span>
                      {item.label} · {item.fullDate}
                    </span>
                    <span>{item.count} scan(s)</span>
                  </div>

                  <div className="h-4 w-full rounded-full bg-white/10">
                    <div
                      className="h-4 rounded-full bg-white transition-all"
                      style={{
                        width: `${widthPercent}%`,
                        minWidth: item.count > 0 ? "12px" : "0px",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Star Distribution</h2>
            <p className="mt-2 text-sm text-gray-400">
              How customers are rating this business
            </p>
          </div>

          <div className="space-y-4">
            {starDistribution.map((item) => {
              const widthPercent = (item.count / maxStarCount) * 100;

              return (
                <div key={item.stars}>
                  <div className="mb-2 flex items-center justify-between text-sm text-gray-300">
                    <span>{"⭐".repeat(item.stars)}</span>
                    <span>{item.count} rating(s)</span>
                  </div>

                  <div className="h-4 w-full rounded-full bg-white/10">
                    <div
                      className="h-4 rounded-full bg-white transition-all"
                      style={{
                        width: `${widthPercent}%`,
                        minWidth: item.count > 0 ? "12px" : "0px",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Google Reviews</h2>

            <button
              type="button"
              onClick={handleRefreshAll}
              className="rounded-lg bg-white px-4 py-2 font-semibold text-black"
            >
              Refresh
            </button>
          </div>

          {filteredGoogleReviews.length === 0 ? (
            <p className="text-sm text-gray-400">No Google reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {filteredGoogleReviews.map((item) => {
                const suggestedReply = getSuggestedReply(
                  item.rating,
                  businessName
                );

                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-white/10 bg-black p-4"
                  >
                    <p className="text-sm text-gray-400">
                      Business: {item.businessSlug}
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      Rating: {item.rating} star(s)
                    </p>

                    {suggestedReply && (
                      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                          Suggested Reply
                        </p>

                        <p className="mt-2 text-sm text-white">
                          {suggestedReply}
                        </p>

                        <button
                          type="button"
                          onClick={() => handleCopyReply(suggestedReply)}
                          className="mt-3 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black"
                        >
                          Copy Reply
                        </button>
                      </div>
                    )}

                    <p className="mt-3 text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-8">
          <h2 className="mb-6 text-xl font-semibold">Share & Collect Reviews</h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={handleCopy}
              className="rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
            >
              Copy Review Link
            </button>

            <button
              onClick={handleOpenReviewPage}
              className="rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
            >
              Open Review Page
            </button>

            <button
              onClick={handleCopyWall}
              className="rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
            >
              Copy Review Wall Link
            </button>

            <button
              onClick={handleOpenReviewWall}
              className="rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
            >
              Open Review Wall
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
            >
              Share via WhatsApp
            </button>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Review Requests</h2>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
              Ask for more reviews
            </span>
          </div>

          <p className="mb-6 text-sm text-gray-400">
            Send a ready-made message to happy customers and drive more reviews
            to your funnel.
          </p>

          <div className="rounded-xl border border-white/10 bg-black p-4">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-gray-500">
              Preview message
            </p>

            <textarea
              readOnly
              value={reviewRequestMessage}
              rows={5}
              className="w-full resize-none rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white outline-none"
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={handleCopyReviewRequest}
              className="rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
            >
              Copy Review Request
            </button>

            <button
              type="button"
              onClick={handleSendWhatsAppRequest}
              className="rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
            >
              Send via WhatsApp
            </button>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-8">
          <h2 className="mb-4 text-xl font-semibold">Your Review Link</h2>

          <div className="flex flex-col gap-4 md:flex-row">
            <input
              type="text"
              value={reviewLink}
              readOnly
              className="flex-1 rounded-lg border border-white/10 bg-black px-4 py-3"
            />

            <button
              type="button"
              onClick={handleCopy}
              className="rounded-lg bg-white px-6 py-3 font-semibold text-black"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-8">
          <h2 className="mb-6 text-xl font-semibold">Your QR Code</h2>

          <div className="flex flex-col items-center gap-4">
            <div ref={qrWrapperRef} className="rounded-xl bg-white p-4">
              <QRCodeSVG value={reviewLink} size={180} />
            </div>

            <p className="text-center text-sm text-gray-400">
              Customers can scan this QR code to leave a review
            </p>

            <button
              type="button"
              onClick={handleDownloadQr}
              className="rounded-lg bg-white px-6 py-3 font-semibold text-black"
            >
              Download QR Code
            </button>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-8">
          <h2 className="mb-6 text-xl font-semibold">Printable Review Card</h2>

          <div className="flex flex-col items-center gap-6">
            <div
              ref={printableCardRef}
              className="w-[420px] rounded-2xl bg-white p-8 text-center text-black shadow-lg"
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Business Logo"
                  className="mx-auto mb-4 h-16 object-contain"
                />
              ) : (
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                  {businessName}
                </p>
              )}

              <h3 className="mt-4 text-3xl font-bold">Loved our service?</h3>

              <p className="mt-3 text-base text-gray-600">
                Scan the QR code below to leave us a Google review
              </p>

              <div className="mt-6 flex justify-center">
                <div className="rounded-xl border border-gray-200 p-4">
                  <QRCodeSVG value={reviewLink} size={170} />
                </div>
              </div>

              <p className="mt-6 text-sm text-gray-500">
                Thank you for your support
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadCard}
              className="rounded-lg bg-white px-6 py-3 font-semibold text-black"
            >
              Download Review Card
            </button>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Saved Feedbacks</h2>

            <button
              type="button"
              onClick={handleRefreshAll}
              className="rounded-lg bg-white px-4 py-2 font-semibold text-black"
            >
              Refresh
            </button>
          </div>

          {filteredFeedbacks.length === 0 ? (
            <p className="text-sm text-gray-400">No feedback yet.</p>
          ) : (
            <div className="space-y-4">
              {filteredFeedbacks.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-white/10 bg-black p-4"
                >
                  <p className="text-sm text-gray-400">
                    Business: {item.businessSlug}
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    Rating: {item.rating} star(s)
                  </p>

                  <p className="mt-2 text-white">
                    {item.message || "No message provided"}
                  </p>

                  <p className="mt-2 text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}