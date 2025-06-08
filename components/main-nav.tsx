"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Programma",
    href: "/program",
  },
  {
    name: "Membri",
    href: "/members",
  },
  {
    name: "Chi Siamo",
    href: "/about",
  },
  {
    name: "Foto",
    href: "/photos",
  },
  {
    name: "Contatti",
    href: "/contact",
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="flex-1 flex items-center">
      <div className="flex-none">
        <Link href="/" className="flex items-center gap-2">
          <div className="overflow-hidden rounded-full">
            <Image
              src="/logo.ico"
              alt="Logo"
              width={32}
              height={32}
              priority
              className="object-cover"
            />
          </div>
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="font-bold text-base sm:text-lg lg:text-xl"
          >
            Pan European Club Ticino
          </motion.span>
        </Link>
      </div>
      <div className="flex-1 flex justify-center">
        <nav className="hidden md:flex items-center">
          <div className="flex items-center gap-4 lg:gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm lg:text-base font-medium transition-colors hover:text-foreground/80",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                </motion.span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
