import { auth } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    const session = await auth();

    // Authentication check
    if (!session?.user) {
        return NextResponse.json(
            { error: "Unauthorized - Please log in" },
            { status: 401 }
        );
    }

    try {

        const savedClassData = await prisma.user.findFirst({
            where: {
                id: session.user.id,
            },
            select: {
                savedClass: true,
                savedDepartment: true,
            },
        });

        return NextResponse.json(savedClassData);
    } catch (error) {
        console.error("Timetable fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch timetable data" },
            { status: 500 }
        );
    }
}
