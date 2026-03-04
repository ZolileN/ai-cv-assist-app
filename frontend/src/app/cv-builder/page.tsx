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
    formState: { errors },
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

  const onSubmit = async (data: CVFormValues) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const token = localStorage.getItem("access_token") || "";

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
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CV builder</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="w-full border p-2 rounded"
          />
          {errors.name && (
            <p className="text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Location</label>
          <input
            {...register("location", { required: "Location is required" })}
            className="w-full border p-2 rounded"
          />
          {errors.location && (
            <p className="text-red-500">{errors.location.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Years of experience</label>
          <input
            type="number"
            {...register("years_experience", {
              valueAsNumber: true,
              min: 0,
            })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Desired role</label>
          <input
            {...register("desired_role", {
              required: "Desired role is required",
            })}
            className="w-full border p-2 rounded"
          />
          {errors.desired_role && (
            <p className="text-red-500">{errors.desired_role.message}</p>
          )}
        </div>

        <fieldset className="border rounded p-4">
          <legend className="font-semibold">Work experience</legend>

          {fields.map((field, idx) => (
            <div
              key={field.id}
              className="mb-4 border-b pb-2"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Job {idx + 1}</h4>
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>

              <div className="mt-2 space-y-2">
                <div>
                  <label className="block text-sm">Job title</label>
                  <input
                    {...register(`experiences.${idx}.job_title` as const, {
                      required: true,
                    })}
                    className="w-full border p-1 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm">Company</label>
                  <input
                    {...register(`experiences.${idx}.company` as const, {
                      required: true,
                    })}
                    className="w-full border p-1 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm">Duration</label>
                  <input
                    {...register(`experiences.${idx}.duration` as const, {
                      required: true,
                    })}
                    className="w-full border p-1 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm">Responsibilities</label>
                  <textarea
                    {...register(
                      `experiences.${idx}.responsibilities` as const
                    )}
                    rows={3}
                    className="w-full border p-1 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm">Achievements</label>
                  <textarea
                    {...register(`experiences.${idx}.achievements` as const)}
                    rows={3}
                    className="w-full border p-1 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm">Tools used</label>
                  <input
                    {...register(`experiences.${idx}.tools` as const)}
                    className="w-full border p-1 rounded"
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
            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
          >
            Add job
          </button>
        </fieldset>

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Save CV
        </button>
      </form>
    </div>
  );
}