"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteEvent } from "@/app/actions/program";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import type { ProgramEvent } from "@/app/actions/program";

interface DeleteEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: ProgramEvent | undefined;
  onSuccess?: () => void;
}

export function DeleteEventDialog({
  open,
  onOpenChange,
  event,
  onSuccess,
}: DeleteEventDialogProps) {
  if (!event) {
    return null;
  }

  const handleDelete = async () => {
    try {
      const success = await deleteEvent(
        new Date(event.date).getFullYear(),
        event.id!
      );
      if (success) {
        toast.success("Completato", {
          description: "Evento eliminato con successo",
        });
        onSuccess?.();
        onOpenChange(false);
      } else {
        throw new Error("Impossibile eliminare l&apos;evento");
      }
    } catch (error) {
      console.error(
        "Errore durante l&apos;eliminazione dell&apos;evento:",
        error
      );
      toast.error("Errore", {
        description:
          error instanceof Error
            ? error.message
            : "Impossibile eliminare l&apos;evento",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Elimina Evento
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div className="space-y-2">
              <div>
                Sei sicuro di voler eliminare l&apos;evento:
                <span className="font-medium text-foreground block mt-1">
                  {event.title}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Questa azione non può essere annullata. L&apos;evento verrà
                rimosso permanentemente dal programma.
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annulla</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Elimina Evento
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
