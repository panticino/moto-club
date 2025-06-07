"use client";

import {
  FileText,
  Home,
  ArrowDown,
  Calendar,
  Users,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui";

export function ProgramContent({
  yearlyProgramUrl,
}: {
  yearlyProgramUrl: string | null;
}) {
  const features = [
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
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary/10 via-primary/5 to-transparent py-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiNlZWVlZWUiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4K')]" />
        </div>
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-block px-4 py-2 mb-6 text-sm font-semibold tracking-wider text-primary uppercase rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
              Programma
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Programma Annuale
            </h1>
            <p className="text-lg text-muted-foreground">
              Visualizza il nostro programma completo di giri ed eventi per
              l&apos;anno
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container px-4">
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card text-center p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-primary/10">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Download Section */}
      <section className="py-16 bg-gradient-to-br from-background to-secondary/5">
        <div className="container px-4">
          {!yearlyProgramUrl ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto p-8 text-center card backdrop-blur-sm bg-background/80"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-primary/10">
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Programma in Arrivo</h2>
              <p className="text-muted-foreground mb-8">
                Il nostro programma annuale è in fase di finalizzazione. Si
                prega di controllare più tardi o contattarci per maggiori
                informazioni.
              </p>
              <ButtonLink
                href="/contact"
                variant="default"
                className="group relative overflow-hidden inline-flex"
              >
                <span className="relative z-10">Contattaci</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
              </ButtonLink>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <div className="card text-center p-8 backdrop-blur-sm bg-background/80">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-primary/10">
                  <FileText className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  Scarica il Programma
                </h2>
                <p className="mb-8 text-muted-foreground">
                  Ottieni il nostro programma annuale dettagliato in formato PDF
                  per rimanere aggiornato su tutti i prossimi giri ed eventi.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <ButtonLink
                    href={yearlyProgramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="default"
                    className="group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      Scarica Programma (PDF)
                      <ArrowDown className="w-5 h-5 ml-2 transition-transform group-hover:translate-y-0.5" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </ButtonLink>
                  <ButtonLink
                    href="/"
                    variant="outline"
                    className="group hover:bg-secondary/10 transition-colors"
                  >
                    <Home className="w-5 h-5 mr-2" />
                    Torna alla Home
                  </ButtonLink>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
