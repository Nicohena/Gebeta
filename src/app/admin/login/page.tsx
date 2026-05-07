"use client";

import { useState } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      router.replace("/admin");
    } else {
      setError("Invalid email or password. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F97316]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#3B82F6]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🐼</div>
            <h1 className="text-white font-bold text-2xl mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
              Panda Admin
            </h1>
            <p className="text-gray-400 text-sm">Sign in to manage your restaurant</p>
          </div>

          <form id="admin-login-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@panda.com"
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm outline-none focus:border-[#F97316] focus:bg-white/15 transition-all"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm outline-none focus:border-[#F97316] focus:bg-white/15 transition-all"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#F97316] hover:bg-[#ea6b10] disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/30 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                "Sign in to Admin"
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Demo Credentials</p>
            <p className="text-xs text-gray-400">Admin: <span className="text-gray-300">admin@panda.com / panda2024</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
