import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="container flex min-h-screen flex-col items-center justify-center px-4 sm:px-6">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Crea un account
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Inserisci i tuoi dati per creare un account
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
