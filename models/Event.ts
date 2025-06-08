import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  description: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: String,
  location: String,
  description: String,
  imageUrl: String,
  photos: [photoSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export { Event };
