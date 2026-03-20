import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// Temporary until auth is implemented
const MOCK_USER_ID = "8e5b250a-d567-4046-890f-e3ae0a89e6a8";

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      where: { userId: MOCK_USER_ID },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, notes } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const client = await prisma.client.create({
      data: {
        name,
        email,
        notes,
        userId: MOCK_USER_ID,
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}