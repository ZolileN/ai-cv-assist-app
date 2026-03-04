export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to AI CV App
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect candidates with recruiters and manage job opportunities
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="auth/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Get Started
            </a>
            <a
              href="auth/login"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg border border-blue-600 hover:bg-blue-50 font-medium"
            >
              Login
            </a>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">For Candidates</h2>
            <p className="text-gray-600">
              Create your professional profile, manage your work experience, and connect with recruiters.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">For Recruiters</h2>
            <p className="text-gray-600">
              Post job descriptions, find qualified candidates, and manage your hiring process.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Secure & Fast</h2>
            <p className="text-gray-600">
              JWT-based authentication, PostgreSQL database, and modern tech stack for reliability.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
