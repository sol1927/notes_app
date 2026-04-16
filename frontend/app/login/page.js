"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../api/axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!error) {
      return undefined;
    }

    const timer = setTimeout(() => setError(""), 2500);
    return () => clearTimeout(timer);
  }, [error]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email.trim() || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });
      router.push("/notes");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur">
        <header className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
            Welcome back
          </p>
          <h1 className="mt-3 text-4xl font-black text-slate-900">
            Sign in to your notes
          </h1>
          <p className="mt-2 text-slate-500">
            Pick up right where you left off.
          </p>
        </header>

        <div className="h-14">
          <div
            className={`transition-all duration-300 ${
              error
                ? "translate-y-0 opacity-100"
                : "-translate-y-2 opacity-0 pointer-events-none"
            }`}
          >
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-1 ml-1 block text-sm font-semibold text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="relative">
            <label className="mb-1 ml-1 block text-sm font-semibold text-slate-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-20 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-4 top-[39px] text-xs font-bold uppercase tracking-tight text-slate-400 transition hover:text-blue-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-slate-950 py-3 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-4 border-t border-slate-100 pt-6">
          <button
            onClick={() => router.push("/register")}
            className="text-sm font-semibold text-blue-600 transition hover:text-blue-800"
          >
            Don&apos;t have an account? <span className="underline">Create one</span>
          </button>
          <button
            onClick={() => router.push("/")}
            className="text-xs text-slate-400 transition hover:text-slate-600"
          >
            Back to home
          </button>
        </div>
      </div>
    </main>
  );
}
