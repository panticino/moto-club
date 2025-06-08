import { UsersTable } from "@/components/admin/users-table";

export default function AdminUsersPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Gestione Utenti</h1>
        <UsersTable />
      </div>
    </div>
  );
}
