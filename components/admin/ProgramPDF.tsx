"use client";

import { format, parse } from "date-fns";
import { it } from "date-fns/locale";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import type { YearlyProgram } from "@/app/actions/program";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 30,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  eventSection: {
    marginBottom: 15,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  eventDetails: {
    fontSize: 12,
    marginBottom: 3,
  },
  separator: {
    borderBottom: "1px solid #ccc",
    marginVertical: 10,
  },
});

function ProgramDocument({ program }: { program: YearlyProgram }) {
  // Sort events by date
  const sortedEvents = [...program.events].sort(
    (a, b) =>
      parse(a.date, "yyyy-MM-dd", new Date()).getTime() -
      parse(b.date, "yyyy-MM-dd", new Date()).getTime()
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Programma Moto Club {program.year}</Text>
        </View>

        {sortedEvents.map((event, index) => (
          <View key={event.id} style={styles.eventSection}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventDetails}>
              {"Data: " +
                format(
                  parse(event.date, "yyyy-MM-dd", new Date()),
                  "d MMMM yyyy",
                  { locale: it }
                )}
              {event.endDate
                ? " - " +
                  format(
                    parse(event.endDate, "yyyy-MM-dd", new Date()),
                    "d MMMM yyyy",
                    { locale: it }
                  )
                : ""}
              {event.time ? " alle " + event.time : ""}
            </Text>
            {event.location && (
              <Text style={styles.eventDetails}>Luogo: {event.location}</Text>
            )}
            {event.description && (
              <Text style={styles.eventDetails}>
                Descrizione: {event.description}
              </Text>
            )}
            <Text style={styles.eventDetails}>
              Tipo:{" "}
              {
                {
                  gita: "Giro in Moto",
                  riunione: "Riunione",
                  workshop: "Officina",
                  sociale: "Evento Sociale",
                  altro: "Altro",
                }[event.type]
              }
            </Text>
            <Text style={styles.eventDetails}>
              Stato:{" "}
              {
                {
                  programmato: "Programmato",
                  annullato: "Annullato",
                  completato: "Completato",
                }[event.status]
              }
            </Text>
            {index < sortedEvents.length - 1 && (
              <View style={styles.separator} />
            )}
          </View>
        ))}
      </Page>
    </Document>
  );
}

// Dynamically import PDFDownloadLink to avoid SSR issues
const PDFDownload = dynamic(
  () =>
    Promise.resolve(({ program }: { program: YearlyProgram }) => (
      <PDFDownloadLink
        document={<ProgramDocument program={program} />}
        fileName={`moto-club-program-${program.year}.pdf`}
      >
        {({ loading }) => (
          <Button disabled={loading} variant="outline">
            <FileDown className="w-4 h-4 mr-2" />
            {loading ? "Generazione PDF..." : "Scarica PDF"}
          </Button>
        )}
      </PDFDownloadLink>
    )),
  { ssr: false }
);

export function ProgramPDFDownload({ program }: { program: YearlyProgram }) {
  return <PDFDownload program={program} />;
}
