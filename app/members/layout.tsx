import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Members | Moto Club",
  description: "Members of the Moto Club",
};

export default function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
