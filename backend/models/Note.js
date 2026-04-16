const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
      trim: true,
    },
    content: {
      type: String,
      default: "",
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

noteSchema.pre("validate", function validateNote() {
  if (!this.title?.trim() && !this.content?.trim()) {
    this.invalidate("content", "A note needs a title, content, or both");
  }
});

module.exports = mongoose.model("Note", noteSchema);
