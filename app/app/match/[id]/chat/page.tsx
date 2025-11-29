export default function ChatPage({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="border rounded-lg h-96 flex flex-col">
        <div className="border-b p-4 flex justify-between items-center">
          <h2 className="font-semibold">Chat with Match</h2>
          <div className="text-sm text-gray-500">
            Time remaining: 2h 30m
          </div>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Chat messages will go here */}
          <p className="text-gray-500 text-center">No messages yet</p>
        </div>
        <div className="border-t p-4">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>
    </main>
  );
}

