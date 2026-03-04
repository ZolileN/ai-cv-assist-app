export default function Home() {
  const primaryCtaClass =
    "inline-flex w-full items-center justify-center rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-cyan-400 hover:text-slate-950 hover:shadow-cyan-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:w-auto";
  const secondaryCtaClass =
    "inline-flex w-full items-center justify-center rounded-lg border border-slate-600 bg-transparent px-6 py-3 text-sm font-semibold text-slate-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:border-slate-400 hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:w-auto";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-cyan-300">
            TalentSignal
          </p>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">
            The Intelligence Layer for Career Positioning.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-300">
            TalentSignal enhances candidate profiles with AI-driven optimization, skill benchmarking, and recruiter-aligned scoring
            — transforming how talent is discovered and evaluated.
          </p>
          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/auth/register?role=candidate"
              className={primaryCtaClass}
            >
              Start as a Candidate
            </a>
            <a
              href="/auth/login?role=recruiter"
              className={secondaryCtaClass}
            >
              Recruiter Access
            </a>
          </div>
          <p className="mt-4 text-sm text-slate-400">
            Free for candidates. Built for modern hiring teams.
          </p>
        </div>
      </section>

      <section className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">The Problem We Solve</h2>
          <p className="mt-3 text-xl font-semibold text-cyan-200">Most Careers Are Undersignaled.</p>
          <p className="mx-auto mt-6 max-w-4xl text-slate-300">
            Strong professionals get overlooked — not because they lack skill, but because their experience isn’t structured,
            quantified, or aligned to how recruiters search.
          </p>
          <p className="mx-auto mt-4 max-w-4xl text-slate-300">
            Recruiters, meanwhile, spend hours filtering inconsistent CVs with limited visibility into impact, seniority alignment,
            and skill depth.
          </p>
          <p className="mt-6 text-slate-300">The result:</p>
          <ul className="mx-auto mt-3 max-w-2xl space-y-2 text-slate-200">
            <li>Missed opportunities</li>
            <li>Slower hiring cycles</li>
            <li>Poor signal-to-noise ratio</li>
          </ul>
          <p className="mx-auto mt-6 max-w-4xl text-slate-300">
            Hiring has evolved. Career positioning hasn’t.
          </p>
          <p className="mx-auto mt-2 max-w-4xl text-cyan-200">TalentSignal closes that gap.</p>
        </div>
      </section>

      <section className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">How TalentSignal Works</h2>
          <p className="mt-3 text-lg text-slate-300">Structured Intelligence for Both Sides of Hiring</p>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
              <h3 className="text-lg font-semibold text-cyan-200">1. Structured Profile Capture</h3>
              <p className="mt-2 text-sm text-slate-300">
                Candidates build experience using guided inputs designed to extract measurable outcomes, tools, and scope — not vague descriptions.
              </p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
              <h3 className="text-lg font-semibold text-cyan-200">2. AI Optimization Engine</h3>
              <p className="mt-2 text-sm text-slate-300">
                Our AI enhances bullet points, aligns terminology to job descriptions, and strengthens impact clarity without fabricating information.
              </p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
              <h3 className="text-lg font-semibold text-cyan-200">3. Market Alignment Analysis</h3>
              <p className="mt-2 text-sm text-slate-300">Paste a job description and receive:</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-200">
                <li>Skill match score</li>
                <li>Seniority alignment</li>
                <li>Keyword coverage</li>
                <li>Gap insights</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
              <h3 className="text-lg font-semibold text-cyan-200">4. Recruiter Visibility & Ranking</h3>
              <p className="mt-2 text-sm text-slate-300">
                Opt in to be discoverable. Recruiters access AI-ranked candidates based on semantic matching, structured skill data, and verified profile strength.
              </p>
            </div>
          </div>
          <p className="mt-6 text-slate-200">The result: clarity on both sides.</p>
        </div>
      </section>

      <section className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">Built for Data-Driven Hiring Teams</h2>
          <p className="mt-3 text-xl font-semibold text-cyan-200">Recruit Beyond Keywords.</p>
          <p className="mx-auto mt-6 max-w-4xl text-slate-300">
            Traditional job boards rely on static filters. TalentSignal applies intelligence.
          </p>
          <p className="mt-4 text-slate-300">Recruiters can:</p>
          <ul className="mx-auto mt-3 max-w-3xl space-y-2 text-slate-200">
            <li>Paste job descriptions to generate ranked matches</li>
            <li>Filter by location, skill clusters, and experience depth</li>
            <li>View impact density and quantified achievement scores</li>
            <li>Identify alignment risks before interviews</li>
          </ul>
          <p className="mt-6 text-slate-300">This isn’t another job board.</p>
          <p className="mt-2 text-cyan-200">It’s a signal optimization layer that improves hiring precision.</p>
        </div>
      </section>

      <section className="bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">The Future of Career Capital</h2>
          <p className="mt-3 text-xl font-semibold text-cyan-200">Careers Are Signals. We Help You Optimize Them.</p>
          <p className="mx-auto mt-6 max-w-4xl text-slate-300">
            TalentSignal is building the infrastructure for modern career positioning — where:
          </p>
          <ul className="mx-auto mt-3 max-w-2xl space-y-2 text-slate-200">
            <li>Skills are structured</li>
            <li>Experience is measurable</li>
            <li>Market alignment is visible</li>
            <li>Discovery is intelligent</li>
          </ul>
          <p className="mx-auto mt-6 max-w-4xl text-slate-300">
            For candidates, this means stronger positioning and clearer direction. For recruiters, it means faster decisions and higher-quality matches.
          </p>
          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/auth/login?role=candidate"
              className={primaryCtaClass}
            >
              Get Your Talent Score
            </a>
            <a
              href="/auth/login?role=recruiter"
              className={secondaryCtaClass}
            >
              Request Recruiter Access
            </a>
          </div>
          <div className="mt-10 border-t border-slate-700 pt-6">
            <p className="text-lg font-semibold text-white">TalentSignal</p>
            <p className="text-sm text-slate-400">AI-Powered Career Positioning Intelligence</p>
          </div>
        </div>
      </section>
    </main>
  );
}
