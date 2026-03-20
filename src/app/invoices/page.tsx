"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  useEffect(() => {
    async function fetchInvoices() {
      let url = "/api/invoices";
      if (status) {
        url += `?status=${status}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setInvoices(data);
    }

    fetchInvoices();
  }, [status]);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Invoices</h1>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Client</th>
              <th className="p-4">Month</th>
              <th className="p-4">Year</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-t">
                <td className="p-4">{inv.client?.name}</td>
                <td className="p-4">{inv.month}</td>
                <td className="p-4">{inv.year}</td>
                <td className="p-4">${inv.totalAmount}</td>
                <td className="p-4 capitalize">{inv.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}