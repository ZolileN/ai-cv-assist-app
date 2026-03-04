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
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
            <CandidateForm />
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Quick Stats</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded">
                <p className="text-sm text-gray-600">Welcome back</p>
                <p className="text-2xl font-bold text-gray-900">{user?.full_name}</p>
              </div>
              <div className="p-4 bg-green-50 rounded">
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
