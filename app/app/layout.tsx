export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold">Metsamdti</div>
          <div className="flex gap-4 items-center">
            <div>{/* Notifications bell */}</div>
            <a href="/auth/login" className="text-sm font-medium">
              Logout
            </a>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}

