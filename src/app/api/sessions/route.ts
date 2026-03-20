import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

const MOCK_USER_ID = "383fc329-7be7-4ac7-bf29-1457fa0783a6";

export async function GET() {
  try {
    const sessions = await prisma.session.findMany({
      where: { userId: MOCK_USER_ID },
      include: {
        client: true,
        service: true,
        invoice: true,
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clientId, serviceId, hours, date, description } = body;

    if (!clientId || !serviceId || !hours || !date) {
      return NextResponse.json(
        { error: "clientId, serviceId, hours, and date are required" },
        { status: 400 }
      );
    }

    const session = await prisma.session.create({
      data: {
        clientId,
        serviceId,
        hours,
        date: new Date(date),
        description,
        userId: MOCK_USER_ID,
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}