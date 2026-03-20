import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

/* ---------------- GET INVOICE ---------------- */

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        client: true,
        sessions: {
          include: {
            service: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}

/* ---------------- UPDATE STATUS ---------------- */

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    const { id } = await context.params;

    const invoice = await prisma.invoice.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("PATCH ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update invoice" },
      { status: 500 }
    );
  }
}