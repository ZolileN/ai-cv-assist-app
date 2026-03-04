# AI CV App

A full-stack application for connecting candidates with recruiters. Built with Next.js, FastAPI, PostgreSQL, and modern web technologies.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Candidate Profiles**: Create and manage professional profiles with work experience
- **Recruiter Profiles**: Post job descriptions and manage hiring
- **Work Experience Management**: Track employment history and details
- **Job Descriptions**: Recruiters can create and manage job postings
- **Secure API**: CORS-enabled, environment-based configuration
- **Modern Stack**: TypeScript, React Hook Form, TailwindCSS, SQLAlchemy

## 📋 Project Structure

```
ai-cv-app/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # Reusable React components
│   │   ├── lib/             # Utilities and services
│   │   ├── types/           # TypeScript type definitions
│   │   └── globals.css      # Global styles
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── next.config.js
│
├── backend/                  # FastAPI backend application
│   ├── app/
│   │   ├── core/            # Configuration and security
│   │   ├── models/          # SQLAlchemy ORM models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── routes/          # API endpoints
│   │   └── main.py          # FastAPI app
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
│
├── docker-compose.yml       # Docker Compose configuration
└── README.md               # This file
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with TypeScript
- **TailwindCSS** - Utility-first CSS framework
- **React Hook Form** - Performant form handling
- **Axios** - HTTP client

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **Pydantic** - Data validation
- **PostgreSQL** - Database
- **Python-Jose** - JWT token handling

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose (recommended)
- OR Node.js 18+ and Python 3.11+
- PostgreSQL 16 (if not using Docker)

### Option 1: Using Docker Compose (Recommended)

1. **Clone and navigate to project**
   ```bash
   cd ai-cv-app
   ```

2. **Create environment files**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   
   # Frontend
   cp frontend/.env.local.example frontend/.env.local
   ```

3. **Start services**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Option 2: Local Development Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. **Create database**
   ```bash
   # Make sure PostgreSQL is running
   # Update DATABASE_URL in .env if needed
   ```

6. **Run migrations and start server**
   ```bash
   uvicorn app.main:app --reload
   ```

   Backend will be available at http://localhost:8000

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Update NEXT_PUBLIC_API_URL if your backend is on a different URL
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Frontend will be available at http://localhost:3000

## 📚 API Documentation

All API endpoints are documented at `/docs` when the backend is running.

### Authentication Endpoints

```
POST   /api/auth/register   - Register new user
POST   /api/auth/login      - Login user
GET    /api/auth/me         - Get current user info
```

### Candidate Endpoints

```
POST   /api/candidates/                           - Create candidate profile
GET    /api/candidates/                           - List user's candidates
GET    /api/candidates/{candidate_id}             - Get candidate
PUT    /api/candidates/{candidate_id}             - Update candidate
DELETE /api/candidates/{candidate_id}             - Delete candidate

POST   /api/candidates/{candidate_id}/experiences - Add experience
GET    /api/candidates/{candidate_id}/experiences - List experiences
PUT    /api/candidates/experiences/{experience_id} - Update experience
DELETE /api/candidates/experiences/{experience_id} - Delete experience
```

### Recruiter Endpoints

```
POST   /api/recruiters/                              - Create recruiter profile
GET    /api/recruiters/                              - List user's recruiters
GET    /api/recruiters/{recruiter_id}                - Get recruiter
PUT    /api/recruiters/{recruiter_id}                - Update recruiter
DELETE /api/recruiters/{recruiter_id}                - Delete recruiter

POST   /api/recruiters/{recruiter_id}/jobs           - Create job description
GET    /api/recruiters/{recruiter_id}/jobs           - List jobs
PUT    /api/recruiters/jobs/{job_id}                 - Update job
DELETE /api/recruiters/jobs/{job_id}                 - Delete job
```

## 🗄️ Database Models

### User
- `id` (Integer, PK)
- `email` (String, unique)
- `hashed_password` (String)
- `full_name` (String)
- `created_at` (DateTime)

### Candidate
- `id` (Integer, PK)
- `user_id` (Integer, FK)
- `title` (String)
- `summary` (Text)
- `phone` (String)
- `location` (String)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### Experience
- `id` (Integer, PK)
- `candidate_id` (Integer, FK)
- `company` (String)
- `position` (String)
- `description` (Text)
- `start_date` (DateTime)
- `end_date` (DateTime)
- `is_current` (String)
- `created_at` (DateTime)

### JobDescription
- `id` (Integer, PK)
- `recruiter_id` (Integer, FK)
- `title` (String)
- `description` (Text)
- `required_skills` (Text)
- `experience_required` (Integer)
- `salary_min` (Float)
- `salary_max` (Float)
- `location` (String)
- `is_active` (String)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### Recruiter
- `id` (Integer, PK)
- `user_id` (Integer, FK)
- `company_name` (String)
- `phone` (String)
- `website` (String)
- `created_at` (DateTime)
- `updated_at` (DateTime)

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. Users register or login
2. Backend returns access token
3. Token is stored in localStorage
4. Token is sent in Authorization header for protected endpoints
5. Token expires after 30 minutes (configurable)

## 📝 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@host:port/dbname
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
DEBUG=True
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🚢 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f postgres

# Stop services
docker-compose down

# Rebuild images
docker-compose build

# Remove volumes (careful - deletes data)
docker-compose down -v
```

## 📦 Frontend Components

- **Navbar** - Navigation with user info and logout
- **LoginForm** - User login form with validation
- **RegisterForm** - User registration with password confirmation
- **CandidateForm** - Create/update candidate profiles

## 🧪 Testing the Application

1. **Register a new account**
   - Go to http://localhost:3000/auth/register
   - Fill in the form and submit

2. **Create a candidate profile**
   - After login, go to dashboard
   - Fill in your professional information
   - Save profile

3. **Test API with cURL**
   ```bash
   # Login
   curl -X POST http://localhost:8000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"your@email.com","password":"password"}'
   
   # Use token to create candidate
   curl -X POST http://localhost:8000/api/candidates/ \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"title":"Software Engineer","summary":"..."}'
   ```

## 🚀 Production Deployment

### Before deploying:

1. **Change SECRET_KEY** in backend .env to a strong random string
2. **Update ALLOWED_ORIGINS** for your domain
3. **Set DEBUG=False** in production
4. **Use a production database** (not SQLite)
5. **Use environment-specific settings**

### Docker Deployment

```bash
# Build production images
docker-compose -f docker-compose.yml build

# Deploy
docker-compose up -d
```

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## 🐛 Troubleshooting

### Database connection error
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify credentials and host

### CORS errors
- Check ALLOWED_ORIGINS in backend .env
- Make sure frontend URL is included
- Restart backend after changes

### Frontend can't reach backend
- Check NEXT_PUBLIC_API_URL in frontend .env.local
- Ensure backend is running
- Check firewall/network settings

### Docker issues
- Clear old containers: `docker-compose down -v`
- Rebuild images: `docker-compose build --no-cache`
- Check Docker logs: `docker-compose logs`

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit pull requests.

## 📞 Support

For issues or questions, please create an issue in the repository.
