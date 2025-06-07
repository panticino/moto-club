import { LoginForm } from "@/components/auth/LoginForm";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
  return (
    <div className="container flex min-h-screen flex-col items-center justify-center px-4 sm:px-6">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Bentornato
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Inserisci le tue credenziali per accedere al tuo account
          </p>
        </div>
        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-[350px] sm:min-h-[400px]">
              <Spinner size="lg" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
