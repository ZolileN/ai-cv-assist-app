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
  location?: string | null;
};

export default function RecruiterDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [jobDescription, setJobDescription] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');
  const [results, setResults] = React.useState<MatchResult[]>([]);

  React.useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }
    setLoading(false);
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
      setError(err?.response?.data?.detail || 'Failed to find matches.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Recruiter Dashboard</h1>

        <section className="mb-8 rounded-lg bg-white p-6 shadow">
          <form onSubmit={handleFindMatches} className="space-y-4">
            <label htmlFor="jd" className="block text-sm font-medium text-gray-700">
              Paste Job Description
            </label>
            <textarea
              id="jd"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={10}
              className="w-full rounded-md border border-gray-300 p-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Paste full JD here..."
            />
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Finding Matches...' : 'Find Matches'}
            </button>
          </form>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </section>

        <section className="overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Ranked Candidates</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">#</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Candidate Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Match %</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Years Experience</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Skills</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {results.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                      No matches yet. Paste a job description and click Find Matches.
                    </td>
                  </tr>
                )}
                {results.map((item) => (
                  <tr key={`${item.candidate_id}-${item.rank}`}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{item.rank}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{item.candidate_name}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{item.match_percentage.toFixed(2)}%</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{item.years_experience.toFixed(1)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.skills?.length ? item.skills.join(', ') : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
