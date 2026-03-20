import Link from "next/link";

async function getClients() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/clients`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Clients
          </h1>
          <p className="text-slate-500">
            Manage and monitor your client relationships
          </p>
        </div>

        <Link
          href="/clients/new"
          className="bg-[#1E3A8A] hover:bg-[#162E6E] text-white px-5 py-2.5 rounded-lg shadow-sm transition"
        >
          + Add Client
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Company</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Phone</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {clients.map((client: any) => (
              <tr
                key={client.id}
                className="border-t hover:bg-slate-50 transition"
              >
                <td className="p-4 font-medium">
                  {client.name}
                </td>
                <td className="p-4">
                  {client.company || "-"}
                </td>
                <td className="p-4">
                  {client.email || "-"}
                </td>
                <td className="p-4">
                  {client.phone || "-"}
                </td>
                <td className="p-4 text-right space-x-2">
                  <Link
                    href={`/clients/${client.id}`}
                    className="text-slate-600 hover:text-[#1E3A8A]"
                  >
                    View
                  </Link>

                  <Link
                    href={`/clients/${client.id}?edit=true`}
                    className="text-[#1E3A8A] font-medium hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}