import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// For now we hardcode userId until auth is added
const MOCK_USER_ID = "8e5b250a-d567-4046-890f-e3ae0a89e6a8";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { userId: MOCK_USER_ID },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, hourlyRate } = body;

    const service = await prisma.service.create({
      data: {
        name,
        hourlyRate,
        userId: MOCK_USER_ID,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}