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
  const inputClass =
    'w-full rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20';
  const labelClass = 'mb-2 block text-sm font-medium text-slate-200';
  const errorClass = 'mt-1 text-sm text-rose-300';

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      <div>
        <label className={labelClass}>Professional Title</label>
        <input
          {...register('title', { required: 'Title is required' })}
          type="text"
          className={inputClass}
          placeholder="e.g., Senior Software Engineer"
        />
        {errors.title && (
          <p className={errorClass}>{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>Professional Summary</label>
        <textarea
          {...register('summary')}
          className={`${inputClass} h-24`}
          placeholder="Tell us about your professional background..."
        />
      </div>

      <div>
        <label className={labelClass}>Phone</label>
        <input
          {...register('phone')}
          type="tel"
          className={inputClass}
          placeholder="+27 (082) 000-0000"
        />
      </div>

      <div>
        <label className={labelClass}>Location</label>
        <input
          {...register('location')}
          type="text"
          className={inputClass}
          placeholder="City, Country"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-cyan-500 px-4 py-2.5 font-semibold text-slate-950 transition-colors hover:bg-cyan-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-200"
      >
        {isSubmitting ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
}
