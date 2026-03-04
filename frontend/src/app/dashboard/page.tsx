'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/authService';
import CandidateForm from '@/components/CandidateForm';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/auth/login');
    } else {
      setUser(currentUser);
      setLoading(false);
    }
  }, [router]);

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
            <CandidateForm />
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
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
