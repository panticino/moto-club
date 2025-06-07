import mongoose from "mongoose";

const programEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
  },
  time: String,
  location: String,
  description: String,
  type: {
    type: String,
    enum: ["gita", "riunione", "workshop", "sociale", "altro"],
    default: "gita",
  },
  status: {
    type: String,
    enum: ["programmato", "annullato", "completato"],
    default: "programmato",
  },
  maxParticipants: Number,
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  memberName: String,
});

const programSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
      unique: true,
    },
    events: [programEventSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Program =
  mongoose.models.Program || mongoose.model("Program", programSchema);

export default Program;
