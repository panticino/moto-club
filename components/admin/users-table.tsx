"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
};

async function getUsers(): Promise<User[]> {
  const res = await fetch("/api/admin/users");
  if (!res.ok) throw new Error("Impossibile recuperare l'elenco degli utenti");
  return res.json();
}

async function updateUserRole(userId: string, role: string) {
  const res = await fetch("/api/admin/users", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, role }),
  });
  if (!res.ok) throw new Error("Impossibile modificare il ruolo dell'utente");
  return res.json();
}

export function UsersTable() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUpdating, setIsUpdating] = React.useState<string | null>(null);

  // Fetch users on mount
  React.useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(() => {
        toast.error("Errore", {
          description:
            "Si è verificato un errore durante il recupero degli utenti",
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setIsUpdating(userId);
      await updateUserRole(userId, newRole);
      setUsers(
        users.map((user) =>
          user._id === userId
            ? { ...user, role: newRole as "user" | "admin" }
            : user
        )
      );
      toast.success("Completato", {
        description: "Il ruolo dell'utente è stato aggiornato con successo",
      });
    } catch (error) {
      toast.error("Errore", {
        description:
          error instanceof Error
            ? error.message
            : "Si è verificato un errore durante l'aggiornamento del ruolo",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  // Mobile card view
  const MobileView = () => (
    <div className="space-y-4">
      {users.map((user) => (
        <Card key={user._id}>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Nome e Cognome
                </label>
                <p className="text-sm">{user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="text-sm break-all">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Ruolo
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Select
                    defaultValue={user.role}
                    onValueChange={(value) => handleRoleChange(user._id, value)}
                    disabled={isUpdating === user._id}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Utente</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  {isUpdating === user._id && <Spinner className="h-4 w-4" />}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Data di Iscrizione
                </label>
                <p className="text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Desktop table view
  const DesktopView = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome e Cognome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Ruolo</TableHead>
            <TableHead>Data di Iscrizione</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Select
                    defaultValue={user.role}
                    onValueChange={(value) => handleRoleChange(user._id, value)}
                    disabled={isUpdating === user._id}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Utente</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  {isUpdating === user._id && <Spinner className="h-4 w-4" />}
                </div>
              </TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <>
      <div className="block md:hidden">
        <MobileView />
      </div>
      <div className="hidden md:block">
        <DesktopView />
      </div>
    </>
  );
}
