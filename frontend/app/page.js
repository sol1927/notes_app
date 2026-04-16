"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-6xl rounded-[2rem] border border-white/60 bg-white/70 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.10)] backdrop-blur xl:p-12">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-sm font-semibold text-blue-700">
              Notes that stay simple
            </span>
            <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight text-slate-900 md:text-7xl">
              Capture ideas fast and keep them easy to find.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              A clean notes workspace with quick auth, focused writing, and a
              calmer layout that does not get in your way.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => router.push("/login")}
                className="rounded-2xl bg-slate-950 px-8 py-4 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Sign in
              </button>
              <button
                onClick={() => router.push("/register")}
                className="rounded-2xl border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
              >
                Create account
              </button>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200/70 bg-slate-950 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm font-medium text-slate-300">Today</p>
                <h2 className="mt-1 text-2xl font-bold">Workspace</h2>
              </div>
              <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
                Live notes
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {[
                ["Quick capture", "Jot down notes without wrestling the editor."],
                ["Reliable auth", "Login, logout, and note access stay in sync."],
                ["Cleaner flow", "Better empty states, validation, and feedback."],
              ].map(([title, copy]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-4 border-t border-slate-200 pt-8 text-sm text-slate-600 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">Secure session</p>
            <p className="mt-1">Cookie-based auth kept consistent across routes.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">Flexible notes</p>
            <p className="mt-1">Title-only, content-only, or both now work cleanly.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">Focused UI</p>
            <p className="mt-1">A unified visual system across home, auth, and notes.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
