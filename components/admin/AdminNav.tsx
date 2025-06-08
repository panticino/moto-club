"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Home, Calendar, Image, Users } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/program", label: "Programma", icon: Calendar },
  { href: "/admin/photos", label: "Galleria", icon: Image },
  { href: "/admin/users", label: "Utenti", icon: Users },
];

export function AdminNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const NavLinks = () => (
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              pathname === item.href
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-muted/80"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8">
          <Link
            href="/admin"
            className="flex items-center gap-2 transition-colors hover:opacity-90"
          >
            <span className="font-semibold text-lg hidden md:block">
              Pannello di Amministrazione
            </span>
            <span className="font-semibold text-lg md:hidden">Admin</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <div className="flex flex-col gap-6 p-6">
              <div className="flex items-center gap-2">
                <SheetTitle className="font-semibold text-lg">
                  Pannello di Amministrazione
                </SheetTitle>
              </div>
              <NavLinks />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
