"use client";

/// <reference types="react" />
import * as React from "react";
import type { ReactElement } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";
import type {
  FormData,
  FormFieldProps,
  TextAreaProps,
} from "@/types/components";

const FormField = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormFieldProps
>(({ label, isTextArea, className, id, ...props }, ref): ReactElement => {
  if (isTextArea) {
    return (
      <div className="form-field">
        <label
          htmlFor={id}
          className="text-sm sm:text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          id={id}
          className={cn(
            "input-field mt-2 sm:mt-3",
            "flex w-full rounded-lg border border-input bg-background px-3 sm:px-4 py-2 sm:py-3",
            "text-sm sm:text-base placeholder:text-muted-foreground/50",
            "ring-offset-background",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-colors duration-200",
            "min-h-[120px] sm:min-h-[140px] md:min-h-[160px] resize-none",
            className
          )}
          rows={4}
          {...(props as unknown as TextAreaProps)}
        />
      </div>
    );
  }

  return (
    <div className="form-field">
      <label
        htmlFor={id}
        className="text-sm sm:text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
      <input
        ref={ref as React.Ref<HTMLInputElement>}
        id={id}
        type={props.type}
        className={cn(
          "input-field mt-2 sm:mt-3",
          "flex w-full rounded-lg border border-input bg-background px-3 sm:px-4 py-2 sm:py-3",
          "text-sm sm:text-base placeholder:text-muted-foreground/50",
          "ring-offset-background",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-colors duration-200",
          "h-10 sm:h-11 md:h-12",
          className
        )}
        {...props}
      />
    </div>
  );
});

FormField.displayName = "FormField";

export function ContactForm(): ReactElement {
  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [status, setStatus] = React.useState<"success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Reset status when user starts typing again
      if (status) setStatus(null);
      if (errorMessage) setErrorMessage(null);
    },
    [status, errorMessage]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);
    setErrorMessage(null);

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage("Per favore, compila tutti i campi.");
      setIsLoading(false);
      return;
    }

    // Basic email format validation
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Per favore, inserisci un indirizzo email valido.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "0ccb659d-662d-44d6-b2f4-81ad81311a01",
          ...formData,
          subject: "Nuovo Messaggio dal Form di Contatto - Moto Club",
          from_name: formData.name,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error(data.message || "Impossibile inviare il messaggio.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Si è verificato un errore imprevisto."
      );
      console.error("Errore nell'invio del form di contatto:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formMotion: HTMLMotionProps<"form"> = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.4 },
  };

  const fieldMotion = (delay: number): HTMLMotionProps<"div"> => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay },
  });

  const statusMotion: HTMLMotionProps<"div"> = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8"
      {...formMotion}
    >
      <div className="space-y-3 sm:space-y-4">
        <motion.div {...fieldMotion(0.1)}>
          <FormField
            id="name"
            name="name"
            label="Nome"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Il tuo nome"
            disabled={isLoading}
            className="text-sm sm:text-base"
          />
        </motion.div>
        <motion.div {...fieldMotion(0.2)}>
          <FormField
            id="email"
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tua.email@esempio.com"
            disabled={isLoading}
            className="text-sm sm:text-base"
          />
        </motion.div>
        <motion.div {...fieldMotion(0.3)}>
          <FormField
            id="message"
            name="message"
            label="Messaggio"
            isTextArea
            value={formData.message}
            onChange={handleChange}
            placeholder="Scrivi il tuo messaggio qui..."
            disabled={isLoading}
            className="text-sm sm:text-base"
          />
        </motion.div>
      </div>

      <AnimatePresence>
        {(status || errorMessage) && (
          <motion.div
            {...statusMotion}
            className={cn(
              "p-3 sm:p-4 rounded-lg text-sm sm:text-base",
              status === "success"
                ? "bg-green-500/10 text-green-500"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {status === "success"
              ? "Messaggio inviato con successo! Ti risponderemo presto."
              : errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div {...fieldMotion(0.4)} className="pt-2 sm:pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3",
            "inline-flex items-center justify-center",
            "text-sm sm:text-base font-medium text-white",
            "bg-primary rounded-lg shadow-sm",
            "hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-primary focus-visible:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-colors duration-200"
          )}
        >
          {isLoading ? (
            <Spinner className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <>
              Invia Messaggio
              <Send className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </>
          )}
        </button>
      </motion.div>
    </motion.form>
  );
}
