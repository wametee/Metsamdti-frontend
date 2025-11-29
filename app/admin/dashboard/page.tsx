export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold">Total Users</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold">Active Matches</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold">Total Revenue</h3>
          <p className="text-2xl font-bold">$0</p>
        </div>
      </div>
    </div>
  );
}


