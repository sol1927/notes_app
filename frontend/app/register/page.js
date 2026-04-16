"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../api/axios";

export default function RegisterPage() {
  const [name, setName] = useState("");
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      router.push("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur">
        <header className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">
            Create account
          </p>
          <h1 className="mt-3 text-4xl font-black text-slate-900">
            Start your workspace
          </h1>
          <p className="mt-2 text-slate-500">
            Create an account to begin saving notes.
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

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="mb-1 ml-1 block text-sm font-semibold text-slate-700">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-1 ml-1 block text-sm font-semibold text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div className="relative">
            <label className="mb-1 ml-1 block text-sm font-semibold text-slate-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-20 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-4 top-[39px] text-xs font-bold uppercase text-slate-400 transition hover:text-emerald-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full rounded-2xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Creating Account..." : "Register Now"}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-4 border-t border-slate-100 pt-6">
          <button
            onClick={() => router.push("/login")}
            className="text-sm font-semibold text-blue-600 transition hover:text-blue-800"
          >
            Already have an account? <span className="underline">Login</span>
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
