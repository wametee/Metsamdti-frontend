export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r bg-gray-50">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
          <nav className="space-y-2">
            <a
              href="/admin/dashboard"
              className="block px-3 py-2 rounded hover:bg-gray-200"
            >
              Dashboard
            </a>
            <a
              href="/admin/users"
              className="block px-3 py-2 rounded hover:bg-gray-200"
            >
              Users
            </a>
            <a
              href="/admin/matches"
              className="block px-3 py-2 rounded hover:bg-gray-200"
            >
              Matches
            </a>
            <a
              href="/admin/payments"
              className="block px-3 py-2 rounded hover:bg-gray-200"
            >
              Payments
            </a>
          </nav>
        </div>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}

