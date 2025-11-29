export default function AdminUsersPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full max-w-md px-3 py-2 border rounded-lg"
        />
      </div>
      <div className="border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2">No users yet</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

