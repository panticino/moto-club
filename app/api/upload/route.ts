import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const { file } = await request.json();

    if (!file) {
      return NextResponse.json({ error: "File mancante" }, { status: 400 });
    }

    // Upload to Cloudinary with optimizations
    const uploaded = await cloudinary.uploader.upload(file, {
      resource_type: "image",
      transformation: [
        { width: 1600, crop: "limit" }, // Max width for full size
        { quality: "auto:best" }, // Automatic quality optimization
        { fetch_format: "auto" }, // Automatic format optimization
      ],
      folder: "moto-club/events", // Organize uploads in folders
    });

    return NextResponse.json({
      success: true,
      data: {
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
        width: uploaded.width,
        height: uploaded.height,
      },
    });
  } catch (err: unknown) {
    console.error("Errore durante il caricamento:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Caricamento fallito" },
      { status: 500 }
    );
  }
}
