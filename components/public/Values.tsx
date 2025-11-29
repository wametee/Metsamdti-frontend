export function Values() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Our Core Values
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Privacy</h3>
            <p className="text-gray-600">
              Your information is protected and only shared with matches.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">✓</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Trust</h3>
            <p className="text-gray-600">
              Every profile is carefully reviewed by our admin team.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">💝</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              Deliberate
            </h3>
            <p className="text-gray-600">
              Matches are thoughtfully selected, not algorithm-driven.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


