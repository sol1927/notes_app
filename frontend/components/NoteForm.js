"use client";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function NoteForm({ onNoteCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!error) {
      return undefined;
    }

    const timer = setTimeout(() => setError(""), 3000);
    return () => clearTimeout(timer);
  }, [error]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setError("");
    setIsExpanded(false);
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    if (!title.trim() && !content.trim()) {
      setError("Add a title, content, or both before saving.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await api.post("/notes", {
        title: title.trim(),
        content: content.trim(),
      });
      onNoteCreated(res.data);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save note.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleCreate}
      className="mx-auto w-full max-w-3xl rounded-[2rem] border border-white/80 bg-white/85 p-3 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur"
    >
      <div className="rounded-[1.5rem] border border-slate-200/90 bg-white px-3 py-3">
        {(isExpanded || title) && (
          <div className="px-1 pb-2">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent px-4 py-3 text-lg font-semibold text-slate-900 outline-none placeholder:text-slate-400"
              autoFocus
            />
          </div>
        )}

        <textarea
          placeholder={isExpanded ? "Take a note..." : "Write a note..."}
          value={content}
          onFocus={() => setIsExpanded(true)}
          onChange={(e) => setContent(e.target.value)}
          rows={isExpanded ? 6 : 2}
          className="w-full resize-none bg-transparent px-4 py-3 leading-7 text-slate-700 outline-none placeholder:text-slate-400"
        />

        {(isExpanded || error) && (
          <div className="flex flex-col gap-3 border-t border-slate-200 px-3 pb-2 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-500">
              {error ? (
                <span className="text-red-600">{error}</span>
              ) : (
                "Press save when your note is ready."
              )}
            </div>

            <div className="flex gap-2 self-end">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={isSubmitting || (!title.trim() && !content.trim())}
                className="rounded-xl bg-slate-950 px-6 py-2 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSubmitting ? "Saving..." : "Save note"}
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
