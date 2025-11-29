export default function AdminPaymentsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Payments</h1>
      <div className="border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2">No payments yet</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

