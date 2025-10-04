import { auth } from "@/auth";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 403 },
      );
    }

    const incidents = await prisma.incident.findMany({
      where: { projectId: id },
    });

    return NextResponse.json(incidents, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 },
    );
  }
}
