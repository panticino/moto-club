"use client";

import {
  Users,
  Calendar,
  MapPin,
  ChevronRight,
  Award,
  Heart,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui";

export function AboutContent() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary/10 via-primary/5 to-transparent py-16 sm:py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiNlZWVlZWUiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4K')]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container text-center px-4 sm:px-6"
        >
          <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6 text-xs sm:text-sm font-semibold tracking-wider text-primary uppercase rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
            Chi Siamo
          </span>
          <h1 className="mb-4 sm:mb-6">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
            >
              La Nostra Storia
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="block mt-2 text-xl sm:text-2xl font-medium text-muted-foreground"
            >
              Una comunità di motociclisti appassionati
            </motion.span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-2xl mx-auto mb-8 sm:mb-10 text-base sm:text-lg md:text-xl text-muted-foreground"
          >
            Fondato da appassionati di moto, MotoClub è cresciuto fino a
            diventare una vivace comunità dedicata a condividere la gioia di
            guidare e creare esperienze indimenticabili su due ruote. Non siamo
            solo un club, siamo una comunità.
          </motion.p>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="container px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              I Nostri Valori Fondamentali
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Ciò che ci spinge avanti e mantiene forte la nostra comunità
            </p>
          </motion.div>
          <div className="grid gap-4 sm:gap-6 md:gap-8 sm:grid-cols-2 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="card text-center p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 rounded-full bg-primary/10">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">
                Sicurezza Prima di Tutto
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Diamo priorità alla sicurezza in tutte le nostre attività,
                assicurando che ogni giro sia emozionante e sicuro.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="card text-center p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 rounded-full bg-primary/10">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">
                Passione
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Il nostro amore per le moto guida tutto ciò che facciamo,
                dall&apos;organizzazione degli eventi alla costruzione di
                relazioni.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="card text-center p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 rounded-full bg-primary/10">
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">
                Eccellenza
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Ci impegniamo per l&apos;eccellenza in ogni aspetto, dalla
                pianificazione dei percorsi al supporto dei membri.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-background to-secondary/5">
        <div className="container px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              Cosa Offriamo
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Vivi il meglio della vita in comunità motociclistica
            </p>
          </motion.div>
          <div className="grid gap-4 sm:gap-6 md:gap-8 sm:grid-cols-2 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="card text-center p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 rounded-full bg-primary/10">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">
                Comunità
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Unisciti a una comunità accogliente di motociclisti che
                condividono la tua passione per le moto e l&apos;avventura.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="card text-center p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 rounded-full bg-primary/10">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">
                Eventi Regolari
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Partecipa a giri organizzati, workshop e incontri sociali
                durante tutto l&apos;anno.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="card text-center p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 rounded-full bg-primary/10">
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">
                Percorsi Panoramici
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Scopri le strade più belle e i tesori nascosti della nostra
                regione attraverso percorsi accuratamente pianificati.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="card p-6 sm:p-8"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                Unisciti alla Nostra Comunità
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
                Pronto a far parte di qualcosa di speciale? Unisciti a MotoClub
                oggi e inizia il tuo viaggio con altri appassionati di moto.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <ButtonLink href="/contact" variant="default" className="group">
                  Inizia Ora
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </ButtonLink>
                <ButtonLink href="/program" variant="outline">
                  Vedi Programma
                </ButtonLink>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
