"use client";

import { ContactForm } from "@/components/ContactForm";
import { Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export function ContactContent() {
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
              Contatti
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Mettiti in Contatto
            </h1>
            <p className="text-lg text-muted-foreground">
              Hai domande o vuoi unirti? Ci piacerebbe sentirti!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-background">
        <div className="container px-4">
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="card text-center p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-primary/10">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Sede</h3>
              <p className="text-muted-foreground">
                Giuliano Ossola
                <br />
                C/C Pan European Club Ticino
                <br />
                CH-6616 Losone
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="card text-center p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-primary/10">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Email</h3>
              <p className="text-muted-foreground">
                <br />
                <a
                  href="mailto:panclubticino24@gmail.com"
                  className="hover:text-primary transition-colors"
                >
                  panclubticino24@gmail.com
                </a>
              </p>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div className="card p-8 backdrop-blur-sm bg-background/80">
              <div className="inline-flex items-center justify-center w-20 h-20 mx-auto mb-8 rounded-full bg-primary/10">
                <Mail className="w-10 h-10 text-primary" />
              </div>
              <ContactForm />
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
