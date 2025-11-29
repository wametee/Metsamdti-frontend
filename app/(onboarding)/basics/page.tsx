export default function BasicsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Basic Information</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select className="w-full px-3 py-2 border rounded-lg">
            <option>Select gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">City/Country</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter your location"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Display Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Name shown to matches"
          />
        </div>
      </form>
    </div>
  );
}

