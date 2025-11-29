export default function PreferencesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Preferences</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Preferred Age Range
          </label>
          <div className="flex gap-4">
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Min"
            />
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Max"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Religion</label>
          <select className="w-full px-3 py-2 border rounded-lg">
            <option>Select religion</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Origin/Region</label>
          <select className="w-full px-3 py-2 border rounded-lg">
            <option>Select region</option>
          </select>
        </div>
      </form>
    </div>
  );
}

