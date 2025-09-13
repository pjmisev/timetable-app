import { auth } from "@/lib/auth";
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
        const roomId = searchParams.get("roomId") ?? "";
        const week = searchParams.get("week") ?? "";

        if (!roomId) {
            return NextResponse.json(
                { error: "Room ID is required" },
                { status: 500 }
            );
        }

        // Fetch the timetable data
        const timetable = await fetchRoomTimetable(roomId, week);

        return NextResponse.json(timetable);
    } catch (error) {
        console.error("Timetable fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch timetable data" },
            { status: 500 }
        );
    }
}