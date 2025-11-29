export default function MatchPage({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">You Have a Match!</h1>
      <div className="border rounded-lg p-6 mb-6">
        <div className="mb-4">
          <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto"></div>
        </div>
        <p className="text-gray-600 mb-4">
          Admin note: Why we think you're a good match...
        </p>
        <a
          href={`/app/match/${params.id}/unlock`}
          className="block w-full bg-blue-600 text-white py-3 rounded-lg text-center font-medium hover:bg-blue-700"
        >
          Unlock Chat
        </a>
      </div>
    </main>
  );
}

