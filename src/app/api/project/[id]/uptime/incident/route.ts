import prisma from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    const session = await auth();

    if (!session) {
        return NextResponse.json(
            { user: null, message: "Unauthorized", success: false },
            { status: 403 }
        );
    }

    try {
        const incident = await prisma.incident.findMany({
            where: {
                project: {
                    ownerId: session.user.id
                },
            },
            orderBy: {
                startTime: 'desc'
            },
            include: {
                project: {
                    select: {
                        name: true,
                        url: true,
                    },
                },
            },
        });

        return NextResponse.json(
            incident,
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: "internal server error" },
            { status: 500 }
        )
    }

}