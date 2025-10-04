import prisma from "@/lib/db";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { user: null, message: "Unauthorized", success: false },
      { status: 403 },
    );
  }

  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") ?? "30", 10); // default 30
    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email || "",
      },
    });

    if (typeof id !== "string") {
      return NextResponse.json(
        { message: "Invalid Id Parameter" },
        { status: 400 },
      );
    }

    const project = await prisma.project.findFirst({
      where: {
        id,
        ownerId: user?.id,
      },
    });

    console.log(user?.id, "project");
    console.log(id, "id");

    if (!project) {
      return NextResponse.json(
        { message: "monitor not found" },
        { status: 404 },
      );
    }

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const checks = await prisma.check.findMany({
      where: {
        projectId: id,
        // timestamp: { gte: yesterday }
      },

      orderBy: { timestamp: "asc" },
      take: limit,
    });

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const yearAgo = new Date(now);
    yearAgo.setDate(yearAgo.getDate() - 365);

    const allChecks = await prisma.check.findMany({
      where: {
        projectId: id,
        timestamp: { gte: yearAgo },
      },
    });

    const uptime = {
      last7Days: calculateUptime(allChecks, sevenDaysAgo),
      last30Days: calculateUptime(allChecks, thirtyDaysAgo),
      last365Days: calculateUptime(allChecks, yearAgo),
    };

    return NextResponse.json({ project, checks, uptime }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ "Internal server error": error });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth();
  const body = await req.json();

  if (!session) {
    return NextResponse.json(
      { user: null, message: "Unauthorized", success: false },
      { status: 403 },
    );
  }

  const { name, url, method, interval, timeout, expectedStatusCode, active } =
    body;

  const project = await prisma.project.findFirst({
    where: {
      id,
      ownerId: sessionStorage.u,
    },
  });

  if (!project) {
    return NextResponse.json({ message: "project not found" }, { status: 404 });
  }

  const updatedProject = await prisma.project.update({
    where: { id },
    data: {
      name: name ?? project.name,
      url: url ?? project.url,
      method: method ?? project.method,
      interval: interval ?? project.interval,
      timeout: timeout ?? project.timeout,
      expectedStatusCode: expectedStatusCode ?? project.expectedStatusCode,
      active: active !== undefined ? active : project.active,
    },
  });

  return NextResponse.json({ updatedProject }, { status: 200 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { user: null, message: "Unauthorized", success: false },
        { status: 403 },
      );
    }

    const result = await prisma.project.delete({
      where: {
        id,
        ownerId: session.user.id,
      },
    });

    // Project deleted
    return NextResponse.json(
      { message: "Project deleted successfully", deletedProject: result },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
function calculateUptime(
  checks: { status: string; timestamp: Date }[],
  since: Date,
): number {
  const relevantChecks = checks.filter(
    (check) => new Date(check.timestamp) >= since,
  );

  if (relevantChecks.length === 0) return 100;

  const upChecks = relevantChecks.filter((check) => check.status === "up");
  return (upChecks.length / relevantChecks.length) * 100;
}
