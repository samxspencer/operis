import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

const MOCK_USER_ID = "383fc329-7be7-4ac7-bf29-1457fa0783a6";

export async function GET() {
  try {
    const now = new Date();
    const month = now.getMonth() + 1; // JS months are 0-based
    const year = now.getFullYear();

    // 1️⃣ Paid invoices this month
    const paidInvoices = await prisma.invoice.findMany({
      where: {
        userId: MOCK_USER_ID,
        month,
        year,
        status: "paid",
      },
    });

    // 2️⃣ Unpaid invoices this month
    const unpaidInvoices = await prisma.invoice.findMany({
      where: {
        userId: MOCK_USER_ID,
        month,
        year,
        status: "unpaid",
      },
    });

    // 3️⃣ Total clients
    const totalClients = await prisma.client.count({
      where: { userId: MOCK_USER_ID },
    });

    // 4️⃣ Sessions this month
    const monthStart = new Date(year, now.getMonth(), 1);
    const monthEnd = new Date(year, now.getMonth() + 1, 0);

    const sessions = await prisma.session.findMany({
      where: {
        userId: MOCK_USER_ID,
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    // ✅ Calculations
    const totalRevenue = paidInvoices.reduce(
      (sum, inv) => sum + Number(inv.totalAmount),
      0
    );

    const totalUnpaid = unpaidInvoices.reduce(
      (sum, inv) => sum + Number(inv.totalAmount),
      0
    );

    const totalHours = sessions.reduce(
      (sum, s) => sum + Number(s.hours),
      0
    );

    return NextResponse.json({
      month,
      year,
      totalRevenue,
      totalUnpaid,
      totalInvoices: paidInvoices.length + unpaidInvoices.length,
      paidInvoices: paidInvoices.length,
      unpaidInvoices: unpaidInvoices.length,
      totalClients,
      totalHours,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard" },
      { status: 500 }
    );
  }
}