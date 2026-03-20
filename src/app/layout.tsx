import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Operis",
  description: "Client Management Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <div className="min-h-screen flex">
          {/* Sidebar */}
          <aside className="w-40 bg-[#0B1F3A] text-white px-5 py-8 hidden md:flex flex-col">
            {/* Logo */}
            <div className="mb-12">
              <h1 className="text-xl font-semibold tracking-tight">
                Operis
              </h1>
              <p className="text-xs text-white/50 mt-1">
                Client Platform
              </p>
            </div>

            {/* Navigation */}
            <nav className="space-y-2 text-sm">
              <Link
                href="/dashboard"
                className="block px-3 py-2 rounded-md hover:bg-white/10 transition"
              >
                Dashboard
              </Link>

              <Link
                href="/clients"
                className="block px-3 py-2 rounded-md hover:bg-white/10 transition"
              >
                Clients
              </Link>
            </nav>

            {/* Footer */}
            <div className="mt-auto text-xs text-white/40">
              © 2026 Operis
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 px-12 py-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}