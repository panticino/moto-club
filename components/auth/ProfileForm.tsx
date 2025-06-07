"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import * as z from "zod";
import { Spinner } from "@/components/ui/spinner";

const profileSchema = z
  .object({
    name: z.string().min(2, "Il nome deve contenere almeno 2 caratteri"),
    email: z.string().email("Indirizzo email non valido"),
    currentPassword: z.string().min(1, "La password attuale è obbligatoria"),
    newPassword: z
      .string()
      .min(8, "La password deve contenere almeno 8 caratteri")
      .optional()
      .or(z.literal("")),
    confirmNewPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword !== data.confirmNewPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Le nuove password non corrispondono",
      path: ["confirmNewPassword"],
    }
  );

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const { data: session, update: updateSession } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  // Update form values when session data is available
  useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name || "",
        email: session.user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    }
  }, [session, form]);

  async function onSubmit(data: ProfileFormData) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Aggiornamento profilo fallito");
      }

      // Update session data
      if (session?.user) {
        await updateSession({
          ...session,
          user: {
            ...session.user,
            name: data.name,
            email: data.email,
          },
        });
      }

      toast.success("Profilo aggiornato con successo!");
      form.reset(data);
    } catch (error) {
      console.error("Errore durante l'aggiornamento del profilo:", error);
      if (error instanceof Error) {
        if (error.message === "Password attuale non valida") {
          toast.error("La password attuale non è corretta");
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Il tuo nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="tua.email@esempio.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Cambia Password
              </span>
            </div>
          </div>
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password Attuale</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Inserisci la password attuale"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nuova Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Inserisci la nuova password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conferma Nuova Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Conferma la nuova password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading && <Spinner size="sm" className="mr-2" />}
          Aggiorna Profilo
        </Button>
      </form>
    </Form>
  );
}
