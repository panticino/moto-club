import { Metadata } from "next";
import { PhotoSessionManager } from "@/components/admin/PhotoSessionManager";
import { Camera } from "lucide-react";

export const metadata: Metadata = {
  title: "Gestione Foto - Pan European Club Ticino",
  description: "Carica e gestisci le foto degli eventi del club",
};

export default function AdminPhotosPage() {
  return (
    <div className="container max-w-6xl py-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-2 rounded-lg bg-primary/10">
          <Camera className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-bold">Gestione Foto</h1>
          <p className="text-lg text-muted-foreground">
            Carica e gestisci le foto degli eventi del club
          </p>
        </div>
      </div>
      <PhotoSessionManager />
    </div>
  );
}
