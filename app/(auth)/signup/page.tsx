export default function SignupPage() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
      <form className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email or Phone
          </label>
          <input
            type="text"
            id="email"
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
    </main>
  );
}

