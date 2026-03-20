"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SessionForm({ clientId }: { clientId: string }) {
  const router = useRouter();

  const [form, setForm] = useState({
    date: "",
    hours: "",
    description: "",
    serviceId: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        hours: parseFloat(form.hours),
        clientId,
      }),
    });

    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 shadow rounded space-y-3"
    >
      <h2 className="font-semibold">Add Session</h2>

      <input
        type="date"
        value={form.date}
        onChange={(e) =>
          setForm({ ...form, date: e.target.value })
        }
        className="w-full border p-2 rounded"
      />

      <input
        type="number"
        placeholder="Hours"
        value={form.hours}
        onChange={(e) =>
          setForm({ ...form, hours: e.target.value })
        }
        className="w-full border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
        className="w-full border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Service ID"
        value={form.serviceId}
        onChange={(e) =>
          setForm({ ...form, serviceId: e.target.value })
        }
        className="w-full border p-2 rounded"
      />

      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Add Session
      </button>
    </form>
  );
}