import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { fetchClassTimetable } from "./scraper";
import { prisma } from "@/lib/prisma";

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
        const classId = searchParams.get("classId") ?? "";
        const week = searchParams.get("week") ?? "";
        const departmentId = searchParams.get("departmentId") ?? "";

        if (!classId) {
            return NextResponse.json(
                { error: "Class ID is required" },
                { status: 400 }
            );
        }

        // Update user's saved preferences
        if (session.user.id) {
            console.log("UPDATING FOLLOWING USER: ", session.user);
            try {
                console.log("NEW SAVED CLASS: ", classId);
                console.log("NEW SAVED DEPARTMENT: ", departmentId);
                await prisma.user.update({
                    where: { id: session.user.id },
                    data: {
                        savedClass: classId,
                        savedDepartment: departmentId || undefined, // Only update if provided
                    },
                });
            } catch (updateError) {
                console.error("Failed to update user preferences:", updateError);
                // Don't fail the request if user update fails, just log it
            }
        }

        // Fetch the timetable data
        const timetable = await fetchClassTimetable(classId, week);

        return NextResponse.json(timetable);
    } catch (error) {
        console.error("Timetable fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch timetable data" },
            { status: 500 }
        );
    }
}