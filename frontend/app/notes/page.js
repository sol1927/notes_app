"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../api/axios";
import NoteForm from "../../components/NoteForm";
import NoteItem from "../../components/NoteItem";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchNotes = useCallback(async () => {
    try {
      const res = await api.get("/notes");
      setNotes(
        [...res.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
      setError("");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        router.push("/login");
        return;
      }
      setError("We could not load your notes right now.");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    if (!error) {
      return undefined;
    }

    const timer = setTimeout(() => setError(""), 3000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleNoteCreated = (newNote) => {
    setNotes((current) => [newNote, ...current]);
  };

  const handleNoteDelete = (id) => {
    setNotes((current) => current.filter((note) => note._id !== id));
  };

  const handleNoteUpdated = (updatedNote) => {
    setNotes((current) =>
      current.map((note) => (note._id === updatedNote._id ? updatedNote : note))
    );
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      router.push("/login");
    } catch (err) {
      console.error(err);
      setError("Logout failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen text-slate-900">
      <nav className="sticky top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-950">
              <span className="text-sm font-bold text-white">N</span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Notes app
              </p>
              <h1 className="text-sm font-bold tracking-tight">Workspace</h1>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Log out
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
              Your board
            </p>
            <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-900">
              Keep every note within reach.
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              Create a note with a title, content, or both. New notes appear at
              the top automatically.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </div>
        </header>

        <section className="mb-12">
          <NoteForm onNoteCreated={handleNoteCreated} />
        </section>

        <div className="mb-8 flex items-center gap-4">
          <h3 className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
            Recent Notes
          </h3>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-52 animate-pulse rounded-[1.75rem] border border-slate-200 bg-white/70"
              />
            ))}
          </div>
        ) : notes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {notes.map((note) => (
              <NoteItem
                key={note._id}
                note={note}
                onDelete={handleNoteDelete}
                onUpdate={handleNoteUpdated}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-white/60 px-6 py-24 text-center">
            <p className="text-lg font-semibold text-slate-700">No notes yet.</p>
            <p className="mt-2 text-sm text-slate-500">
              Start with a quick reminder, a task list, or a title for later.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
