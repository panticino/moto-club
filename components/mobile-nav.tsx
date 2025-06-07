"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserNav } from "@/components/auth/UserNav";
import { ModeToggle } from "@/components/mode-toggle";

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

export function MobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="mr-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Apri menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px] p-4 sm:p-6">
        <nav className="flex flex-col gap-4 sm:gap-6">
          <SheetHeader>
            <SheetTitle asChild>
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
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
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-bold text-base sm:text-lg"
                >
                  Pan European Club Ticino
                </motion.span>
              </Link>
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-3 sm:gap-4">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center text-sm sm:text-base font-medium transition-colors hover:text-foreground/80 py-2",
                    pathname === item.href
                      ? "text-foreground"
                      : "text-foreground/60"
                  )}
                >
                  <motion.span whileHover={{ x: 4 }} whileTap={{ scale: 0.95 }}>
                    {item.name}
                  </motion.span>
                </Link>
              </motion.div>
            ))}
            <div className="mt-4 sm:mt-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base text-muted-foreground">
                  Tema
                </span>
                <ModeToggle />
              </div>
              <UserNav />
            </div>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
