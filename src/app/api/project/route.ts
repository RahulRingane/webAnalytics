/* eslint-disable @typescript-eslint/no-explicit-any */

import { auth } from "@/auth";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { user: null, message: "Unauthorized", success: false },
        { status: 403 }
      );
    }

     const values = await req.json();
    if (!values.domain || !values.name || !values.description) {
      return NextResponse.json(
        { message: "Missing required fields", success: false },
        { status: 400 }
      );
    }

    const existingProject = await prisma.project.findFirst({
      where: { domain: values.domain },
    });
    if (existingProject) {
      return NextResponse.json(
        { message: "Domain already exists", success: false },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        domain: values.domain,
        name: values.name,
        description: values.description,
        owner: { connect: { id: session.user.id } },
      },
    });
    revalidateTag("projects");
    if (!project) {
      return NextResponse.json(
        { message: "Project not created", success: false },
        { status: 400 },
      );
    }
    revalidatePath("/projects");
    return NextResponse.json(
      { project, message: "Project created", success: true },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating project", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 403 }
      );
    }

    const projects = await prisma.project.findMany({
      where: { ownerId: session.user.id },
    });

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
