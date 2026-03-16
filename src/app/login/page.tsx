"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("reviewsaas_auth");
    const savedUserId = localStorage.getItem("reviewsaas_user_id");

    if (isLoggedIn === "true" && savedUserId) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setMessage("");

      if (!email || !password) {
        setMessage("Enter your email and password.");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
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
        setMessage(data.error || "Login failed.");

        localStorage.removeItem("reviewsaas_auth");
        localStorage.removeItem("reviewsaas_user_email");
        localStorage.removeItem("reviewsaas_user_id");
        return;
      }

      localStorage.setItem("reviewsaas_auth", "true");
      localStorage.setItem("reviewsaas_user_email", data.user.email);
      localStorage.setItem("reviewsaas_user_id", data.user.id);

      setMessage("Login successful!");

      setTimeout(() => {
        router.replace("/dashboard");
      }, 700);
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseAnotherAccount = () => {
    localStorage.removeItem("reviewsaas_auth");
    localStorage.removeItem("reviewsaas_user_email");
    localStorage.removeItem("reviewsaas_user_id");

    setEmail("");
    setPassword("");
    setMessage("Previous session cleared. You can log in with another account.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold">Login</h1>

        <p className="mb-8 text-center text-sm text-gray-400">
          Access your Review SaaS dashboard
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

        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded-lg bg-white px-6 py-3 font-semibold text-black"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <button
          type="button"
          onClick={handleUseAnotherAccount}
          className="mt-3 w-full rounded-lg border border-white/10 bg-transparent px-6 py-3 font-semibold text-white"
        >
          Use another account
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-300">{message}</p>
        )}

        <p className="mt-6 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-white underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}