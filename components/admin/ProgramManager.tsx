"use client";

import { Dispatch, SetStateAction, useState } from "react";
import {
  YearlyProgram,
  ProgramEvent,
  addEventToProgram,
} from "@/app/actions/program";
import { ProgramEventList } from "./ProgramEventList";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, AlertCircle } from "lucide-react";
import { ProgramEventDialog } from "./ProgramEventDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProgramManagerProps {
  programs: YearlyProgram[];
  setPrograms: Dispatch<SetStateAction<YearlyProgram[]>>;
}

export function ProgramManager({ programs, setPrograms }: ProgramManagerProps) {
  const currentYear = new Date().getFullYear();
  const currentProgram = programs.find((p) => p.year === currentYear);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddEvent = async (eventData: Omit<ProgramEvent, "id">) => {
    if (!currentProgram) return;

    try {
      const updatedProgram = await addEventToProgram(currentYear, eventData);
      if (updatedProgram) {
        setPrograms((prevPrograms) =>
          prevPrograms.map((p) => (p.year === currentYear ? updatedProgram : p))
        );
      }
    } catch (error) {
      console.error("Errore nell&apos;aggiunta dell&apos;evento:", error);
    }
  };

  if (!currentProgram) {
    return (
      <div className="p-4 md:p-6">
        <Alert variant="destructive" className="bg-destructive/5 border-none">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Nessun programma trovato per l&apos;anno {currentYear}. Crea un
            nuovo programma utilizzando la scheda File Programma.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-full bg-primary/10">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">
                    Programma {currentYear}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentProgram.events.length} eventi programmati
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="w-full sm:w-auto"
                size="lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi Evento
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-16rem)] rounded-md border-t">
            <div className="p-4 md:p-6">
              <ProgramEventList program={currentProgram} />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <ProgramEventDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        year={currentYear}
        onSubmit={handleAddEvent}
      />
    </div>
  );
}
