"use client";

import Link from "next/link";

const features = [
  {
    title: "Get more Google reviews",
    description:
      "Turn happy customers into public Google reviews with a simple QR code flow.",
  },
  {
    title: "Protect your reputation",
    description:
      "Low ratings are captured privately, helping businesses solve problems before they become public.",
  },
  {
    title: "Track every interaction",
    description:
      "See scans, ratings, review growth, and customer feedback in one dashboard.",
  },
  {
    title: "Set up in minutes",
    description:
      "Create your business, generate your QR, and start collecting reviews right away.",
  },
];

const steps = [
  {
    number: "01",
    title: "Customer scans the QR code",
    description:
      "Place the QR code on the counter, table, mirror, receipt, or front desk.",
  },
  {
    number: "02",
    title: "They rate the experience",
    description:
      "Customers leave quick feedback in seconds with a simple rating page.",
  },
  {
    number: "03",
    title: "Happy customers go to Google",
    description:
      "High ratings are redirected to Google Reviews while low ratings stay private.",
  },
];

const stats = [
  { label: "More reviews generated", value: "+5★" },
  { label: "Setup time", value: "< 5 min" },
  { label: "Works on any phone", value: "100%" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5">
              <span className="text-lg font-bold text-white">A</span>
            </div>

            <div>
              <p className="text-lg font-semibold tracking-tight">Azera</p>
              <p className="text-xs text-gray-400">Review Growth Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white hover:text-black"
            >
              Log in
            </Link>

            <Link
              href="/signup"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Start free
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-gray-300">
              Built for local businesses
            </div>

            <h1 className="mt-6 max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              Turn happy customers into
              <span className="block text-gray-300">5-star Google reviews.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
              Azera helps businesses collect more reviews using smart QR funnels.
              Happy customers are sent to Google. Negative experiences are kept
              private so owners can recover them fast.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-xl bg-white px-6 py-4 text-center text-sm font-semibold text-black transition hover:opacity-90"
              >
                Start free trial
              </Link>

              <a
                href="#demo"
                className="rounded-xl border border-white/15 px-6 py-4 text-center text-sm font-semibold text-white transition hover:bg-white hover:text-black"
              >
                Watch demo
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-2xl font-bold text-white">{item.value}</p>
                  <p className="mt-1 text-sm text-gray-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl">
              <div className="rounded-2xl border border-white/10 bg-black p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-sm text-gray-400">Azera Dashboard</p>
                    <h2 className="mt-1 text-xl font-semibold">
                      Reputation overview
                    </h2>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300">
                    Live analytics
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-gray-400">Reviews sent to Google</p>
                    <p className="mt-3 text-3xl font-bold">124</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-gray-400">Average rating</p>
                    <p className="mt-3 text-3xl font-bold">4.9</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-gray-400">Low ratings prevented</p>
                    <p className="mt-3 text-3xl font-bold">18</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-gray-400">Conversion rate</p>
                    <p className="mt-3 text-3xl font-bold">62%</p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm text-gray-300">Scans last 7 days</p>
                    <p className="text-xs text-gray-500">This week</p>
                  </div>

                  <div className="space-y-3">
                    {[55, 72, 34, 80, 64, 49, 91].map((width, index) => (
                      <div key={index}>
                        <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                          <span>Day {index + 1}</span>
                          <span>{width} scans</span>
                        </div>
                        <div className="h-3 rounded-full bg-white/10">
                          <div
                            className="h-3 rounded-full bg-white"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                    Suggested reply
                  </p>
                  <p className="mt-3 text-sm text-white">
                    Thank you for your 5-star review! We’re so happy you had a
                    great experience. We truly appreciate your support and look
                    forward to seeing you again.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.25em] text-gray-500">
              How it works
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Collect reviews with a smart funnel.
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Simple for the business. Simple for the customer. Powerful for
              reputation growth.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-3xl border border-white/10 bg-black p-6"
              >
                <p className="text-sm font-semibold text-gray-500">
                  {step.number}
                </p>
                <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 leading-7 text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-gray-500">
            Why Azera
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            Built to grow reputation, not just collect feedback.
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-3 leading-7 text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="demo"
        className="border-y border-white/10 bg-white/[0.03]"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-gray-500">
                Demo
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                See what businesses track inside Azera.
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-400">
                From scans to review conversion, Azera gives owners a simple way
                to understand what is happening and grow their reputation.
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black p-4">
                  <p className="font-medium">Google review conversion</p>
                  <p className="mt-1 text-sm text-gray-400">
                    See how many scans become public Google reviews.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black p-4">
                  <p className="font-medium">Negative feedback recovery</p>
                  <p className="mt-1 text-sm text-gray-400">
                    Capture unhappy experiences privately and fix them fast.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black p-4">
                  <p className="font-medium">Simple QR distribution</p>
                  <p className="mt-1 text-sm text-gray-400">
                    Place review funnels at the mirror, counter, desk, or table.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black p-5">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Review page preview</p>
                    <p className="mt-1 text-lg font-semibold">Customer flow</p>
                  </div>

                  <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-400">
                    Mobile friendly
                  </div>
                </div>

                <div className="mt-6 rounded-3xl border border-white/10 bg-black p-6 text-center">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                    Mike’s Barber Shop
                  </p>
                  <h3 className="mt-4 text-3xl font-bold">
                    How was your experience?
                  </h3>
                  <p className="mt-3 text-gray-400">
                    Choose the option that best matches your visit.
                  </p>

                  <div className="mt-8 flex justify-center gap-3 text-3xl">
                    <span>⭐</span>
                    <span>⭐</span>
                    <span>⭐</span>
                    <span>⭐</span>
                    <span>⭐</span>
                  </div>

                  <div className="mt-8 grid gap-3">
                    <button className="rounded-xl bg-white px-5 py-4 font-semibold text-black">
                      Leave a Google Review
                    </button>
                    <button className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 font-semibold text-white">
                      Send Private Feedback
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-gray-500">
            Pricing
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            Simple pricing for local businesses.
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Start simple. Grow as your reviews grow.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-gray-500">
                Starter
              </p>
              <h3 className="mt-3 text-4xl font-bold">$9</h3>
              <p className="mt-2 text-gray-400">per month</p>
            </div>

            <Link
              href="/signup"
              className="rounded-xl bg-white px-6 py-4 text-center font-semibold text-black transition hover:opacity-90"
            >
              Start free
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "1 business location",
              "QR code generator",
              "Review funnel",
              "Google review redirect",
              "Basic analytics dashboard",
              "Private feedback capture",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-black px-4 py-4 text-sm text-gray-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center md:px-10">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            Start growing your reviews today.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-400">
            Launch your QR review funnel, protect your reputation, and turn happy
            customers into public Google reviews.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-xl bg-white px-6 py-4 text-center font-semibold text-black transition hover:opacity-90"
            >
              Create free account
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-white/15 px-6 py-4 text-center font-semibold text-white transition hover:bg-white hover:text-black"
            >
              Go to login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}