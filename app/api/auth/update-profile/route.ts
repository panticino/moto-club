import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth.config";
import { NextResponse } from "next/server";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Devi essere autenticato" },
        { status: 401 }
      );
    }

    const { name, email, currentPassword, newPassword } = await req.json();

    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: "Utente non trovato" },
        { status: 404 }
      );
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Password attuale non corretta" },
        { status: 400 }
      );
    }

    // Update user data
    user.name = name;
    user.email = email;

    // Update password if provided
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
    }

    await user.save();

    return NextResponse.json(
      { message: "Profilo aggiornato con successo" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Errore durante l'aggiornamento del profilo:", error);
    return NextResponse.json(
      { error: "Impossibile aggiornare il profilo" },
      { status: 500 }
    );
  }
}
