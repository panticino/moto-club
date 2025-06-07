import { Metadata } from "next";
import Link from "next/link";
import { User } from "@/models/User";
import connectDB from "@/lib/db";
import {
  Users,
  Calendar,
  Image as ImageIcon,
  ArrowRight,
  UserCog,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pannello di Amministrazione - Pan European Club Ticino",
  description:
    "Pannello di amministrazione per la gestione dei contenuti e degli utenti del club",
};

async function getUserStats() {
  try {
    await connectDB();
    const [totalUsers, adminCount] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: "admin" }),
    ]);
    const regularUsers = totalUsers - adminCount;

    return {
      totalUsers,
      adminCount,
      regularUsers,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return {
      totalUsers: 0,
      adminCount: 0,
      regularUsers: 0,
      error:
        error instanceof Error
          ? error.message
          : "Impossibile caricare le statistiche degli utenti",
    };
  }
}

export default async function AdminPage() {
  const { totalUsers, adminCount, regularUsers, error } = await getUserStats();

  return (
    <div className="container py-10 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">Pannello di Amministrazione</h1>
        <p className="text-muted-foreground">
          Gestisci i contenuti, i programmi e gli utenti del tuo club
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 text-destructive p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Totale Membri</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Totale utenti registrati
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Membri Regolari
            </CardTitle>
            <UserCheck className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regularUsers}</div>
            <p className="text-xs text-muted-foreground">
              Membri del club con accesso regolare
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Amministratori
            </CardTitle>
            <UserCog className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminCount}</div>
            <p className="text-xs text-muted-foreground">
              Membri con privilegi di amministratore
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Azioni Rapide
            </h2>
            <p className="text-sm text-muted-foreground">
              Accedi alle attività amministrative comuni
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/admin/program" className="block">
            <Card className="h-full transition-colors hover:bg-accent">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="w-8 h-8 text-primary" />
                  <div>
                    <CardTitle>Programma</CardTitle>
                    <CardDescription>
                      Gestisci gli eventi annuali
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Crea e modifica i programmi
                </span>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/photos" className="block">
            <Card className="h-full transition-colors hover:bg-accent">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-8 h-8 text-primary" />
                  <div>
                    <CardTitle>Foto</CardTitle>
                    <CardDescription>
                      Gestisci la galleria fotografica
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Carica e organizza le foto
                </span>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/users" className="block">
            <Card className="h-full transition-colors hover:bg-accent">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="w-8 h-8 text-primary" />
                  <div>
                    <CardTitle>Utenti</CardTitle>
                    <CardDescription>
                      Gestisci i membri del club
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Visualizza e gestisci i ruoli
                </span>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
