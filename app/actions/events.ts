"use server";

import { Event } from "@/models/Event";
import connectDB from "@/lib/db";
import { Types } from "mongoose";

export type { Event };

export interface Photo {
  url: string;
  publicId: string;
  description?: string;
  uploadedAt?: Date;
}

export interface EventType {
  id: string;
  title: string;
  name: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
  imageUrl?: string;
  photos: Photo[];
  createdAt?: Date;
}

interface EventDocument {
  _id: Types.ObjectId;
  title: string;
  name: string;
  date: Date;
  time?: string;
  location?: string;
  description?: string;
  imageUrl?: string;
  photos: Photo[];
  createdAt?: Date;
}

export async function getEvents(): Promise<EventType[]> {
  try {
    await connectDB();

    // Clear Mongoose cache for this query
    await Event.collection.dropIndexes();

    const events = await Event.find()
      .sort({ date: -1 })
      .lean<EventDocument[]>() // Convert to plain JS objects with type
      .exec(); // Force execution

    console.log("Found events:", events.length);

    const mappedEvents = events.map((event) => {
      console.log(
        `Event ${event.name} has ${event.photos?.length || 0} photos`
      );
      if (event.photos?.length > 0) {
        console.log("First photo URL:", event.photos[0].url);
      }

      return {
        id: event._id.toString(),
        title: event.title,
        name: event.name,
        date: new Date(event.date).toISOString().split("T")[0],
        time: event.time,
        location: event.location,
        description: event.description,
        imageUrl: event.imageUrl,
        photos: (event.photos || []).map((photo: Photo) => ({
          url: photo.url,
          publicId: photo.publicId,
          description: photo.description,
          uploadedAt: photo.uploadedAt,
        })),
      };
    });

    console.log("Mapped events:", mappedEvents.length);
    return mappedEvents;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
}

export async function addEvent(
  event: Omit<EventType, "id" | "photos">
): Promise<EventType> {
  try {
    await connectDB();
    const newEvent = await Event.create({
      ...event,
      photos: [],
    });

    return {
      id: newEvent._id.toString(),
      title: newEvent.title,
      name: newEvent.name,
      date: newEvent.date.toISOString().split("T")[0],
      time: newEvent.time,
      location: newEvent.location,
      description: newEvent.description,
      imageUrl: newEvent.imageUrl,
      photos: [],
    };
  } catch (error) {
    console.error("Failed to add event:", error);
    throw new Error("Failed to add event");
  }
}

export async function addPhotoToEvent(
  eventId: string,
  photo: Photo
): Promise<EventType | null> {
  try {
    await connectDB();
    const event = await Event.findByIdAndUpdate(
      eventId,
      { $push: { photos: photo } },
      { new: true }
    );

    if (!event) return null;

    return {
      id: event._id.toString(),
      title: event.title,
      name: event.name,
      date: event.date.toISOString().split("T")[0],
      time: event.time,
      location: event.location,
      description: event.description,
      imageUrl: event.imageUrl,
      photos: event.photos.map((photo: Photo) => ({
        url: photo.url,
        publicId: photo.publicId,
        description: photo.description,
        uploadedAt: photo.uploadedAt,
      })),
    };
  } catch (error) {
    console.error("Failed to add photo:", error);
    return null;
  }
}

export async function deleteEvent(eventId: string): Promise<boolean> {
  try {
    await connectDB();

    // First get the event to check if it exists
    const event = await Event.findById(eventId);
    if (!event) {
      console.log("Event not found:", eventId);
      return false;
    }

    // Delete the event
    const result = await Event.findByIdAndDelete(eventId);

    // Force clear any cached queries
    await Event.collection.dropIndexes().catch(() => {});

    // Log the deletion
    console.log("Event deleted:", eventId, !!result);

    return !!result;
  } catch (error) {
    console.error("Failed to delete event:", error);
    return false;
  }
}

export async function getUpcomingEvents(limit?: number): Promise<EventType[]> {
  try {
    await connectDB();

    // Get today's date at the start of the day (midnight) in UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    console.log("Fetching upcoming events from:", today.toISOString());

    // Find events where the date is greater than or equal to today's start
    const query = Event.find({
      date: {
        $gte: today,
      },
    }).sort({ date: 1 });

    if (limit) {
      query.limit(limit);
    }

    const events = await query;
    console.log("Found events:", events.length);

    if (events.length === 0) {
      console.log("No upcoming events found");
    } else {
      console.log("First event date:", events[0].date);
      console.log(
        "Events:",
        events.map((e) => ({
          title: e.title,
          date: e.date,
          formattedDate: e.date.toISOString(),
        }))
      );
    }

    return events.map((event) => ({
      id: event._id.toString(),
      title: event.title,
      name: event.name,
      date: event.date.toISOString().split("T")[0],
      time: event.time,
      location: event.location,
      description: event.description,
      imageUrl: event.imageUrl,
      photos: event.photos.map((photo: Photo) => ({
        url: photo.url,
        publicId: photo.publicId,
        description: photo.description,
        uploadedAt: photo.uploadedAt,
      })),
    }));
  } catch (error) {
    console.error("Failed to fetch upcoming events:", error);
    return [];
  }
}
