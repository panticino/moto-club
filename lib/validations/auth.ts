import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Indirizzo email non valido"),
  password: z.string().min(6, "La password deve contenere almeno 6 caratteri"),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, "Il nome deve contenere almeno 2 caratteri"),
    email: z.string().email("Indirizzo email non valido"),
    password: z
      .string()
      .min(6, "La password deve contenere almeno 6 caratteri"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Le password non corrispondono",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
