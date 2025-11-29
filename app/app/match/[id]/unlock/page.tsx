export default function UnlockPage({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto px-4 py-16 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Unlock Chat</h1>
      <p className="text-gray-600 mb-6">
        Pay to unlock a temporary chat window with your match.
      </p>
      <form className="space-y-4">
        {/* Stripe payment form will go here */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
        >
          Pay & Unlock
        </button>
      </form>
    </main>
  );
}

