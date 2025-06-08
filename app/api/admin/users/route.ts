import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth.config";
import connectDB from "@/lib/db";
import { User } from "@/models/User";

// Get all users
export async function GET() {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    await connectDB();
    const users = await User.find({})
      .select("name email role createdAt")
      .lean();

    return NextResponse.json(users);
  } catch (error) {
    console.error("Errore durante il recupero degli utenti:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
}

// Update user role
export async function PATCH(request: Request) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const { userId, role } = await request.json();
    if (!userId || !role || !["user", "admin"].includes(role)) {
      return NextResponse.json(
        { error: "Dati della richiesta non validi" },
        { status: 400 }
      );
    }

    await connectDB();
    const result = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        { error: "Utente non trovato" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Errore durante l'aggiornamento del ruolo utente:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
}
