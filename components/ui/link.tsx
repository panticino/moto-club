"use client";

import Link from "next/link";
import { buttonVariants } from "./button";
import { cn } from "@/lib/utils";

interface ButtonLinkProps extends React.ComponentProps<typeof Link> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ButtonLink({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
