import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

const MOCK_USER_ID = "383fc329-7be7-4ac7-bf29-1457fa0783a6";

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { userId: MOCK_USER_ID },
      include: {
        client: true,
        sessions: {
          include: {
            service: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clientId, sessionIds, month, year } = body;

    if (!clientId || !sessionIds?.length || !month || !year) {
      return NextResponse.json(
        { error: "clientId, sessionIds, month, and year are required" },
        { status: 400 }
      );
    }

    // Fetch sessions that are uninvoiced
    const sessions = await prisma.session.findMany({
      where: {
        id: { in: sessionIds },
        userId: MOCK_USER_ID,
        invoiceId: null,
      },
      include: {
        service: true,
      },
    });

    if (sessions.length === 0) {
      return NextResponse.json(
        { error: "No valid uninvoiced sessions found" },
        { status: 400 }
      );
    }

    // Calculate total
    const totalAmount = sessions.reduce((sum, session) => {
      const hours = Number(session.hours);
      const rate = Number(session.service.hourlyRate);
      return sum + hours * rate;
    }, 0);

    // Create invoice and attach sessions
    const invoice = await prisma.invoice.create({
      data: {
        clientId,
        userId: MOCK_USER_ID,
        month,
        year,
        totalAmount,
        sessions: {
          connect: sessions.map((s) => ({ id: s.id })),
        },
      },
      include: {
        sessions: true,
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}