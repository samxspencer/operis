"use client";

import { useEffect, useState } from "react";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    async function fetchServices() {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data);
    }

    fetchServices();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Services</h1>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        {services.map((service) => (
          <div key={service.id} className="border-b py-3">
            <p className="font-semibold">{service.name}</p>
            <p className="text-sm text-gray-500">
              ${service.hourlyRate} / hour
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}