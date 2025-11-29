export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
          Welcome to Metsamdti
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A private, marriage-focused matchmaking platform where meaningful
          connections are carefully curated.
        </p>
        <a
          href="/auth/signup"
          className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-lg"
        >
          Get Started
        </a>
      </div>
    </section>
  );
}

