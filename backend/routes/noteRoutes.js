const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Note = require("../models/Note");
const User = require("../models/User");
const auth = require("../middleware/auth");

const normalizeNoteInput = (body = {}) => ({
  title: typeof body.title === "string" ? body.title.trim() : "",
  content: typeof body.content === "string" ? body.content.trim() : "",
});

const sendRouteError = (res, err, fallbackMessage) => {
  console.error(fallbackMessage, err);

  if (err.name === "ValidationError") {
    const message =
      Object.values(err.errors)
        .map((error) => error.message)
        .find(Boolean) || "Invalid note data";

    return res.status(400).json({ message });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid note request" });
  }

  return res.status(500).json({ message: "Server error" });
};

const verifyPassword = async (userId, password) => {
  if (!password) {
    return { ok: false, status: 400, message: "Password is required" };
  }

  const user = await User.findById(userId);
  if (!user) {
    return { ok: false, status: 404, message: "User not found" };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { ok: false, status: 400, message: "Incorrect password" };
  }

  return { ok: true };
};

router.get("/", auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    sendRouteError(res, err, "Fetch notes error");
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { title, content } = normalizeNoteInput(req.body);

    if (!title && !content) {
      return res
        .status(400)
        .json({ message: "A note needs a title, content, or both" });
    }

    const note = await Note.create({ title, content, userId: req.user.id });
    res.status(201).json(note);
  } catch (err) {
    sendRouteError(res, err, "Create note error");
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { title, content } = normalizeNoteInput(req.body);
    const passwordCheck = await verifyPassword(req.user.id, req.body.password);

    if (!title && !content) {
      return res
        .status(400)
        .json({ message: "A note needs a title, content, or both" });
    }

    if (!passwordCheck.ok) {
      return res
        .status(passwordCheck.status)
        .json({ message: passwordCheck.message });
    }

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, content },
      { new: true }
    );
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (err) {
    sendRouteError(res, err, "Update note error");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const passwordCheck = await verifyPassword(req.user.id, req.body.password);
    if (!passwordCheck.ok) {
      return res
        .status(passwordCheck.status)
        .json({ message: passwordCheck.message });
    }

    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch (err) {
    sendRouteError(res, err, "Delete note error");
  }
});

module.exports = router;
