"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    try {
      setLoading(true);
      setMessage("");

      if (!email || !password || !confirmPassword) {
        setMessage("Fill in all fields.");
        return;
      }

      if (password.length < 4) {
        setMessage("Password must have at least 4 characters.");
        return;
      }

      if (password !== confirmPassword) {
        setMessage("Passwords do not match.");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Failed to create account.");
        return;
      }

      setMessage("Account created successfully!");

      setTimeout(() => {
        router.replace("/login");
      }, 800);
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold">Sign Up</h1>
        <p className="mb-8 text-center text-sm text-gray-400">
          Create your Review SaaS account
        </p>

        <label className="mb-2 block text-sm text-gray-300">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@business.com"
          className="mb-4 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-gray-500"
        />

        <label className="mb-2 block text-sm text-gray-300">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="mb-4 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-gray-500"
        />

        <label className="mb-2 block text-sm text-gray-300">
          Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          className="mb-6 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-gray-500"
        />

        <button
          type="button"
          onClick={handleSignup}
          disabled={loading}
          className="w-full rounded-lg bg-white px-6 py-3 font-semibold text-black"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-300">{message}</p>
        )}

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-white underline">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}