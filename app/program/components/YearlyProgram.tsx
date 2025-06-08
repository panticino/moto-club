"use client";

import { motion } from "framer-motion";
import { ProgramEvent } from "@/app/actions/program";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  CalendarDays,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { parse, startOfDay, format } from "date-fns";
import { it } from "date-fns/locale";

declare module "react" {
  interface IntrinsicElements {
    h3: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLHeadingElement>,
      HTMLHeadingElement
    >;
    h4: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLHeadingElement>,
      HTMLHeadingElement
    >;
    p: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLParagraphElement>,
      HTMLParagraphElement
    >;
    span: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLSpanElement>,
      HTMLSpanElement
    >;
  }
}

const MONTHS = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

const eventTypeIcons: Record<ProgramEvent["type"], string> = {
  gita: "🏍️",
  riunione: "🤝",
  workshop: "🔧",
  sociale: "🎉",
  altro: "📌",
};

interface YearlyProgramProps {
  year: number;
  events: ProgramEvent[];
}

export function YearlyProgram({ events }: YearlyProgramProps) {
  const sortedEvents = events.sort((a, b) => {
    const dateA = startOfDay(parse(a.date, "yyyy-MM-dd", new Date()));
    const dateB = startOfDay(parse(b.date, "yyyy-MM-dd", new Date()));
    return dateA.getTime() - dateB.getTime();
  });

  const groupedEvents = sortedEvents.reduce((acc, event) => {
    const date = startOfDay(parse(event.date, "yyyy-MM-dd", new Date()));
    const month = date.getMonth();
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(event);
    return acc;
  }, {} as Record<number, ProgramEvent[]>);

  const formatDate = (dateStr: string) => {
    const date = parse(dateStr, "yyyy-MM-dd", new Date());
    return format(date, "d MMMM yyyy", { locale: it });
  };

  const getEventTypeColor = (type: ProgramEvent["type"]) => {
    switch (type) {
      case "gita":
        return "bg-green-500/10 text-green-500";
      case "riunione":
        return "bg-blue-500/10 text-blue-500";
      case "workshop":
        return "bg-purple-500/10 text-purple-500";
      case "sociale":
        return "bg-yellow-500/10 text-yellow-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const getEventStatusColor = (status: ProgramEvent["status"]) => {
    switch (status) {
      case "programmato":
        return "bg-blue-500/10 text-blue-500";
      case "annullato":
        return "bg-destructive/10 text-destructive";
      case "completato":
        return "bg-green-500/10 text-green-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8 grid gap-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {Array.from({ length: 12 }, (_, i) => i).map((month) => {
        const monthEvents = groupedEvents[month] || [];
        if (monthEvents.length === 0) return null;

        return (
          <motion.div key={month} variants={item}>
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/50 flex flex-row items-center gap-2 py-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <CalendarDays className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{MONTHS[month]}</h3>
                <Badge variant="secondary" className="ml-auto">
                  {monthEvents.length}{" "}
                  {monthEvents.length === 1 ? "evento" : "eventi"}
                </Badge>
              </CardHeader>
              <CardContent className="grid gap-4 p-6">
                {monthEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    className={cn(
                      "p-4 rounded-lg border bg-card hover:bg-accent transition-colors",
                      event.status === "annullato" && "opacity-75"
                    )}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="secondary"
                          className={cn(getEventTypeColor(event.type))}
                        >
                          <span className="mr-1">
                            {eventTypeIcons[event.type]}
                          </span>
                          {event.type === "gita"
                            ? "Giro"
                            : event.type === "riunione"
                            ? "Riunione"
                            : event.type === "workshop"
                            ? "Officina"
                            : event.type === "sociale"
                            ? "Sociale"
                            : "Altro"}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={cn(getEventStatusColor(event.status))}
                        >
                          {event.status === "programmato"
                            ? "Programmato"
                            : event.status === "annullato"
                            ? "Annullato"
                            : event.status === "completato"
                            ? "Completato"
                            : "In Sospeso"}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold mb-2">
                          {event.title}
                        </h4>
                        {event.description && (
                          <p className="text-sm text-muted-foreground mb-4">
                            {event.description}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>
                            {event.date && formatDate(event.date)}
                            {event.endDate && (
                              <>
                                <span className="mx-1">-</span>
                                {formatDate(event.endDate)}
                              </>
                            )}
                          </span>
                        </div>
                        {event.time && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>{event.time}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.maxParticipants && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" />
                            <span>
                              Max {event.maxParticipants} partecipanti
                            </span>
                          </div>
                        )}
                        {event.memberName && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" />
                            <span>{event.memberName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
