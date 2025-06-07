"use client";

import { useEffect, useState } from "react";
import { getPrograms } from "@/app/actions/program";
import { YearlyProgram } from "@/app/actions/program";
import { ProgramFileManager } from "@/components/admin/YearlyProgramManager";
import { ProgramManager } from "@/components/admin/ProgramManager";
import { CreateProgramDialog } from "@/components/admin/CreateProgramDialog";
import { ProgramPDFDownload } from "@/components/admin/ProgramPDF";
import { Loader2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function AdminProgramPage() {
  const [programs, setPrograms] = useState<YearlyProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const data = await getPrograms();
        setPrograms(data);
      } catch (error) {
        console.error("Impossibile recuperare i programmi:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPrograms();
  }, []);

  const handleProgramCreated = async () => {
    try {
      const data = await getPrograms();
      setPrograms(data);
    } catch (error) {
      console.error("Impossibile aggiornare i programmi:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">
            Caricamento programmi...
          </p>
        </div>
      </div>
    );
  }

  const currentProgram = programs.find((p) => p.isActive);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Gestione Programmi
        </h1>
        <div className="flex items-center gap-2">
          {currentProgram && <ProgramPDFDownload program={currentProgram} />}
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Crea Programma
          </Button>
        </div>
      </div>

      <Tabs defaultValue="events" className="space-y-6">
        <TabsList>
          <TabsTrigger value="events">Eventi</TabsTrigger>
          <TabsTrigger value="files">File Programma</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
          {programs.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-3">
                  <h3 className="text-lg font-medium">
                    Nessun Programma Trovato
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Inizia creando un nuovo programma. Potrai aggiungere e
                    gestire gli eventi qui.
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Crea Programma
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            programs.map((program) => (
              <Card key={program.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Programma {program.year}</CardTitle>
                  <ProgramPDFDownload program={program} />
                </CardHeader>
                <CardContent>
                  <ProgramManager
                    programs={programs}
                    setPrograms={setPrograms}
                  />
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle>File dei Programmi</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgramFileManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateProgramDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleProgramCreated}
      />
    </div>
  );
}
