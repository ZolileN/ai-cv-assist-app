'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { Candidate } from '@/types';

interface CandidateFormData {
  title: string;
  summary?: string;
  phone?: string;
  location?: string;
}

interface CandidateFormProps {
  candidate?: Candidate;
  onSuccess?: () => void;
}

export default function CandidateForm({ candidate, onSuccess }: CandidateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CandidateFormData>({
    defaultValues: candidate || {},
  });
  const [error, setError] = React.useState('');

  const onSubmit = async (data: CandidateFormData) => {
    try {
      setError('');
      if (candidate) {
        await api.put(`/api/candidates/${candidate.id}`, data);
      } else {
        await api.post('/api/candidates/', data);
      }
      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save candidate');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Professional Title</label>
        <input
          {...register('title', { required: 'Title is required' })}
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Senior Software Engineer"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Professional Summary</label>
        <textarea
          {...register('summary')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
          placeholder="Tell us about your professional background..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Phone</label>
        <input
          {...register('phone')}
          type="tel"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="+1 (555) 000-0000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Location</label>
        <input
          {...register('location')}
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="City, Country"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
      >
        {isSubmitting ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
}
