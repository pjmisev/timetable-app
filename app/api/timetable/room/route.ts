// app/api/protected/timetable/route.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { fetchRoomTimetable } from "./scraper";

export async function GET(request: Request) {
    const session = await auth();

    // Authentication check
    if (!session?.user) {
        return NextResponse.json(
            { error: "Unauthorized - Please log in" },
            { status: 401 }
        );
    }

    try {
        // Extract query parameters
        const { searchParams } = new URL(request.url);
        const roomId = searchParams.get("roomId") || "P1139";
        const week = searchParams.get("week") || "8";

        // Optional: Check if user has permission to access this resource
        // You might check session.user.role or other properties

        // Fetch the timetable data
        const timetable = await fetchRoomTimetable(roomId, week);

        // Log successful access (optional)
        console.log(`Timetable accessed by ${session.user.email}`);

        return NextResponse.json(timetable);
    } catch (error) {
        console.error("Timetable fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch timetable data" },
            { status: 500 }
        );
    }
}