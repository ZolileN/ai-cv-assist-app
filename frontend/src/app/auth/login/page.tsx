import Link from 'next/link';
import dynamic from 'next/dynamic';

const LoginForm = dynamic(() => import('@/components/LoginForm'), {
  ssr: false,
  loading: () => (
    <div className="space-y-5">
      <div className="h-24 animate-pulse rounded-lg bg-slate-800" />
      <div className="h-24 animate-pulse rounded-lg bg-slate-800" />
      <div className="h-10 animate-pulse rounded-lg bg-slate-800" />
    </div>
  ),
});

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-700/60 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-cyan-300">
          TalentSignal
        </p>
        <h2 className="mb-2 text-center text-3xl font-bold text-white">Welcome Back</h2>
        <p className="mb-6 text-center text-sm text-slate-400">
          Continue optimizing your career positioning.
        </p>
        <LoginForm />
        <p className="mt-5 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link href="/auth/register" className="font-semibold text-cyan-300 hover:text-cyan-200">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
