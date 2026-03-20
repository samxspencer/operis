import { notFound } from "next/navigation";
import Link from "next/link";
import ClientEditForm from "./ClientEditForm";
import SessionForm from "./SessionForm";

/* =========================
   Fetch Client
========================= */
async function getClient(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/clients/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  return res.json();
}

/* =========================
   Page Component
========================= */
export default async function ClientPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { edit?: string };
}) {
  const client = await getClient(params.id);

  if (!client) {
    notFound();
  }

  const isEditMode = searchParams?.edit === "true";

  /* =========================
     Revenue Calculation
  ========================= */
  const totalRevenue = client.sessions.reduce(
    (sum: number, session: any) =>
      sum +
      Number(session.hours) *
        Number(session.service?.hourlyRate ?? 0),
    0
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* =========================
         Header
      ========================= */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{client.name}</h1>
          <p className="text-gray-500">Client Details</p>
        </div>

        <div className="flex gap-2">
          {!isEditMode ? (
            <Link
              href={`/clients/${client.id}?edit=true`}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Edit
            </Link>
          ) : (
            <Link
              href={`/clients/${client.id}`}
              className="bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </Link>
          )}
        </div>
      </div>

      {/* =========================
         Client Info (View Mode)
      ========================= */}
      {!isEditMode && (
        <div className="bg-white shadow rounded-lg p-6 space-y-2">
          <p><strong>Email:</strong> {client.email || "-"}</p>
          <p><strong>Phone:</strong> {client.phone || "-"}</p>
          <p><strong>Company:</strong> {client.company || "-"}</p>
          <p><strong>Address:</strong> {client.address || "-"}</p>
          <p><strong>Notes:</strong> {client.notes || "-"}</p>
        </div>
      )}

      {/* =========================
         Edit Mode
      ========================= */}
      {isEditMode && (
        <ClientEditForm client={client} />
      )}

      {/* =========================
         Revenue Summary
      ========================= */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-2">
          Revenue Summary
        </h2>
        <p className="text-3xl font-bold text-green-600">
          ${totalRevenue.toFixed(2)}
        </p>
      </div>

      {/* =========================
         Sessions Section
      ========================= */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Sessions</h2>

        {/* Add Session Form */}
        <SessionForm clientId={client.id} />

        {client.sessions.length === 0 && (
          <p className="text-gray-500">No sessions yet.</p>
        )}

        {client.sessions.map((session: any) => (
          <div
            key={session.id}
            className="bg-white shadow rounded-lg p-4 space-y-1"
          >
            <p>
              <strong>Date:</strong>{" "}
              {new Date(session.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Hours:</strong> {session.hours}
            </p>
            <p>
              <strong>Service:</strong>{" "}
              {session.service?.name || "-"}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {session.description || "-"}
            </p>
          </div>
        ))}
      </div>

      {/* =========================
         Invoices Section
      ========================= */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Invoices</h2>

        {client.invoices.length === 0 && (
          <p className="text-gray-500">No invoices yet.</p>
        )}

        {client.invoices.map((invoice: any) => (
          <div
            key={invoice.id}
            className="bg-white shadow rounded-lg p-4 space-y-1"
          >
            <p>
              <strong>Period:</strong>{" "}
              {invoice.month}/{invoice.year}
            </p>
            <p>
              <strong>Total:</strong>{" "}
              ${Number(invoice.totalAmount).toFixed(2)}
            </p>
            <p>
              <strong>Status:</strong> {invoice.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}