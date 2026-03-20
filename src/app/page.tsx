"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type DashboardData = {
  month: number;
  year: number;
  totalRevenue: number;
  totalUnpaid: number;
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
  totalClients: number;
  totalServices: number,
  totalHours: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        Loading dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Failed to load dashboard
      </div>
    );
  }

  const cards = [
    {
      title: "Total Invoices",
      value: data.totalInvoices,
      onClick: () => router.push("/invoices"),
    },
    {
      title: "Paid Invoices",
      value: data.paidInvoices,
      onClick: () => router.push("/invoices?status=paid"),
    },
    {
      title: "Unpaid Invoices",
      value: data.unpaidInvoices,
      onClick: () => router.push("/invoices?status=unpaid"),
    },
    {
      title: "Total Clients",
      value: data.totalClients,
      onClick: () => router.push("/clients"),
    },
    {
      title: "Total Services",
      value: data.totalServices,
      onClick: () => router.push("/services"),
    },
    {
      title: "Total Hours",
      value: data.totalHours,
      onClick: () => router.push("/sessions"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => router.push("/manage")}
          className="bg-black text-white px-5 py-2 rounded-lg"
        >
          Manage
        </button>
      </div>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Dashboard — {data.month}/{data.year}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={card.onClick}
              className="bg-white shadow-sm rounded-xl p-6 border"
            >
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className="text-2xl font-semibold mt-2">
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}