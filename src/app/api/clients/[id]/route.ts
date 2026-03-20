import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// ✅ Replace with auth later
const MOCK_USER_ID = "8e5b250a-d567-4046-890f-e3ae0a89e6a8";

/* =========================
   GET SINGLE CLIENT
========================= */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await prisma.client.findFirst({
      where: {
        id: params.id,
        userId: MOCK_USER_ID, // ✅ enforce ownership
      },
      include: {
        sessions: {
          include: {
            service: true, // ✅ needed for revenue calculation
          },
        },
        invoices: true,
      },
    });

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error("GET client error:", error);
    return NextResponse.json(
      { error: "Failed to fetch client" },
      { status: 500 }
    );
  }
}

/* =========================
   UPDATE CLIENT
========================= */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const updated = await prisma.client.updateMany({
      where: {
        id: params.id,
        userId: MOCK_USER_ID, // ✅ enforce ownership
      },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        company: body.company,
        address: body.address,
        notes: body.notes,
      },
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { error: "Client not found or not authorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH client error:", error);
    return NextResponse.json(
      { error: "Failed to update client" },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE CLIENT
========================= */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await prisma.client.deleteMany({
      where: {
        id: params.id,
        userId: MOCK_USER_ID, // ✅ enforce ownership
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Client not found or not authorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE client error:", error);
    return NextResponse.json(
      { error: "Failed to delete client" },
      { status: 500 }
    );
  }
}