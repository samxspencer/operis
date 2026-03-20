"use client";

import { useEffect, useState } from "react";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    async function fetchClients() {
      const res = await fetch("/api/clients");
      const data = await res.json();
      setClients(data);
    }

    fetchClients();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Clients</h1>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        {clients.map((client) => (
          <div key={client.id} className="border-b py-3">
            <p className="font-semibold">{client.name}</p>
            <p className="text-sm text-gray-500">{client.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}