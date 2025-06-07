"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  addEventToProgram,
  updateEvent,
  getProgram,
} from "@/app/actions/program";
import type { ProgramEvent } from "@/app/actions/program";
import { toast } from "sonner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/datepicker.css";
import { format, parse, startOfDay } from "date-fns";
import { it } from "date-fns/locale";

interface ProgramEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  year?: number;
  event?: ProgramEvent;
  isInitialEvent?: boolean;
  onEventCreate?: (event: Omit<ProgramEvent, "id">) => Promise<void>;
  onSuccess?: () => void;
  onSubmit?: (event: Omit<ProgramEvent, "id">) => Promise<void>;
}

export function ProgramEventDialog({
  open,
  onOpenChange,
  year,
  event,
  isInitialEvent,
  onEventCreate,
  onSuccess,
  onSubmit,
}: ProgramEventDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data
  const initializeFormData = (eventData?: ProgramEvent) => ({
    title: eventData?.title || "",
    date: eventData?.date
      ? format(
          startOfDay(parse(eventData.date, "yyyy-MM-dd", new Date())),
          "yyyy-MM-dd"
        )
      : format(startOfDay(new Date()), "yyyy-MM-dd"),
    endDate: eventData?.endDate
      ? format(
          startOfDay(parse(eventData.endDate, "yyyy-MM-dd", new Date())),
          "yyyy-MM-dd"
        )
      : undefined,
    time: eventData?.time || "",
    location: eventData?.location || "",
    description: eventData?.description || "",
    type: eventData?.type || "gita",
    status: eventData?.status || "programmato",
    maxParticipants: eventData?.maxParticipants,
    organizer: eventData?.organizer,
    memberName: eventData?.memberName || "",
  });

  const [formData, setFormData] = useState<Omit<ProgramEvent, "id">>(
    initializeFormData(event)
  );

  // Update form data when event prop changes
  useEffect(() => {
    if (open) {
      setFormData(initializeFormData(event));
    }
  }, [event, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
        toast.success("Evento salvato con successo");
        window.location.reload();
        onOpenChange(false);
        onSuccess?.();
        return;
      }

      if (!year) {
        throw new Error("Anno richiesto quando non si utilizza onSubmit");
      }

      // Check if program exists first
      const program = await getProgram(year);
      if (!program && !isInitialEvent) {
        throw new Error(
          `Nessun programma esistente per l'anno ${year}. Crea prima un programma.`
        );
      }

      let success = false;

      if (isInitialEvent && onEventCreate) {
        await onEventCreate(formData);
        success = true;
      } else if (event?.id) {
        const result = await updateEvent(year, event.id, formData);
        success = !!result;
      } else {
        const result = await addEventToProgram(year, formData);
        success = !!result;
      }

      if (success) {
        toast.success("Completato", {
          description: "Evento salvato con successo",
        });
        window.location.reload();
        onOpenChange(false);
        onSuccess?.();
      } else {
        throw new Error("Impossibile salvare l'evento");
      }
    } catch (error) {
      console.error("Impossibile salvare l'evento:", error);
      toast.error("Errore", {
        description:
          error instanceof Error
            ? error.message
            : "Impossibile salvare l'evento",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Convert string dates to Date objects for DatePicker
  const startDate = formData.date
    ? startOfDay(parse(formData.date, "yyyy-MM-dd", new Date()))
    : null;
  const endDate = formData.endDate
    ? startOfDay(parse(formData.endDate, "yyyy-MM-dd", new Date()))
    : null;

  return (
    <Dialog
      key={`dialog-${event?.id || "new"}`}
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          // Reset form data when dialog is closed
          setFormData(initializeFormData());
        }
        onOpenChange(newOpen);
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isInitialEvent
              ? "Crea Programma con Evento Iniziale"
              : event
              ? "Modifica Evento"
              : "Aggiungi Nuovo Evento"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titolo</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data Inizio</Label>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => {
                  if (date) {
                    const formattedDate = format(
                      startOfDay(date),
                      "yyyy-MM-dd"
                    );
                    setFormData((prev) => ({
                      ...prev,
                      date: formattedDate,
                      // If end date is before new start date, update it
                      endDate:
                        prev.endDate && prev.endDate < formattedDate
                          ? formattedDate
                          : prev.endDate,
                    }));
                  }
                }}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="d MMMM yyyy"
                locale={it}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <Label>Data Fine (Opzionale)</Label>
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => {
                  setFormData((prev) => ({
                    ...prev,
                    endDate: date
                      ? format(startOfDay(date), "yyyy-MM-dd")
                      : undefined,
                  }));
                }}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate || new Date()}
                dateFormat="d MMMM yyyy"
                locale={it}
                isClearable
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Orario (Opzionale)</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, time: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Luogo</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="memberName">Nome Membro</Label>
            <Input
              id="memberName"
              value={formData.memberName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, memberName: e.target.value }))
              }
              placeholder="Opzionale: Inserisci il nome del membro"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrizione</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: value as ProgramEvent["type"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gita">Giro in Moto</SelectItem>
                  <SelectItem value="riunione">Riunione</SelectItem>
                  <SelectItem value="workshop">Officina</SelectItem>
                  <SelectItem value="sociale">Sociale</SelectItem>
                  <SelectItem value="altro">Altro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Stato</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: value as ProgramEvent["status"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona stato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="programmato">Programmato</SelectItem>
                  <SelectItem value="annullato">Annullato</SelectItem>
                  <SelectItem value="completato">Completato</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxParticipants">Numero Massimo Partecipanti</Label>
            <Input
              id="maxParticipants"
              type="number"
              value={formData.maxParticipants || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  maxParticipants: parseInt(e.target.value) || undefined,
                }))
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annulla
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvataggio..." : event ? "Aggiorna" : "Crea"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
