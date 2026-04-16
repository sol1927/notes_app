"use client";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function NoteItem({ note, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState(note.title || "");
  const [content, setContent] = useState(note.content || "");
  const [password, setPassword] = useState("");
  const [actionType, setActionType] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(note.title || "");
    setContent(note.content || "");
  }, [note.content, note.title]);

  useEffect(() => {
    if (!error) {
      return undefined;
    }

    const timer = setTimeout(() => setError(""), 3000);
    return () => clearTimeout(timer);
  }, [error]);

  const date = note.createdAt
    ? new Date(note.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "New";

  const closePrompt = () => {
    setPassword("");
    setActionType(null);
  };

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      setError("A note needs a title, content, or both.");
      return;
    }

    if (!password) {
      setError("Enter your password to save changes.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const res = await api.put(`/notes/${note._id}`, {
        title: title.trim(),
        content: content.trim(),
        password,
      });
      onUpdate(res.data);
      setIsEditing(false);
      closePrompt();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setTitle(note.title || "");
    setContent(note.content || "");
    setError("");
    closePrompt();
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!password) {
      setError("Enter your password to delete this note.");
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      await api.delete(`/notes/${note._id}`, {
        data: { password },
      });
      onDelete(note._id);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete note.");
      setIsDeleting(false);
    }
  };

  const promptLabel =
    actionType === "delete"
      ? "Enter your password to delete this note."
      : "Enter your password to save changes.";

  return (
    <article className="flex h-full min-h-[260px] flex-col justify-between rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(15,23,42,0.12)]">
      <div>
        <div className="mb-4 flex items-start justify-between gap-4">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {date}
          </span>
          <button
            type="button"
            onClick={() => {
              setError("");
              closePrompt();
              setIsEditing((current) => !current);
            }}
            className="rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            {isEditing ? "Close" : "Edit"}
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note..."
              rows={6}
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-bold leading-tight text-slate-900">
              {note.title || "Untitled"}
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
              {note.content?.trim() || "No content"}
            </p>
          </div>
        )}

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {actionType ? (
          <div className="mt-4 space-y-3 rounded-2xl border border-red-200 bg-red-50/70 p-4">
            <p className="text-sm font-semibold text-red-700">{promptLabel}</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setError("");
                  closePrompt();
                }}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={actionType === "delete" ? handleDelete : handleSave}
                disabled={isDeleting || isSaving}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionType === "delete"
                  ? isDeleting
                    ? "Deleting..."
                    : "Confirm delete"
                  : isSaving
                    ? "Saving..."
                    : "Confirm save"}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setError("");
                setActionType("save");
              }}
              disabled={isSaving}
              className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save changes
            </button>
          </>
        ) : (
          <>
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
              Editable
            </span>
            <button
              type="button"
              onClick={() => {
                setError("");
                setActionType("delete");
              }}
              className="rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400 transition hover:bg-red-50 hover:text-red-600"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </article>
  );
}
