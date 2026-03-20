import Link from "next/link";

/* =========================
   Fetch Clients
========================= */
async function getClients() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/clients`,
    { cache: "no-store" }
  );

  if (!res.ok) return [];

  return res.json();
}

/* =========================
   Page Component
========================= */
export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clients</h1>

        <Link
          href="/clients/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Client
        </Link>
      </div>

      {/* Client List */}
      {clients.length === 0 && (
        <p className="text-gray-500">No clients yet.</p>
      )}

      <div className="grid gap-4">
        {clients.map((client: any) => (
          <div
            key={client.id}
            className="bg-white shadow rounded-lg p-6 flex justify-between items-start"
          >
            {/* Client Info */}
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">
                {client.name}
              </h2>

              <p><strong>Email:</strong> {client.email || "-"}</p>
              <p><strong>Phone:</strong> {client.phone || "-"}</p>
              <p><strong>Company:</strong> {client.company || "-"}</p>
              <p><strong>Address:</strong> {client.address || "-"}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Link
                href={`/clients/${client.id}`}
                className="bg-gray-800 text-white px-4 py-2 rounded text-center"
              >
                View
              </Link>

              <Link
                href={`/clients/${client.id}?edit=true`}
                className="bg-blue-600 text-white px-4 py-2 rounded text-center"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}