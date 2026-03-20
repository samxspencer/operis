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
    <div className="space-y-12 max-w-6xl">
      {/* =========================
         Header
      ========================= */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {client.name}
          </h1>
          <p className="text-slate-500 mt-1">
            Client Overview & Financial Summary
          </p>
        </div>

        <div className="flex gap-3">
          {!isEditMode ? (
            <Link
              href={`/clients/${client.id}?edit=true`}
              className="bg-[#1E3A8A] hover:bg-[#162E6E] text-white px-5 py-2.5 rounded-lg shadow-sm transition"
            >
              Edit Client
            </Link>
          ) : (
            <Link
              href={`/clients/${client.id}`}
              className="border border-slate-300 bg-white hover:bg-slate-50 px-5 py-2.5 rounded-lg transition"
            >
              Cancel
            </Link>
          )}
        </div>
      </div>

      {/* =========================
         Revenue Card (Executive Navy)
      ========================= */}
      <div className="bg-[#0B1F3A] text-white rounded-2xl p-10 shadow-lg">
        <p className="text-sm uppercase tracking-widest text-white/60">
          Total Revenue
        </p>

        <p className="text-5xl font-semibold mt-4">
          ${totalRevenue.toFixed(2)}
        </p>

        <p className="text-white/50 text-sm mt-3">
          Calculated from all completed sessions
        </p>
      </div>

      {/* =========================
         Client Information
      ========================= */}
      {!isEditMode && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">
            Client Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-slate-500">Email</p>
              <p className="font-medium mt-1">
                {client.email || "-"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Phone</p>
              <p className="font-medium mt-1">
                {client.phone || "-"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Company</p>
              <p className="font-medium mt-1">
                {client.company || "-"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Address</p>
              <p className="font-medium mt-1">
                {client.address || "-"}
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="text-slate-500">Notes</p>
              <p className="font-medium mt-1">
                {client.notes || "-"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================
         Edit Mode
      ========================= */}
      {isEditMode && <ClientEditForm client={client} />}

      {/* =========================
         Sessions
      ========================= */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Sessions
          </h2>
        </div>

        <SessionForm clientId={client.id} />

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Service</th>
                <th className="text-left p-4">Hours</th>
                <th className="text-left p-4">Description</th>
              </tr>
            </thead>

            <tbody>
              {client.sessions.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-6 text-center text-slate-400"
                  >
                    No sessions recorded.
                  </td>
                </tr>
              )}

              {client.sessions.map((session: any) => (
                <tr
                  key={session.id}
                  className="border-t hover:bg-slate-50 transition"
                >
                  <td className="p-4">
                    {new Date(
                      session.date
                    ).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {session.service?.name || "-"}
                  </td>
                  <td className="p-4">
                    {session.hours}
                  </td>
                  <td className="p-4">
                    {session.description || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================
         Invoices
      ========================= */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">
          Invoices
        </h2>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="text-left p-4">Period</th>
                <th className="text-left p-4">Total</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {client.invoices.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="p-6 text-center text-slate-400"
                  >
                    No invoices generated.
                  </td>
                </tr>
              )}

              {client.invoices.map((invoice: any) => (
                <tr
                  key={invoice.id}
                  className="border-t hover:bg-slate-50 transition"
                >
                  <td className="p-4">
                    {invoice.month}/{invoice.year}
                  </td>
                  <td className="p-4 font-medium">
                    ${Number(invoice.totalAmount).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs bg-slate-200 text-slate-700">
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}