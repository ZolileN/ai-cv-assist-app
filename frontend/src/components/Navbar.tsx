'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authService } from '@/lib/authService';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = React.useState<any>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setMobileOpen(false);
    router.push('/auth/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/recruiter-dashboard', label: 'Recruiter' },
    { href: '/cv-builder', label: 'Build CV' },
  ];

  const linkClass = (href: string) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      pathname === href
        ? 'bg-cyan-500/15 text-cyan-200'
        : 'text-slate-200 hover:bg-slate-800 hover:text-slate-200'
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-cyan-400" />
            <span className="text-lg font-bold tracking-tight text-white">TalentSignal</span>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            {user &&
              navItems.map((item) => (
                <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                  {item.label}
                </Link>
              ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                <span className="max-w-[180px] truncate rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300">
                  {user.full_name}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-md border border-rose-400/60 px-3 py-1.5 text-sm font-medium text-rose-200 transition-colors hover:bg-rose-500/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800 hover:text-slate-200"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-md bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400 hover:text-slate-950"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="inline-flex items-center rounded-md p-2 text-slate-200 hover:bg-slate-800 md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-800 py-3 md:hidden">
            <div className="space-y-1">
              {user &&
                navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block ${linkClass(item.href)}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

              {user ? (
                <>
                  <p className="px-3 py-2 text-xs font-medium text-slate-400">{user.full_name}</p>
                  <button
                    onClick={handleLogout}
                    className="mx-3 mt-1 w-[calc(100%-1.5rem)] rounded-md border border-rose-400/60 px-3 py-2 text-sm font-medium text-rose-200 transition-colors hover:bg-rose-500/10"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block rounded-md px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800 hover:text-slate-200"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="mx-3 mt-1 block rounded-md bg-cyan-500 px-3 py-2 text-center text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400 hover:text-slate-950"
                    onClick={() => setMobileOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
