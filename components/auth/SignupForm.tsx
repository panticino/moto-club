"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormData } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: SignupFormData) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Registrazione fallita");
      }

      toast.success("Account creato con successo!");
      router.push("/auth/login?registered=true");
    } catch (error) {
      console.error("Errore durante la registrazione:", error);
      if (error instanceof Error) {
        if (error.message === "Utente già esistente") {
          toast.error("Esiste già un account con questa email");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Qualcosa è andato storto. Riprova più tardi.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Nome</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Mario Rossi"
                    className="h-10 sm:h-11 text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="nome@esempio.com"
                    type="email"
                    className="h-10 sm:h-11 text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Inserisci la tua password"
                    type="password"
                    className="h-10 sm:h-11 text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base">
                  Conferma Password
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Conferma la tua password"
                    type="password"
                    className="h-10 sm:h-11 text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />
          <Button
            className="w-full h-10 sm:h-11 text-base"
            type="submit"
            disabled={isLoading}
          >
            {isLoading && <Spinner size="sm" className="mr-2" />}
            Crea Account
          </Button>
        </form>
      </Form>
      <div className="relative py-2 sm:py-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs sm:text-sm uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            O continua con
          </span>
        </div>
      </div>
      <div className="text-sm sm:text-base text-center">
        Hai già un account?{" "}
        <Link href="/auth/login" className="underline hover:text-primary">
          Accedi
        </Link>
      </div>
    </div>
  );
}
