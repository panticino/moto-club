"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, MapPin, Clock, Users, Loader2 } from "lucide-react";
import { getProgram } from "@/app/actions/program";
import { ProgramEventDialog } from "./ProgramEventDialog";
import type { ProgramEvent, YearlyProgram } from "@/app/actions/program";
import { DeleteEventDialog } from "./DeleteEventDialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const eventTypeIcons: Record<ProgramEvent["type"], string> = {
  gita: "🏍️",
  riunione: "🤝",
  workshop: "🔧",
  sociale: "🎉",
  altro: "📌",
};

const statusStyles: Record<
  ProgramEvent["status"],
  { color: string; bg: string }
> = {
  programmato: { color: "text-blue-500", bg: "bg-blue-500/10" },
  annullato: { color: "text-destructive", bg: "bg-destructive/10" },
  completato: { color: "text-green-500", bg: "bg-green-500/10" },
};

const statusLabels: Record<ProgramEvent["status"], string> = {
  programmato: "Programmato",
  annullato: "Annullato",
  completato: "Completato",
};

interface ProgramEventListProps {
  program: YearlyProgram;
}

export function ProgramEventList({ program }: ProgramEventListProps) {
  const router = useRouter();
  const [events, setEvents] = useState<ProgramEvent[]>(program.events);
  const [selectedEvent, setSelectedEvent] = useState<
    ProgramEvent | undefined
  >();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<ProgramEvent | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getProgram(program.year);
      if (data) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error("Impossibile caricare gli eventi:", error);
    } finally {
      setIsLoading(false);
    }
  }, [program.year]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Subscribe to route changes and handle revalidation
  useEffect(() => {
    router.prefetch("/admin/program");
  }, [router]);

  const handleEdit = (event: ProgramEvent) => {
    setSelectedEvent(event);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (event: ProgramEvent) => {
    setEventToDelete(event);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
    setEventToDelete(undefined);
  };

  const handleSuccess = useCallback(() => {
    router.refresh();
    loadEvents();
  }, [loadEvents, router]);

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat("it-IT", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const EventCard = ({ event }: { event: ProgramEvent }) => (
    <Card className="group">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-primary">
                {formatDate(event.date)}
                {event.endDate && (
                  <>
                    <span className="mx-1">-</span>
                    {formatDate(event.endDate)}
                  </>
                )}
              </div>
              {event.time && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {event.time}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={cn(
                  "flex items-center gap-1",
                  statusStyles[event.status].color,
                  statusStyles[event.status].bg
                )}
              >
                {statusLabels[event.status]}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-medium">{event.title}</div>
            {event.description && (
              <div className="text-sm text-muted-foreground line-clamp-2">
                {event.description}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="text-lg" role="img" aria-label={event.type}>
                {eventTypeIcons[event.type]}
              </span>
              {event.type}
            </div>
            {event.memberName && (
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {event.memberName}
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {event.location}
              </div>
            )}
            {event.maxParticipants && (
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" /> Max: {event.maxParticipants}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(event)}
              className="h-8"
            >
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">Modifica evento</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(event)}
              className="h-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Elimina evento</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center space-y-2">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Caricamento eventi...</p>
        </div>
      </div>
    );
  }

  const EmptyState = () => (
    <div className="text-center space-y-3">
      <h3 className="text-lg font-medium">Nessun Evento Programmato</h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
        Non ci sono eventi programmati per questo periodo. Aggiungi un nuovo
        evento per iniziare.
      </p>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Mobile View */}
      <div className="block md:hidden space-y-4">
        {events.length === 0 ? (
          <EmptyState />
        ) : (
          events.map((event) => <EventCard key={event.id} event={event} />)
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Data</TableHead>
              <TableHead>Dettagli Evento</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState />
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow
                  key={event.id}
                  className="group hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium">
                    <div className="space-y-1">
                      <div className="text-primary">
                        {formatDate(event.date)}
                        {event.endDate && (
                          <>
                            <span className="mx-1">-</span>
                            {formatDate(event.endDate)}
                          </>
                        )}
                      </div>
                      {event.time && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {event.time}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="font-medium">{event.title}</div>
                      {event.description && (
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {event.description}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        {event.memberName && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {event.memberName}
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {event.location}
                          </div>
                        )}
                        {event.maxParticipants && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" /> Max:{" "}
                            {event.maxParticipants}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-lg"
                        role="img"
                        aria-label={event.type}
                      >
                        {eventTypeIcons[event.type]}
                      </span>
                      {event.type}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "flex items-center gap-1",
                        statusStyles[event.status].color,
                        statusStyles[event.status].bg
                      )}
                    >
                      {statusLabels[event.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(event)}
                        className="h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit2 className="h-4 w-4" />
                        <span className="sr-only">Modifica evento</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(event)}
                        className="h-8 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Elimina evento</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ProgramEventDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        year={program.year}
        event={selectedEvent}
        onSuccess={handleSuccess}
      />

      <DeleteEventDialog
        open={isDeleteDialogOpen}
        onOpenChange={handleDeleteDialogClose}
        event={eventToDelete}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
