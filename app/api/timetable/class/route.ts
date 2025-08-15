import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const session = await auth();

    // Authentication check
    if (!session?.user) {
        return NextResponse.json(
            { error: "Unauthorized - Please log in" },
            { status: 401 }
        );
    }

    return NextResponse.json(
        { error: "This API endpoint is not live yet. Please check back later." },
        { status: 200 }
    );

}