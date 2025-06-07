import { ArrowDown, Calendar, ArrowRight, Users } from "lucide-react";
import { getCurrentYearProgram } from "@/app/actions/program";
import { getYearlyProgramUrl } from "@/app/actions/config";
import { ButtonLink } from "@/components/ui";

export default async function HomePage() {
  const program = await getCurrentYearProgram();
  const yearlyProgramUrl = await getYearlyProgramUrl();

  // Get the first 3 upcoming events from the program
  const events =
    program?.events
      ?.filter((event) => {
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventDate >= today;
      })
      ?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      ?.slice(0, 3) || [];

  // Helper function to get event title
  const getEventTitle = (event: { title: string }) => event.title || "Event";

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary/10 to-transparent py-12 sm:py-16 md:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiNlZWVlZWUiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4K')]" />
        </div>
        <div className="container text-center px-4 sm:px-6 md:px-8">
          <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6 text-xs sm:text-sm font-semibold tracking-wider text-primary uppercase rounded-full bg-primary/10">
            Benvenuti al MotoClub
          </span>
          <h1 className="mb-4 sm:mb-6">
            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight">
              Guida con Passione
            </span>
            <span className="block mt-2 text-lg sm:text-xl md:text-2xl font-medium text-muted-foreground">
              Esplora il mondo su due ruote
            </span>
          </h1>
          <p className="max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground">
            Unisciti alla nostra comunità di appassionati di moto. Vivi giri
            emozionanti, incontra altri motociclisti e crea ricordi
            indimenticabili sulla strada aperta.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <ButtonLink
              href="#program"
              variant="default"
              className="group w-full sm:w-auto"
            >
              Vedi Programma
              <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform group-hover:translate-y-0.5" />
            </ButtonLink>
            <ButtonLink
              href="#events"
              variant="outline"
              className="w-full sm:w-auto"
            >
              Prossimi Eventi
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Yearly Program Section */}
      <section
        id="program"
        className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-background/50 to-background"
      >
        <div className="container px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-6 rounded-full bg-primary/10">
              <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              La Tua Avventura Ti Aspetta
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-base sm:text-lg text-muted-foreground">
              Scopri un anno pieno di giri emozionanti, incontri sociali e
              momenti indimenticabili. Da percorsi panoramici a sentieri
              tecnici, abbiamo creato esperienze diverse per motociclisti di
              tutti i livelli.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {yearlyProgramUrl ? (
                <ButtonLink
                  href={yearlyProgramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="default"
                  className="group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                >
                  Scarica Programma (PDF)
                  <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform group-hover:translate-y-0.5" />
                </ButtonLink>
              ) : null}
              <ButtonLink
                href="/program"
                variant={yearlyProgramUrl ? "outline" : "default"}
                className="group"
              >
                Esplora Programma Completo
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </ButtonLink>
            </div>
            <div className="mt-12 pt-12 border-t border-border/60">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Giri Regolari</h3>
                  <p className="text-sm text-muted-foreground">
                    Giri di gruppo settimanali per tutti i livelli
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    Eventi Speciali
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Giornate in pista, workshop e incontri sociali
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Tour Lunghi</h3>
                  <p className="text-sm text-muted-foreground">
                    Avventure di più giorni verso destinazioni emozionanti
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section id="events" className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container px-4 sm:px-6 md:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Prossimi Eventi
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              Unisciti alla nostra prossima avventura. Scopri cosa ci aspetta!
            </p>
          </div>

          {events.length > 0 ? (
            <div className="max-w-2xl mx-auto divide-y divide-border/60">
              {events.map((event) => {
                const eventTitle = getEventTitle(event);
                const eventDate = new Date(event.date);

                return (
                  <div
                    key={event.id}
                    className="group py-8 first:pt-0 last:pb-0 transition-colors hover:bg-muted/5 -mx-4 px-4 rounded-lg"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary">
                          <Calendar className="h-3.5 w-3.5" />
                          <time
                            dateTime={event.date}
                            className="text-xs uppercase tracking-wider"
                          >
                            {eventDate.toLocaleDateString("it-IT", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </time>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                        {eventTitle}
                      </h3>
                      {event.description && (
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 px-4 rounded-lg border border-dashed">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-sm sm:text-base text-muted-foreground">
                Nessun evento in programma. Torna a trovarci presto!
              </p>
            </div>
          )}

          <div className="mt-12 sm:mt-16 text-center">
            <ButtonLink
              href="/program"
              variant="default"
              className="group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            >
              Vedi Programma Completo
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-background" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQ4YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnptMC0xMmMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="container relative px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-background to-background/80 shadow-2xl">
              <div className="absolute inset-0 bg-grid-white/5" />
              <div className="relative p-8 sm:p-10 md:p-12 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 mb-6 rounded-full bg-primary/10">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                  Unisciti alla Nostra Comunità
                </h2>
                <p className="max-w-2xl mx-auto mb-8 text-base sm:text-lg text-muted-foreground">
                  Che tu sia un motociclista esperto o stia iniziando ora,
                  c&apos;è un posto per te nella nostra comunità. Connettiti con
                  altri appassionati, condividi esperienze e fai parte di
                  qualcosa di straordinario.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <ButtonLink
                    href="/contact"
                    variant="default"
                    className="group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                  >
                    Contattaci
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </ButtonLink>
                  <ButtonLink
                    href="/about"
                    variant="outline"
                    className="group border-primary/20 hover:border-primary/40"
                  >
                    Scopri di Più
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </ButtonLink>
                </div>
                <div className="mt-10 pt-8 border-t border-border/10">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                        200+
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Membri Attivi
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                        50+
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Eventi all&apos;Anno
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                        15+
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Anni di Attività
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
