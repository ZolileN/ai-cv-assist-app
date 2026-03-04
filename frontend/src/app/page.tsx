export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-teal-50 to-cyan-100">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
            AI-powered career positioning intelligence
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Candidates build standout CVs | Recruiters find top talent fast.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Candidate Login</h2>
            <p className="mt-2 text-sm text-slate-600">
              Build your CV, manage experience, and improve profile quality.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="/auth/login?role=candidate"
                className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
              >
                Candidate Login
              </a>
              <a
                href="/auth/register?role=candidate"
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Candidate Register
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Recruiter Login</h2>
            <p className="mt-2 text-sm text-slate-600">
              Paste job descriptions, run matching, and review ranked candidate fit.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="/auth/login?role=recruiter"
                className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-900"
              >
                Recruiter Login
              </a>
              <a
                href="/auth/register?role=recruiter"
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Recruiter Register
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white/80 p-4 text-center text-sm text-slate-600">
          Need to compare candidate quality quickly? Use the recruiter dashboard after login.
        </div>
      </div>
    </main>
  );
}
