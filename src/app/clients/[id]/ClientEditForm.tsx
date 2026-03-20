"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientEditForm({ client }: { client: any }) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: client.name || "",
    email: client.email || "",
    phone: client.phone || "",
    company: client.company || "",
    address: client.address || "",
    notes: client.notes || "",
  });

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch(`/api/clients/${client.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);
    router.refresh(); // refresh server component
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-lg p-4 space-y-3"
    >
      <h2 className="text-lg font-semibold">Edit Client</h2>

      {Object.entries(form).map(([key, value]) => (
        <input
          key={key}
          type="text"
          placeholder={key}
          value={value}
          onChange={(e) =>
            setForm({ ...form, [key]: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
      ))}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}