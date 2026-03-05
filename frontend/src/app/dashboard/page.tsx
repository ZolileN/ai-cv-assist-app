'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/authService';
import CandidateForm from '@/components/CandidateForm';
import api from '@/lib/api';
import { Candidate } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);
  const [candidate, setCandidate] = React.useState<Candidate | undefined>(undefined);
  const [loading, setLoading] = React.useState(true);

  const loadCandidateProfile = React.useCallback(async () => {
    const response = await api.get('/api/candidates');
    const profiles = Array.isArray(response.data) ? response.data : [];
    setCandidate(profiles[0]);
  }, []);

  React.useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        router.replace('/auth/login');
        return;
      }

      if (!mounted) return;
      setUser(currentUser);
      setLoading(false);

      // Best-effort profile refresh; do not bounce user on transient failures.
      try {
        const [me] = await Promise.all([
          authService.getMe(),
          loadCandidateProfile(),
        ]);
        if (!mounted) return;
        setUser(me);
      } catch {
        // Keep dashboard accessible; request interceptor handles real 401 flows.
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, [router, loadCandidateProfile]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-300">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
          Loading dashboard...
        </span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-cyan-300">TalentSignal</p>
        <h1 className="mb-2 text-4xl font-bold text-white">Dashboard</h1>
        <p className="mb-8 text-sm text-slate-400">
          Manage your profile signal and keep your career positioning recruiter-ready.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur">
            <h2 className="mb-6 text-2xl font-bold text-white">Your Profile</h2>
            <CandidateForm candidate={candidate} onSuccess={loadCandidateProfile} clearAfterSave />
          </div>

          <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur">
            <h2 className="mb-6 text-2xl font-bold text-white">Quick Stats</h2>
            <div className="space-y-4">
              <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-4">
                <p className="text-sm text-cyan-200">Welcome back</p>
                <p className="text-2xl font-bold text-white">{user?.full_name}</p>
              </div>
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4">
                <p className="text-sm text-emerald-200">Email</p>
                <p className="text-lg font-semibold text-white">{user?.email}</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-4">
                <p className="text-sm text-slate-400">Status</p>
                <p className="text-lg font-semibold text-slate-200">Profile active</p>
              </div>

              <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-4">
                <p className="mb-3 text-sm text-slate-400">Saved Profile</p>
                {candidate ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500">Title</p>
                      <p className="text-sm font-semibold text-white">{candidate.title}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Summary</p>
                      <p className="text-sm text-slate-200">{candidate.summary || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Phone</p>
                      <p className="text-sm text-slate-200">{candidate.phone || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Location</p>
                      <p className="text-sm text-slate-200">{candidate.location || 'Not set'}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No saved profile yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
