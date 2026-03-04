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
  if (score >= 80) return 'bg-emerald-500';
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
      <div className="py-20 text-center text-gray-600">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow">
          <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
          Loading dashboard...
        </span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">Recruiter Dashboard</h1>
        <p className="mb-6 text-sm text-slate-600">
          Paste a job description, run matching, and review ranked candidates with quick CV comparison.
        </p>

        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleFindMatches} className="space-y-4">
            <label htmlFor="jd" className="block text-sm font-medium text-slate-700">
              Paste Job Description
            </label>
            <textarea
              id="jd"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={10}
              className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
              placeholder="Paste full JD here..."
            />
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Finding Matches...' : 'Find Matches'}
            </button>
          </form>
          {error && (
            <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Ranked Candidates</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">#</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Candidate Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Match %</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Years Experience</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Skills</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">CV View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {submitting && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">
                      Matching in progress...
                    </td>
                  </tr>
                )}
                {results.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">
                      No matches yet. Paste a job description and click Find Matches.
                    </td>
                  </tr>
                )}
                {results.map((item) => (
                  <tr key={`${item.candidate_id}-${item.rank}`}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">{item.rank}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">{item.candidate_name}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                      <div className="flex min-w-[180px] items-center gap-3">
                        <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full ${scoreColor(item.match_percentage)}`}
                            style={{ width: `${Math.max(0, Math.min(100, item.match_percentage))}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-700">
                          {item.match_percentage.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">{item.years_experience.toFixed(1)}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {item.skills?.length ? item.skills.join(', ') : 'N/A'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <button
                        type="button"
                        onClick={() => setComparison(buildComparisonData(item))}
                        className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
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
          <div className="w-full max-w-4xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Before vs After CV: {comparison.candidateName}
              </h3>
              <button
                type="button"
                onClick={() => setComparison(null)}
                className="rounded-md px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-600">Before</h4>
                <pre className="whitespace-pre-wrap text-sm text-slate-700">{comparison.beforeText}</pre>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-700">After</h4>
                <pre className="whitespace-pre-wrap text-sm text-emerald-800">{comparison.afterText}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
