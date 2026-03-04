'use client';

import Link from 'next/link';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white py-8 px-6 shadow rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
          Login
        </h2>
        <LoginForm />
        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-blue-600 hover:text-blue-800 font-medium">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
