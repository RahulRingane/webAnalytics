import { auth } from "@/auth";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 403 },
      );
    }

    const projectsId = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        projects: {
          select: {
            id: true,
            name: true
          }        
        }
      }
    });

    return NextResponse.json(projectsId, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 },
    );
  }
}
