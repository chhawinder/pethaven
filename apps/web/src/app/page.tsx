export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🐾</span>
            <span className="text-2xl font-bold text-primary-600">PetHaven</span>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium">
              Login
            </button>
            <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium">
              Sign Up
            </button>
          </div>
        </nav>

        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Trusted Pet Care
            <span className="text-primary-500"> Near You</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Going out of town? Working late? Find verified pet hosts in your neighborhood
            who will love your pet like their own.
          </p>

          {/* Search Box */}
          <div className="bg-white p-4 rounded-2xl shadow-lg max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Enter your location..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <select className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>Dog</option>
                <option>Cat</option>
                <option>Bird</option>
                <option>Other</option>
              </select>
              <button className="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2">Verified Hosts</h3>
            <p className="text-gray-600">
              All hosts are background-checked and verified for your peace of mind.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-xl font-semibold mb-2">Nearby Care</h3>
            <p className="text-gray-600">
              Find pet hosts in your neighborhood for easy drop-off and pick-up.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">Daily Updates</h3>
            <p className="text-gray-600">
              Get photos and updates from your host throughout your pet&apos;s stay.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-primary-500 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Become a Pet Host</h2>
          <p className="text-lg mb-6 opacity-90">
            Love animals? Earn extra income by hosting pets in your home.
          </p>
          <button className="px-8 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-100 font-medium">
            Apply Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-24 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; 2026 PetHaven. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
