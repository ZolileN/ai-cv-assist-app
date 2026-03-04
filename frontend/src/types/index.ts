export interface User {
  id: number;
  email: string;
  full_name: string;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Candidate {
  id: number;
  user_id: number;
  title: string;
  summary?: string;
  phone?: string;
  location?: string;
  created_at: string;
  updated_at: string;
  experiences: Experience[];
}

export interface Experience {
  id: number;
  candidate_id: number;
  company: string;
  position: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  is_current: string;
  created_at: string;
}

export interface JobDescription {
  id: number;
  recruiter_id: number;
  title: string;
  description: string;
  required_skills?: string;
  experience_required?: number;
  salary_min?: number;
  salary_max?: number;
  location?: string;
  is_active: string;
  created_at: string;
  updated_at: string;
}

export interface Recruiter {
  id: number;
  user_id: number;
  company_name: string;
  phone?: string;
  website?: string;
  created_at: string;
  updated_at: string;
  job_descriptions: JobDescription[];
}
