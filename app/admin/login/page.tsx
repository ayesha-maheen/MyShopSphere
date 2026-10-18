"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed. Please try again.");
        return;
      }

      router.push(data.redirect || "/admin/dashboard");
      router.refresh();
    } catch {
      setError("Server se connection nahi ho saka. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F9F7F2] px-4 py-10">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-3xl border border-[#E7E0EF] bg-white p-6 shadow-[0_12px_40px_rgba(41,35,53,0.08)] sm:p-8"
      >
        <div className="mb-7 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#EEE8F7] shadow-sm">
            <svg
              viewBox="0 0 64 64"
              className="h-14 w-14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="MyShopSphere shopping bag logo"
            >
              <path
                d="M20 24V17a12 12 0 0 1 24 0v7"
                stroke="#65528A"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path d="M13 23H51L56 56H8L13 23Z" fill="#B8A4E3" />
              <path
                d="M32 47S17 38 17 30C17 22 27 20 32 29C37 20 47 22 47 30C47 38 32 47 32 47Z"
                stroke="#FFFFFF"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#65528A]">
            MyShop<span className="text-[#B8A4E3]">Sphere</span>
          </h1>

          <p className="mt-2 text-xs font-medium tracking-[0.2em] text-[#655F6F]">
            SHOP SMARTER · LIVE BETTER
          </p>

          <div className="mx-auto mt-6 h-px w-16 bg-[#E7E0EF]" />

          <h2 className="mt-6 text-2xl font-bold text-[#292335]">
            Admin Login
          </h2>

          <p className="mt-2 text-sm text-[#655F6F]">
            Sign in to manage your MyShopSphere store.
          </p>
        </div>

        <label
          htmlFor="email"
          className="block text-sm font-semibold text-[#292335]"
        >
          Email Address
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          autoComplete="username"
          required
          disabled={loading}
          className="mt-2 w-full rounded-xl border border-[#E7E0EF] bg-[#FDFCFE] px-4 py-3 text-[#292335] outline-none transition placeholder:text-[#9A92A5] focus:border-[#B8A4E3] focus:ring-4 focus:ring-[#EEE8F7] disabled:opacity-60"
        />

        <label
          htmlFor="password"
          className="mt-5 block text-sm font-semibold text-[#292335]"
        >
          Password
        </label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          disabled={loading}
          className="mt-2 w-full rounded-xl border border-[#E7E0EF] bg-[#FDFCFE] px-4 py-3 text-[#292335] outline-none transition placeholder:text-[#9A92A5] focus:border-[#B8A4E3] focus:ring-4 focus:ring-[#EEE8F7] disabled:opacity-60"
        />

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="mt-7 w-full rounded-xl bg-[#B8A4E3] py-3.5 font-semibold text-[#292335] transition duration-200 hover:bg-[#E6E0F5] focus:outline-none focus:ring-4 focus:ring-[#EEE8F7] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In →"}
        </Button>

        <div className="mt-7 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#E7E0EF]" />
          <span className="text-lg text-[#B8A4E3]">♡</span>
          <div className="h-px flex-1 bg-[#E7E0EF]" />
        </div>

        <p className="mt-3 text-center text-xs tracking-wide text-[#827A8D]">
          MyShopSphere · Admin Panel
        </p>
      </form>
    </main>
  );
}