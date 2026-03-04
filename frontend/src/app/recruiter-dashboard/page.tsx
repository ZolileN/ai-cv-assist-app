'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { authService } from '@/lib/authService';
import api from '@/lib/api';

type MatchResult = {
  rank: number;
  candidate_id: number;
  candidate_name: string;
  match_percentage: number;
  years_experience: number;
  skills: string[];
  title?: string | null;
  location?: string | null;
};

type ComparisonData = {
  candidateName: string;
  beforeText: string;
  afterText: string;
};

function scoreColor(score: number): string {
  if (score >= 80) return 'bg-cyan-400';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-rose-500';
}

function buildComparisonData(result: MatchResult): ComparisonData {
  const skillText = result.skills.length ? result.skills.join(', ') : 'General tools';
  const beforeText = [
    `${result.candidate_name} was responsible for delivering project tasks.`,
    `Assisted with team initiatives and supported ongoing work.`,
    `Worked with ${skillText}.`,
  ].join('\n');

  const afterText = [
    `${result.candidate_name} led delivery of high-priority initiatives aligned to role requirements.`,
    `Improved execution quality with ${result.years_experience.toFixed(1)} years of relevant experience and strong collaboration.`,
    `Applied ${skillText} to produce measurable outcomes and a ${result.match_percentage.toFixed(2)}% match alignment.`,
  ].join('\n');

  return {
    candidateName: result.candidate_name,
    beforeText,
    afterText,
  };
}

export default function RecruiterDashboardPage() {
  const router = useRouter();
  const [pageLoading, setPageLoading] = React.useState(true);
  const [jobDescription, setJobDescription] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');
  const [results, setResults] = React.useState<MatchResult[]>([]);
  const [comparison, setComparison] = React.useState<ComparisonData | null>(null);

  React.useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }
    setPageLoading(false);
  }, [router]);

  const handleFindMatches = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResults([]);

    const trimmed = jobDescription.trim();
    if (!trimmed) {
      setError('Please paste a job description first.');
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post('/api/match', {
        job_description_text: trimmed,
      });
      setResults(response.data || []);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setError('Session expired. Please login again.');
      } else if (err?.response?.status >= 500) {
        setError('Server error while finding matches. Please try again shortly.');
      } else {
        setError(err?.response?.data?.detail || 'Failed to find matches.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-slate-950 py-20 text-center text-slate-300">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 shadow">
          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
          Loading dashboard...
        </span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-300">
            TalentSignal
          </p>
          <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">Recruiter Dashboard</h1>
          <p className="max-w-3xl text-sm text-slate-300 sm:text-base">
            Paste a job description, run semantic matching, and review ranked candidates with quick CV comparison.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="mb-8 mt-10 rounded-xl border border-slate-700 bg-slate-900/60 p-6 shadow-sm backdrop-blur">
          <form onSubmit={handleFindMatches} className="space-y-4">
            <label htmlFor="jd" className="block text-sm font-medium text-slate-200">
              Paste Job Description
            </label>
            <textarea
              id="jd"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={10}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
              placeholder="Paste full JD here..."
            />
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-cyan-400 hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Finding Matches...' : 'Find Matches'}
            </button>
          </form>
          {error && (
            <div className="mt-4 rounded-lg border border-rose-400/40 bg-rose-900/20 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900/60 shadow-sm backdrop-blur">
          <div className="border-b border-slate-700 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Ranked Candidates</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">#</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Candidate Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Match %</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Years Experience</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Skills</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">CV View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                {submitting && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-400">
                      Matching in progress...
                    </td>
                  </tr>
                )}
                {results.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-400">
                      No matches yet. Paste a job description and click Find Matches.
                    </td>
                  </tr>
                )}
                {results.map((item) => (
                  <tr key={`${item.candidate_id}-${item.rank}`}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">{item.rank}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">{item.candidate_name}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">
                      <div className="flex min-w-[180px] items-center gap-3">
                        <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-700">
                          <div
                            className={`h-full ${scoreColor(item.match_percentage)}`}
                            style={{ width: `${Math.max(0, Math.min(100, item.match_percentage))}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-cyan-200">
                          {item.match_percentage.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">{item.years_experience.toFixed(1)}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {item.skills?.length ? item.skills.join(', ') : 'N/A'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <button
                        type="button"
                        onClick={() => setComparison(buildComparisonData(item))}
                        className="rounded-md border border-slate-600 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-100 transition-colors hover:border-slate-400 hover:bg-slate-800"
                      >
                        Before vs After
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {comparison && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4">
          <div className="w-full max-w-4xl rounded-xl border border-slate-700 bg-slate-900 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
              <h3 className="text-lg font-semibold text-white">
                Before vs After CV: {comparison.candidateName}
              </h3>
              <button
                type="button"
                onClick={() => setComparison(null)}
                className="rounded-md px-3 py-1 text-sm font-medium text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
              <div className="rounded-lg border border-slate-700 bg-slate-950 p-4">
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">Before</h4>
                <pre className="whitespace-pre-wrap text-sm text-slate-200">{comparison.beforeText}</pre>
              </div>
              <div className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 p-4">
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-cyan-200">After</h4>
                <pre className="whitespace-pre-wrap text-sm text-cyan-100">{comparison.afterText}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
