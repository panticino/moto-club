"use client";

import { useState, useEffect } from "react";
import { FileUploader } from "./FileUploader";
import {
  getEvents,
  addEvent,
  addPhotoToEvent,
  deleteEvent,
  type Photo,
  type EventType as Event,
} from "@/app/actions/events";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Trash2,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export function PhotoSessionManager() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newEventName, setNewEventName] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const eventsData = await getEvents();
        setEvents(eventsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Impossibile caricare gli eventi"
        );
        console.error("Errore nel caricamento degli eventi:", err);
        toast.error("Impossibile caricare gli eventi");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const handleAddEvent = async () => {
    if (!newEventName || !newEventDate) {
      setError("Il nome e la data dell'evento sono obbligatori.");
      toast.error("Il nome e la data dell'evento sono obbligatori");
      return;
    }
    setError(null);

    try {
      const addedEvent = await addEvent({
        title: newEventName,
        name: newEventName,
        date: newEventDate,
      });
      setEvents((prevEvents) => [...prevEvents, addedEvent]);
      setNewEventName("");
      setNewEventDate("");
      toast.success("Evento aggiunto con successo");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Impossibile aggiungere l'evento"
      );
      console.error("Errore nell'aggiunta dell'evento:", err);
      toast.error("Impossibile aggiungere l'evento");
    }
  };

  const handleAddPhoto = async (data: { url: string; publicId: string }) => {
    if (!selectedEventId) {
      setError("Seleziona un evento a cui aggiungere le foto.");
      toast.error("Seleziona un evento a cui aggiungere le foto");
      return;
    }
    setError(null);

    const photo: Photo = {
      url: data.url,
      publicId: data.publicId,
      uploadedAt: new Date(),
    };

    try {
      const updatedEvent = await addPhotoToEvent(selectedEventId, photo);
      if (updatedEvent) {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === updatedEvent.id ? updatedEvent : event
          )
        );
        toast.success("Foto aggiunta con successo");
      } else {
        setError("Evento selezionato non trovato.");
        toast.error("Evento selezionato non trovato");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Impossibile aggiungere la foto"
      );
      console.error("Errore nell'aggiunta della foto:", err);
      toast.error("Impossibile aggiungere la foto");
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    // Show loading toast
    const loadingToast = toast.loading("Eliminazione evento in corso...");

    try {
      const success = await deleteEvent(eventId);
      if (success) {
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== eventId)
        );
        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success("Evento eliminato con successo");
      } else {
        // Dismiss loading toast and show error
        toast.dismiss(loadingToast);
        setError("Impossibile eliminare l'evento: Evento non trovato.");
        toast.error("Impossibile eliminare l'evento: Evento non trovato");
      }
    } catch (err) {
      // Dismiss loading toast and show error
      toast.dismiss(loadingToast);
      setError(
        err instanceof Error ? err.message : "Impossibile eliminare l'evento"
      );
      console.error("Errore nell'eliminazione dell'evento:", err);
      toast.error("Impossibile eliminare l'evento");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-6">
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        {/* Add New Event Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-full bg-primary/10">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Aggiungi Nuovo Evento</CardTitle>
                <CardDescription>
                  Crea una nuova sessione fotografica per un evento
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <Input
                type="text"
                placeholder="Nome Evento"
                value={newEventName}
                onChange={(e) => setNewEventName(e.target.value)}
              />
              <Input
                type="date"
                value={newEventDate}
                onChange={(e) => setNewEventDate(e.target.value)}
              />
            </div>
            <Button
              onClick={handleAddEvent}
              className="w-full"
              disabled={!newEventName || !newEventDate}
            >
              Aggiungi Evento
            </Button>
          </CardContent>
        </Card>

        {/* Upload Photos Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-full bg-primary/10">
                <ImageIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Carica Foto</CardTitle>
                <CardDescription>
                  Seleziona un evento e carica le foto
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={selectedEventId || ""}
              onValueChange={setSelectedEventId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona un evento" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title} ({format(new Date(event.date), "dd/MM/yyyy")})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <FileUploader onUploadSuccess={handleAddPhoto} />
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>Eventi Fotografici</CardTitle>
          <CardDescription>Gestisci gli eventi e le loro foto</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {events.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nessun evento trovato. Crea un nuovo evento per iniziare.
                </div>
              ) : (
                events.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Data: {format(new Date(event.date), "dd/MM/yyyy")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Foto: {event.photos?.length || 0}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Elimina evento</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
