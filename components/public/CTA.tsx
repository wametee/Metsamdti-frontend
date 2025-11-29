export function CTA() {
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Begin Your Journey?
        </h2>
        <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
          Join our community of people seeking serious, marriage-focused
          relationships.
        </p>
        <a
          href="/auth/signup"
          className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors text-lg"
        >
          Create Your Profile
        </a>
      </div>
    </section>
  );
}


