// Server Component
import { getCurrentYearProgram } from "@/app/actions/program";
import { YearlyProgram } from "./components/YearlyProgram";
import { Calendar, Users, MapPin } from "lucide-react";
import { ProgramDownloadButton } from "./components/ProgramDownloadButton";

export const revalidate = 3600; // Revalidate every hour

export default async function ProgramPage() {
  const program = await getCurrentYearProgram();

  if (!program || !program.isActive) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Programma Non Disponibile
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Il programma è in fase di aggiornamento. Si prega di controllare più
            tardi.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary/10 via-primary/5 to-transparent py-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiNlZWVlZWUiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4K')]" />
        </div>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 mb-6 text-sm font-semibold tracking-wider text-primary uppercase rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
              Programma
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Programma Annuale
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Visualizza il nostro programma completo di giri ed eventi per
              l&apos;anno
            </p>
            <ProgramDownloadButton program={program} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gradient-to-b from-background/50 to-background">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                icon: Calendar,
                title: "Eventi Regolari",
                description:
                  "Giri settimanali ed eventi speciali mensili durante tutto l&apos;anno",
              },
              {
                icon: Users,
                title: "Attività di Gruppo",
                description:
                  "Giri di gruppo organizzati e incontri sociali per tutti i membri",
              },
              {
                icon: MapPin,
                title: "Percorsi Diversificati",
                description:
                  "Percorsi accuratamente pianificati per diversi livelli di abilità e preferenze",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="card text-center p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-primary/10">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Content */}
      <div className="grid gap-8">
        <YearlyProgram year={program.year} events={program.events} />
      </div>
    </>
  );
}
