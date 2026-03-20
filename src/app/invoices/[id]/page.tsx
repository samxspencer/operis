"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    async function fetchInvoice() {
      const res = await fetch(`/api/invoices/${id}`);
      const data = await res.json();
      setInvoice(data);
    }

    if (id) fetchInvoice();
  }, [id]);

  if (!invoice) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-sm border">
        <h1 className="text-2xl font-bold mb-4">
          Invoice — {invoice.month}/{invoice.year}
        </h1>

        <p><strong>Client:</strong> {invoice.client?.name}</p>
        <p><strong>Status:</strong> {invoice.status}</p>
        <p><strong>Total:</strong> ${invoice.totalAmount}</p>

        <h2 className="text-lg font-semibold mt-6 mb-2">Sessions</h2>

        {invoice.sessions?.map((session: any) => (
          <div key={session.id} className="border-b py-2">
            <p>{session.date}</p>
            <p>{session.hours} hours</p>
          </div>
        ))}
      </div>
    </div>
  );
}