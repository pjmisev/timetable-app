import { Hero } from "@/components/main/class/Hero";
import { Footer } from "@/components/main/sections/Footer";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ClassTimetable from "./ClassTimetable";

export default async function RoomPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen">
      <Hero id="top" />
      <ClassTimetable />
      <Footer />
    </div>
  );
}
