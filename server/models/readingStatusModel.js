import mongoose from "mongoose";

const readingStatusSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    
    status: {
      type: String,
      enum: ["want_to_read", "reading", "paused", "completed"],
      default: "want_to_read",
      required: true,
    },

    
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);


readingStatusSchema.index({ user: 1, book: 1 }, { unique: true });

export const ReadingStatus = mongoose.model("ReadingStatus", readingStatusSchema);
