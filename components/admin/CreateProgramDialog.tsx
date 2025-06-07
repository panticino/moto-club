"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createProgram } from "@/app/actions/program";
import { toast } from "sonner";
import { format, startOfDay } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/datepicker.css";
import { it } from "date-fns/locale";

const formSchema = z
  .object({
    year: z.number().min(2024).max(2100),
    event: z.object({
      title: z.string().min(1, "Il titolo è obbligatorio"),
      startDate: z.date({
        required_error: "La data di inizio è obbligatoria",
      }),
      endDate: z
        .date({
          required_error: "La data di fine è obbligatoria",
        })
        .optional(),
      time: z.string().optional(),
      location: z.string().optional(),
      description: z.string().optional(),
      type: z.enum(["gita", "riunione", "workshop", "sociale", "altro"]),
      status: z.enum(["programmato", "annullato", "completato"]),
      maxParticipants: z.number().optional(),
      memberName: z.string().optional(),
    }),
  })
  .refine(
    (data) => {
      if (!data.event.endDate) return true;
      const startDate = startOfDay(data.event.startDate);
      const endDate = startOfDay(data.event.endDate);
      return endDate >= startDate;
    },
    {
      message:
        "La data di fine deve essere uguale o successiva alla data di inizio",
      path: ["event.endDate"],
    }
  );

type FormValues = z.infer<typeof formSchema>;

interface CreateProgramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateProgramDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateProgramDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentYear = new Date().getFullYear();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: currentYear,
      event: {
        title: "",
        startDate: new Date(),
        endDate: undefined,
        time: "",
        location: "",
        description: "",
        type: "gita",
        status: "programmato",
        maxParticipants: undefined,
        memberName: "",
      },
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await createProgram(data.year, {
        ...data.event,
        date: format(startOfDay(data.event.startDate), "yyyy-MM-dd"),
        endDate: data.event.endDate
          ? format(startOfDay(data.event.endDate), "yyyy-MM-dd")
          : undefined,
      });

      if (result.error) {
        toast.error("Errore", {
          description: result.error,
        });
        return;
      }

      if (result.program) {
        toast.success("Completato", {
          description: "Il programma è stato creato con successo",
        });
        form.reset();
        onOpenChange(false);
        onSuccess?.();
        // Force a hard refresh of the page
        window.location.reload();
      }
    } catch (error) {
      toast.error("Errore", {
        description:
          "Si è verificato un errore durante la creazione del programma",
      });
      console.error("Errore durante la creazione del programma:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Crea Nuovo Programma</DialogTitle>
          <DialogDescription>
            Crea un nuovo programma annuale con un evento iniziale
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 pb-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              id="program-form"
            >
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anno</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={2024}
                        max={2100}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="font-medium">Dettagli Evento Iniziale</div>

                <FormField
                  control={form.control}
                  name="event.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titolo</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="event.startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data di Inizio</FormLabel>
                        <FormControl>
                          <DatePicker
                            selected={field.value}
                            onChange={(date: Date | null) => {
                              if (date) {
                                const startDate = startOfDay(date);
                                field.onChange(startDate);
                                // If end date is before new start date, update it
                                const endDate = form.getValues("event.endDate");
                                if (endDate && endDate < startDate) {
                                  form.setValue("event.endDate", startDate);
                                }
                              }
                            }}
                            dateFormat="d MMMM yyyy"
                            locale={it}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="event.endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data di Fine (Opzionale)</FormLabel>
                        <FormControl>
                          <DatePicker
                            selected={field.value}
                            onChange={(date: Date | null) => {
                              if (date) {
                                field.onChange(startOfDay(date));
                              } else {
                                field.onChange(undefined);
                              }
                            }}
                            minDate={form.getValues("event.startDate")}
                            dateFormat="d MMMM yyyy"
                            locale={it}
                            isClearable
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="event.time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Orario (opzionale)</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="event.type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona il tipo di evento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="gita">Gita</SelectItem>
                          <SelectItem value="riunione">Riunione</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="sociale">Sociale</SelectItem>
                          <SelectItem value="altro">Altro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="event.location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Luogo (opzionale)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="event.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrizione (opzionale)</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="event.maxParticipants"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Numero Massimo Partecipanti (opzionale)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="event.memberName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Membro (opzionale)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter className="px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Annulla
          </Button>
          <Button type="submit" form="program-form" disabled={isSubmitting}>
            Crea Programma
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
