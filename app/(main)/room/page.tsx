// app/(protected)/room/page.tsx
import { Hero } from "@/components/main/room/Hero";
import { Footer } from "@/components/main/sections/Footer";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import RoomTimetable from "./RoomTimetable";

export default async function RoomPage({
  searchParams,
}: {
  searchParams: { roomId?: string; week?: string };
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const query = new URLSearchParams();
  if (searchParams.roomId) query.append("roomId", searchParams.roomId);
  if (searchParams.week) query.append("week", searchParams.week);

  const res = await fetch(
    `http://localhost:3000/api/timetable/room?${query.toString()}`,
    {
      cache: "no-store", // disable caching for real-time
    }
  );
  const data = await res.json();

  return (
    <div className="min-h-screen bg-background">
      <Hero id="top" />
      <RoomTimetable initialData={data} />
      <Footer />
    </div>
  );
}
