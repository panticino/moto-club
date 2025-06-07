"use client";

import { MembersTable } from "./components/members-table";
import { members } from "./data/members";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const container = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function MembersPage() {
  const totalMembers = members.length;
  const roles = {
    presidente: members.filter((m) => m.relation.toLowerCase() === "presidente")
      .length,
    comitato: members.filter((m) =>
      m.relation.toLowerCase().includes("comitato")
    ).length,
    soci: members.filter((m) => m.relation.toLowerCase().includes("socio"))
      .length,
  };

  return (
    <main className="container min-h-screen px-4 py-4 sm:py-6 md:py-8 lg:py-12">
      <motion.div
        className="space-y-4 sm:space-y-6 md:space-y-8"
        initial="initial"
        animate="animate"
        variants={container}
      >
        <motion.div variants={fadeInUp} className="space-y-2 sm:space-y-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-primary">
            Soci del Club
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Elenco di tutti i soci del Moto Club e le loro informazioni di
            contatto.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4"
          variants={container}
        >
          <motion.div
            className="p-4 sm:p-5 rounded-lg bg-card border shadow-sm"
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
              {totalMembers}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">
              Totale Soci
            </div>
          </motion.div>
          <motion.div
            className="p-4 sm:p-5 rounded-lg bg-card border shadow-sm"
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
              {roles.comitato}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">
              Membri del Comitato
            </div>
          </motion.div>
          <motion.div
            className="p-4 sm:p-5 rounded-lg bg-card border shadow-sm"
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
              {roles.soci}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">
              Soci Ordinari
            </div>
          </motion.div>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <MembersTable />
        </motion.div>
      </motion.div>
    </main>
  );
}
