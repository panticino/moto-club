"use server";

import Program from "@/models/Program";
import connectDB from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Types } from "mongoose";
import { Event } from "@/models/Event";
import type { EventType } from "./events";

export interface ProgramEvent {
  _id?: Types.ObjectId;
  id?: string;
  title: string;
  date: string;
  endDate?: string;
  time?: string;
  location?: string;
  description?: string;
  type: "gita" | "riunione" | "workshop" | "sociale" | "altro";
  status: "programmato" | "annullato" | "completato";
  maxParticipants?: number;
  organizer?: string | Types.ObjectId;
  memberName?: string;
}

export interface YearlyProgram {
  id: string;
  year: number;
  events: ProgramEvent[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function getPrograms(): Promise<YearlyProgram[]> {
  try {
    await connectDB();
    const programs = await Program.find().sort({ year: -1 });

    return programs.map((program) => ({
      id: program._id.toString(),
      year: program.year,
      events: program.events.map((event: ProgramEvent) => ({
        id: event._id?.toString() || event.id || "",
        title: event.title,
        date: event.date,
        endDate: event.endDate,
        time: event.time,
        location: event.location,
        description: event.description,
        type: event.type,
        status: event.status,
        maxParticipants: event.maxParticipants,
        organizer: event.organizer?.toString(),
        memberName: event.memberName,
      })),
      isActive: program.isActive,
      createdAt: program.createdAt,
      updatedAt: program.updatedAt,
    }));
  } catch (error) {
    console.error("Failed to fetch programs:", error);
    return [];
  }
}

export async function getProgram(year: number): Promise<YearlyProgram | null> {
  try {
    await connectDB();
    const program = await Program.findOne({ year });

    if (!program) return null;

    return {
      id: program._id.toString(),
      year: program.year,
      events: program.events.map((event: ProgramEvent) => ({
        id: event._id?.toString() || event.id || "",
        title: event.title,
        date: event.date,
        endDate: event.endDate,
        time: event.time,
        location: event.location,
        description: event.description,
        type: event.type,
        status: event.status,
        maxParticipants: event.maxParticipants,
        organizer: event.organizer?.toString(),
        memberName: event.memberName,
      })),
      isActive: program.isActive,
      createdAt: program.createdAt,
      updatedAt: program.updatedAt,
    };
  } catch (error) {
    console.error("Failed to fetch program:", error);
    return null;
  }
}

export async function createProgram(
  year: number,
  initialEvent: Omit<ProgramEvent, "id">
): Promise<{ program: YearlyProgram | null; error?: string }> {
  try {
    await connectDB();

    const existingProgram = await Program.findOne({ year });
    if (existingProgram) {
      return {
        program: null,
        error: `Esiste già un programma per l'anno ${year}`,
      };
    }

    // Store the date as is without any timezone conversion
    const formattedEvent = {
      ...initialEvent,
      date: initialEvent.date, // Store the date string directly
    };

    const program = await Program.create({
      year,
      events: [formattedEvent],
      isActive: true,
    });

    revalidatePath("/admin/program", "layout");
    revalidatePath("/program", "layout");

    return {
      program: {
        id: program._id.toString(),
        year: program.year,
        events: program.events.map((event: ProgramEvent) => ({
          id: event._id?.toString() || event.id || "",
          title: event.title,
          date: event.date, // Return the date string as is
          time: event.time,
          location: event.location,
          description: event.description,
          type: event.type,
          status: event.status,
          maxParticipants: event.maxParticipants,
          organizer: event.organizer?.toString(),
          memberName: event.memberName,
        })),
        isActive: program.isActive,
        createdAt: program.createdAt,
        updatedAt: program.updatedAt,
      },
    };
  } catch (error) {
    console.error("Impossibile creare il programma:", error);
    return {
      program: null,
      error: "Impossibile creare il programma. Riprova più tardi.",
    };
  }
}

export async function addEventToProgram(
  year: number,
  event: Omit<ProgramEvent, "id">
): Promise<YearlyProgram | null> {
  try {
    await connectDB();

    // Store the date as is without any timezone conversion
    const formattedEvent = {
      ...event,
      date: event.date, // Store the date string directly
    };

    const program = await Program.findOneAndUpdate(
      { year },
      { $push: { events: formattedEvent } },
      { new: true }
    );

    if (!program) return null;

    revalidatePath("/admin/program", "layout");
    revalidatePath("/program", "layout");

    return {
      id: program._id.toString(),
      year: program.year,
      events: program.events.map((event: ProgramEvent) => ({
        id: event._id?.toString() || event.id || "",
        title: event.title,
        date: event.date, // Return the date string as is
        time: event.time,
        location: event.location,
        description: event.description,
        type: event.type,
        status: event.status,
        maxParticipants: event.maxParticipants,
        organizer: event.organizer?.toString(),
        memberName: event.memberName,
      })),
      isActive: program.isActive,
      createdAt: program.createdAt,
      updatedAt: program.updatedAt,
    };
  } catch (error) {
    console.error("Failed to add event:", error);
    return null;
  }
}

export async function updateEvent(
  year: number,
  eventId: string,
  updates: Partial<ProgramEvent>
): Promise<YearlyProgram | null> {
  try {
    await connectDB();
    const program = await Program.findOneAndUpdate(
      { year, "events._id": eventId },
      { $set: { "events.$": { ...updates, _id: eventId } } },
      { new: true }
    );

    if (!program) return null;

    revalidatePath("/admin/program", "layout");
    revalidatePath("/program", "layout");

    return {
      id: program._id.toString(),
      year: program.year,
      events: program.events.map((event: ProgramEvent) => ({
        id: event._id?.toString() || event.id || "",
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        description: event.description,
        type: event.type,
        status: event.status,
        maxParticipants: event.maxParticipants,
        organizer: event.organizer?.toString(),
        memberName: event.memberName,
      })),
      isActive: program.isActive,
      createdAt: program.createdAt,
      updatedAt: program.updatedAt,
    };
  } catch (error) {
    console.error("Failed to update event:", error);
    return null;
  }
}

export async function deleteEvent(
  year: number,
  eventId: string
): Promise<boolean> {
  try {
    await connectDB();
    const result = await Program.findOneAndUpdate(
      { year },
      { $pull: { events: { _id: eventId } } }
    );

    revalidatePath("/admin/program", "layout");
    revalidatePath("/program", "layout");

    return !!result;
  } catch (error) {
    console.error("Failed to delete event:", error);
    return false;
  }
}

export async function toggleProgramActive(
  year: number,
  isActive: boolean
): Promise<boolean> {
  try {
    await connectDB();
    const result = await Program.findOneAndUpdate(
      { year },
      { $set: { isActive } }
    );

    revalidatePath("/admin/program", "layout");
    revalidatePath("/program", "layout");

    return !!result;
  } catch (error) {
    console.error("Failed to toggle program status:", error);
    return false;
  }
}

export async function getCurrentYearProgram(): Promise<YearlyProgram | null> {
  const currentYear = new Date().getFullYear();
  try {
    await connectDB();
    const program = await Program.findOne({ year: currentYear });

    if (!program) return null;

    return {
      id: program._id.toString(),
      year: program.year,
      events: program.events.map((event: ProgramEvent) => ({
        id: event._id?.toString() || event.id || "",
        title: event.title,
        date: event.date,
        endDate: event.endDate,
        time: event.time,
        location: event.location,
        description: event.description,
        type: event.type,
        status: event.status,
        maxParticipants: event.maxParticipants,
        organizer: event.organizer?.toString(),
        memberName: event.memberName,
      })),
      isActive: program.isActive,
      createdAt: program.createdAt,
      updatedAt: program.updatedAt,
    };
  } catch (error) {
    console.error("Failed to fetch current year program:", error);
    return null;
  }
}

interface PhotoType {
  url: string;
  publicId: string;
  description?: string;
  uploadedAt?: Date;
}

export async function getYearlyProgramEvents(
  limit?: number
): Promise<EventType[]> {
  try {
    await connectDB();

    // Get today's date at the start of the day (midnight) in UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Get the start and end of the current year
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);

    console.log(
      "Fetching program events from:",
      startOfYear.toISOString(),
      "to:",
      endOfYear.toISOString()
    );

    // Find events for the current year
    const query = Event.find({
      date: {
        $gte: startOfYear,
        $lte: endOfYear,
      },
    }).sort({ date: 1 });

    if (limit) {
      query.limit(limit);
    }

    const events = await query;
    console.log("Found program events:", events.length);

    return events.map((event) => ({
      id: event._id.toString(),
      title: event.title,
      name: event.name,
      date: event.date.toISOString().split("T")[0],
      time: event.time,
      location: event.location,
      description: event.description,
      imageUrl: event.imageUrl,
      photos: event.photos.map((photo: PhotoType) => ({
        url: photo.url,
        publicId: photo.publicId,
        description: photo.description,
        uploadedAt: photo.uploadedAt,
      })),
    }));
  } catch (error) {
    console.error("Failed to fetch program events:", error);
    return [];
  }
}
