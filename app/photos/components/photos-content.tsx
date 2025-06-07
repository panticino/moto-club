"use client";

import Image from "next/image";
import { Camera, Home, Calendar, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { ButtonLink } from "@/components/ui";
import type { EventType } from "@/app/actions/events";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function PhotosContent({ events }: { events: EventType[] }) {
  const heroMotion: HTMLMotionProps<"div"> = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const emptyStateMotion: HTMLMotionProps<"div"> = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6 },
  };

  const photoMotion = (index: number): HTMLMotionProps<"a"> => ({
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, delay: index * 0.1 },
    whileHover: { scale: 1.02 },
  });

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary/10 via-primary/5 to-transparent py-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiNlZWVlZWUiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4K')]" />
        </div>
        <div className="container px-4">
          <motion.div {...heroMotion} className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 mb-6 text-sm font-semibold tracking-wider text-primary uppercase rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
              Galleria Fotografica
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Momenti Catturati
            </h1>
            <p className="text-lg text-muted-foreground">
              Rivivi i nostri fantastici giri ed eventi attraverso queste
              splendide fotografie
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16">
        <div className="container px-4">
          {events.length === 0 ? (
            <motion.div
              {...emptyStateMotion}
              className="max-w-2xl mx-auto p-8 text-center card backdrop-blur-sm bg-background/80"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-primary/10">
                <Camera className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Prossimamente</h2>
              <p className="text-muted-foreground mb-8">
                La nostra galleria fotografica è in fase di organizzazione.
                Torna presto per vedere i momenti più belli dei nostri giri ed
                eventi.
              </p>
              <ButtonLink
                href="/"
                variant="default"
                className="group relative overflow-hidden inline-flex"
              >
                <span className="relative z-10 flex items-center">
                  <Home className="w-5 h-5 mr-2" />
                  Torna alla Home
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
              </ButtonLink>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-12 max-w-7xl mx-auto"
            >
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  className="card hover:shadow-xl transition-all duration-300 p-6 backdrop-blur-sm bg-background/80"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                        <Camera className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                          {event.name}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {event.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Data Evento</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>Luogo</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{event.photos?.length || 0} Foto</span>
                      </div>
                    </div>
                  </div>

                  {!event.photos?.length ? (
                    <p className="text-muted-foreground italic text-center py-8">
                      Nessuna foto disponibile per questo evento.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {event.photos.map((photo, photoIndex) => (
                        <motion.a
                          href={photo.url}
                          key={photoIndex}
                          target="_blank"
                          rel="noopener noreferrer"
                          {...photoMotion(photoIndex)}
                          className={cn(
                            "block aspect-square overflow-hidden rounded-lg group relative",
                            "shadow-sm hover:shadow-lg transition-all duration-300"
                          )}
                        >
                          <Image
                            src={photo.url}
                            alt={`Photo from ${event.name}`}
                            width={400}
                            height={400}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            unoptimized
                            key={photo.url}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.a>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <ButtonLink
              href="/"
              variant="outline"
              className="group hover:bg-secondary/10 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Torna alla Home
            </ButtonLink>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
