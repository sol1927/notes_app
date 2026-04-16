"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NoteForm from "./NoteForm";
import NoteItem from "./NoteItem";
import api from "../api/axios";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchNotes = useCallback(async () => {
    try {
      const res = await api.get("/notes");
      setNotes(res.data);
    } catch (err) {
      console.error(err);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleNoteCreated = (newNote) => {
    setNotes((prev) => [newNote, ...prev]); // Newest notes at the top
  };

  const handleNoteDelete = (id) => {
    setNotes((prev) => prev.filter((n) => n._id !== id));
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sticky Top Navigation */}
      <nav className="sticky top-0 z-20 bg-white/70 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
              N
            </div>
            <h1 className="text-xl font-extrabold text-gray-800 tracking-tight hidden sm:block">
              My Workspace
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden md:inline">
              Welcome back!
            </span>
            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-gray-600 hover:text-red-500 bg-gray-100 hover:bg-red-50 px-4 py-2 rounded-lg transition-all border border-transparent hover:border-red-100"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 md:p-10">
        {/* Note Creation Area */}
        <section className="mb-12">
          <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl shadow-blue-100/50 p-2 border border-white">
            <NoteForm onNoteCreated={handleNoteCreated} />
          </div>
        </section>

        {/* Notes Display */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Your Notes</h2>
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
            {notes.length} {notes.length === 1 ? "Note" : "Notes"}
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        ) : notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notes.map((note) => (
              <div
                key={note._id}
                className="transform transition-all hover:scale-[1.01]"
              >
                <NoteItem note={note} onDelete={handleNoteDelete} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/40 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 text-lg">Your workspace is empty.</p>
            <p className="text-sm text-gray-400">
              Time to capture some brilliant thoughts!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
