import type { Metadata } from "next";
import "../../globals.css";

export const metadata: Metadata = {
  title: "Timetable App | PJmisev",
  description: "Timetable App by PJmisev (Pijus Misevicius)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
