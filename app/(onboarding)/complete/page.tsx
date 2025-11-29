export default function CompletePage() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Profile Submitted!</h1>
      <p className="text-gray-600 mb-6">
        Your profile has been submitted for review. Our admin team will review
        it soon and you'll be notified when you have a match.
      </p>
      <div className="space-y-2">
        <a
          href="/app/waiting"
          className="block text-blue-600 hover:underline"
        >
          Go to Waiting Page
        </a>
        <a href="/auth/login" className="block text-gray-600 hover:underline">
          Logout
        </a>
      </div>
    </div>
  );
}


