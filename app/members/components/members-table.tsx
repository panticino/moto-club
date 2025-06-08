"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { members } from "../data/members";
import type { ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tableRowVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export function MembersTable() {
  const [search, setSearch] = useState("");

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.surname.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="space-y-4">
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Input
          placeholder="Cerca soci..."
          value={search}
          onChange={handleSearch}
          className="w-full sm:max-w-sm border-primary/20 focus:border-primary text-base"
        />
        <motion.div
          className="text-sm sm:text-base text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={filteredMembers.length}
        >
          {filteredMembers.length} soci trovati
        </motion.div>
      </motion.div>

      <div className="rounded-lg border border-primary/20 overflow-hidden bg-card">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-full align-middle inline-block sm:px-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/5 hover:bg-primary/10">
                  <TableHead className="text-primary font-semibold w-[160px] sm:w-[200px] py-3 px-4 sm:px-4 text-sm sm:text-base whitespace-nowrap">
                    Nome
                  </TableHead>
                  <TableHead className="text-primary font-semibold w-[200px] sm:w-[250px] py-3 px-4 sm:px-4 text-sm sm:text-base whitespace-nowrap">
                    Email
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {filteredMembers.map((member) => (
                    <motion.tr
                      key={member.id}
                      className="hover:bg-primary/5"
                      variants={tableRowVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                      layout
                    >
                      <TableCell className="font-medium py-3 px-4 sm:px-4 text-sm sm:text-base whitespace-nowrap">
                        {member.name} {member.surname}
                      </TableCell>
                      <TableCell className="py-3 px-4 sm:px-4 text-sm sm:text-base break-all sm:break-normal">
                        {member.email}
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
