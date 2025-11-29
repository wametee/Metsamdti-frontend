export default function VerifyPage({
  params,
}: {
  params: { token: string };
}) {
  return (
    <main className="container mx-auto px-4 py-16 max-w-md text-center">
      <h1 className="text-2xl font-bold mb-4">Verifying your account...</h1>
      <p className="text-gray-600">
        Please wait while we verify your email/phone.
      </p>
    </main>
  );
}

