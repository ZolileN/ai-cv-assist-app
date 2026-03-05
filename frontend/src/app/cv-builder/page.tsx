"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";

interface Experience {
  job_title: string;
  company: string;
  duration: string;
  responsibilities: string;
  achievements: string;
  tools: string;
}

interface CVFormValues {
  name: string;
  location: string;
  years_experience: number;
  desired_role: string;
  experiences: Experience[];
}

export default function CVBuilderPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CVFormValues>({
    defaultValues: {
      experiences: [
        {
          job_title: "",
          company: "",
          duration: "",
          responsibilities: "",
          achievements: "",
          tools: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "experiences",
    control,
  });

  const inputClass =
    "w-full rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20";
  const labelClass = "mb-2 block text-sm font-medium text-slate-200";
  const errorClass = "mt-1 text-sm text-rose-300";

  const onSubmit = async (data: CVFormValues) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/backend";
      const token = localStorage.getItem("token") || "";

      const res = await fetch(`${apiUrl}/api/candidates/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.detail || "Failed to save CV");
      }

      // navigate to dashboard on success
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-700/60 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur sm:p-8">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-cyan-300">
          TalentSignal
        </p>
        <h1 className="mb-2 text-center text-3xl font-bold text-white">CV Builder</h1>
        <p className="mb-8 text-center text-sm text-slate-400">
          Structure your experience with measurable impact for stronger recruiter visibility.
        </p>

        {error && (
          <div className="mb-5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className={labelClass}>Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className={inputClass}
            placeholder="Your full name"
          />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Location</label>
          <input
            {...register("location", { required: "Location is required" })}
            className={inputClass}
            placeholder="City, Country"
          />
            {errors.location && <p className={errorClass}>{errors.location.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Years of experience</label>
          <input
            type="number"
            {...register("years_experience", {
              valueAsNumber: true,
              min: 0,
            })}
            className={inputClass}
            placeholder="0"
          />
          </div>

          <div>
            <label className={labelClass}>Desired role</label>
          <input
            {...register("desired_role", {
              required: "Desired role is required",
            })}
            className={inputClass}
            placeholder="e.g., Senior Backend Engineer"
          />
          {errors.desired_role && (
              <p className={errorClass}>{errors.desired_role.message}</p>
          )}
          </div>

          <fieldset className="rounded-xl border border-slate-700 bg-slate-950/50 p-5">
            <legend className="px-2 text-sm font-semibold uppercase tracking-wide text-cyan-300">
              Work Experience
            </legend>

            {fields.map((field, idx) => (
              <div
                key={field.id}
                className="mb-4 rounded-lg border border-slate-700/70 bg-slate-900/60 p-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-200">Job {idx + 1}</h4>
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="rounded-md border border-rose-500/40 px-2.5 py-1 text-xs font-medium text-rose-300 transition-colors hover:bg-rose-500/10"
                >
                  Remove
                </button>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className={labelClass}>Job title</label>
                  <input
                    {...register(`experiences.${idx}.job_title` as const, {
                      required: true,
                    })}
                    className={inputClass}
                    placeholder="Role title"
                  />
                  </div>

                  <div>
                    <label className={labelClass}>Company</label>
                  <input
                    {...register(`experiences.${idx}.company` as const, {
                      required: true,
                    })}
                    className={inputClass}
                    placeholder="Company name"
                  />
                  </div>

                  <div>
                    <label className={labelClass}>Duration</label>
                  <input
                    {...register(`experiences.${idx}.duration` as const, {
                      required: true,
                    })}
                    className={inputClass}
                    placeholder="e.g., Jan 2021 - Dec 2023"
                  />
                  </div>

                  <div>
                    <label className={labelClass}>Responsibilities</label>
                  <textarea
                    {...register(
                      `experiences.${idx}.responsibilities` as const
                    )}
                    rows={3}
                    className={inputClass}
                    placeholder="Scope, ownership, and key responsibilities"
                  />
                  </div>

                  <div>
                    <label className={labelClass}>Achievements</label>
                  <textarea
                    {...register(`experiences.${idx}.achievements` as const)}
                    rows={3}
                    className={inputClass}
                    placeholder="Quantified outcomes and notable wins"
                  />
                  </div>

                  <div>
                    <label className={labelClass}>Tools used</label>
                  <input
                    {...register(`experiences.${idx}.tools` as const)}
                    className={inputClass}
                    placeholder="Comma-separated tools, frameworks, platforms"
                  />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                append({
                  job_title: "",
                  company: "",
                  duration: "",
                  responsibilities: "",
                  achievements: "",
                  tools: "",
                })
              }
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-700 sm:w-auto"
            >
              Add job
            </button>
          </fieldset>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-cyan-500 px-4 py-2.5 font-semibold text-slate-950 transition-colors hover:bg-cyan-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-200"
          >
            {isSubmitting ? "Saving..." : "Save CV"}
          </button>
        </form>
      </div>
    </main>
  );
}
