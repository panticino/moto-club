import { ProfileForm } from "@/components/auth/ProfileForm";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth.config";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Profilo - Pan European Club Ticino",
  description: "Gestisci le impostazioni del tuo profilo",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/profile");
  }

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Impostazioni Profilo
          </h1>
          <p className="text-sm text-muted-foreground">
            Aggiorna le informazioni del tuo profilo
          </p>
        </div>
        <ProfileForm />
      </div>
    </div>
  );
}
