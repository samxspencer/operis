"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ManagePage() {
    const router = useRouter();
  /* -------------------- CLIENT -------------------- */
  const [clients, setClients] = useState<any[]>([]);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientLoading, setClientLoading] = useState(false);

  useEffect(() => {
    async function fetchClients() {
        const res = await fetch("/api/clients");
        const data = await res.json();
        setClients(data);
    }

    fetchClients();
    }, []);

  async function handleAddClient() {
    if (!clientName) return;

    setClientLoading(true);
    await fetch("/api/clients", {
      method: "POST",
      body: JSON.stringify({
        name: clientName,
        email: clientEmail,
      }),
    });

    setClientName("");
    setClientEmail("");
    setClientLoading(false);
    alert("Client added");
  }

  /* -------------------- SERVICE -------------------- */
  const [serviceName, setServiceName] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [serviceLoading, setServiceLoading] = useState(false);

  async function handleAddService() {
    if (!serviceName || !hourlyRate) return;

    setServiceLoading(true);
    await fetch("/api/services", {
      method: "POST",
      body: JSON.stringify({
        name: serviceName,
        hourlyRate: Number(hourlyRate),
      }),
    });

    setServiceName("");
    setHourlyRate("");
    setServiceLoading(false);
    alert("Service added");
  }

  /* -------------------- INVOICE -------------------- */
  const [clientId, setClientId] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  async function handleCreateInvoice() {
    if (!clientId || !month || !year) return;

    setInvoiceLoading(true);

    await fetch("/api/invoices", {
      method: "POST",
      body: JSON.stringify({
        clientId,
        month: Number(month),
        year: Number(year),
      }),
    });

    setClientId("");
    setMonth("");
    setYear("");
    setInvoiceLoading(false);
    alert("Invoice created");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
        <button
        onClick={() => router.push("/")}
        className="mb-6 text-sm text-gray-600 underline"
        >
        ← Back to Dashboard
        </button>
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Manage</h1>

        {/* ---------------- CLIENT CARD ---------------- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Add Client</h2>

          <div className="space-y-3">
            <input
              placeholder="Client Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full border p-3 rounded-lg"
            />

            <input
              placeholder="Client Email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full border p-3 rounded-lg"
            />

            <button
              onClick={handleAddClient}
              disabled={clientLoading}
              className="bg-black text-white px-6 py-2 rounded-lg"
            >
              {clientLoading ? "Adding..." : "Add Client"}
            </button>
          </div>
        </div>

        {/* ---------------- SERVICE CARD ---------------- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Add Service</h2>

          <div className="space-y-3">
            <input
              placeholder="Service Name"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full border p-3 rounded-lg"
            />

            <input
              type="number"
              placeholder="Hourly Rate"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              className="w-full border p-3 rounded-lg"
            />

            <button
              onClick={handleAddService}
              disabled={serviceLoading}
              className="bg-black text-white px-6 py-2 rounded-lg"
            >
              {serviceLoading ? "Adding..." : "Add Service"}
            </button>
          </div>
        </div>

        {/* ---------------- INVOICE CARD ---------------- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Create Invoice</h2>

          <div className="space-y-3">
            <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full border p-3 rounded-lg"
            >
            <option value="">Select Client</option>
            {clients.map((client) => (
                <option key={client.id} value={client.id}>
                {client.name}
                </option>
            ))}
            </select>

            <input
              type="number"
              placeholder="Month (1-12)"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full border p-3 rounded-lg"
            />

            <input
              type="number"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full border p-3 rounded-lg"
            />

            <button
              onClick={handleCreateInvoice}
              disabled={invoiceLoading}
              className="bg-black text-white px-6 py-2 rounded-lg"
            >
              {invoiceLoading ? "Creating..." : "Create Invoice"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}