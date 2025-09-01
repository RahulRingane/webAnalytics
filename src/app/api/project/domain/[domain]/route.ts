import { auth } from "@/auth";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { domain: string } },
) {
   const { domain } = await params; 

  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { user: null, message: "Unauthorized", success: false },
        { status: 403 },
      );
    }

    // Fetch the project by domain and owner
    const project = await prisma.project.findFirst({
      where: {
        domain,
        ownerId: session.user.id,
      },
      include: {
        checks: true, // include checks if needed
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found", success: false },
        { status: 404 },
      );
    }
    return NextResponse.json({ project, success: true }, { status: 200 });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 },
    );
  }
}
