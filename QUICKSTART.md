# Quick Start Guide - AI CV App

## 🚀 Fastest Way to Get Started (5 minutes)

### Prerequisites
- Docker and Docker Compose installed
- Git (to clone the repository)

### Steps

```bash
# 1. Navigate to project
cd ai-cv-app

# 2. Start all services
docker-compose up -d

# 3. Wait for services to be ready (30 seconds)
# 4. Open your browser
```

**That's it! You now have:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

---

## 💻 Local Development (without Docker)

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 16

### Terminal 1: Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env and set your database credentials

# Run server
uvicorn app.main:app --reload
```

Backend will be at: http://localhost:8000

### Terminal 2: Frontend

```bash
cd frontend

# Install dependencies
npm install

# Set up environment
cp .env.local.example .env.local

# Run development server
npm run dev
```

Frontend will be at: http://localhost:3000

---

## 📝 First Steps After Starting

### 1. Register an Account
1. Go to http://localhost:3000
2. Click "Get Started" or navigate to `/auth/register`
3. Fill in your details and register
4. You'll be logged in automatically

### 2. Create Your Profile
1. You'll be redirected to the dashboard
2. Fill in your professional information
3. Click "Save Profile"

### 3. Test API Endpoints
Run the API testing script:
```bash
chmod +x test-api.sh
./test-api.sh
```

This tests all 24 endpoints automatically.

---

## 🧪 Testing the Application

### Using the Web Interface
1. Register → Dashboard → Save Profile → Add Experience

### Using cURL
```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"pass123","full_name":"Test User"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"pass123"}'

# Create candidate (replace TOKEN with response token)
curl -X POST http://localhost:8000/api/candidates/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Engineer","summary":"Exp dev"}'
```

### Using Postman
1. Download Postman: https://www.postman.com/downloads/
2. Import the API_COLLECTION.json file
3. Set BASE_URL variable: http://localhost:8000
4. Register and copy the token to TOKEN variable
5. Test all endpoints

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Complete setup and usage guide |
| DEPLOYMENT.md | Production deployment instructions |
| PROJECT_SUMMARY.md | Project overview and features |
| FILE_STRUCTURE.md | Detailed file organization |
| API_COLLECTION.json | Postman API testing collection |
| test-api.sh | Automated API testing script |

---

## 🔑 Key URLs

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Frontend home page |
| http://localhost:3000/auth/login | Login page |
| http://localhost:3000/auth/register | Register page |
| http://localhost:3000/dashboard | User dashboard |
| http://localhost:8000 | Backend API root |
| http://localhost:8000/docs | Interactive API documentation |
| http://localhost:8000/redoc | ReDoc API documentation |
| http://localhost:8000/health | Health check |

---

## 🛑 Common Issues

### "Port already in use"
```bash
# Kill process on port
lsof -i :8000  # Find what's using port 8000
kill -9 <PID>  # Kill the process
```

### Database connection error
```bash
# Check PostgreSQL is running
# Update DATABASE_URL in backend/.env
# Ensure credentials match
```

### Frontend can't reach backend
```bash
# Check NEXT_PUBLIC_API_URL in frontend/.env.local
# Ensure it points to http://localhost:8000
```

### Docker issues
```bash
# View logs
docker-compose logs backend
docker-compose logs postgres

# Restart services
docker-compose restart

# Clean up and rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

---

## 🎯 Example Workflow

### 1. Create Account
```
Register → Login → Redirected to Dashboard
```

### 2. Create Candidate Profile
```
Dashboard → Fill "Your Profile" → Save Profile
```

### 3. Add Work Experience
```
Dashboard → Add Experience → Save
```

### 4. Create Recruiter Profile (in recruiter flow)
```
API: POST /api/recruiters/ → Create job posting
```

---

## 🔧 Environment Variables Quick Reference

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/ai_cv_db
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

---

## 📦 Docker Compose Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f postgres

# Rebuild images
docker-compose build

# Full reset (careful - deletes data)
docker-compose down -v
docker-compose up -d
```

---

## 🎓 Example API Requests

### Register User
```bash
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
```

### Create Candidate
```bash
POST /api/candidates/
Headers: Authorization: Bearer {TOKEN}
{
  "title": "Senior Engineer",
  "summary": "10 years experience",
  "phone": "+1-555-0000",
  "location": "San Francisco"
}
```

### Add Experience
```bash
POST /api/candidates/{candidate_id}/experiences
Headers: Authorization: Bearer {TOKEN}
{
  "company": "Tech Corp",
  "position": "Lead Engineer",
  "description": "Led team",
  "start_date": "2020-01-01T00:00:00",
  "is_current": "true"
}
```

---

## 🚀 Next Steps

1. **Explore the API**: Visit http://localhost:8000/docs
2. **Create test data**: Register accounts and create profiles
3. **Review code**: Check backend models and routes
4. **Customize styling**: Modify TailwindCSS configuration
5. **Add features**: Extend models and add new endpoints
6. **Deploy**: Follow DEPLOYMENT.md for production setup

---

## 💡 Tips

- Check logs if something doesn't work: `docker-compose logs backend`
- API documentation is interactive at `/docs` - try endpoints there
- All code is commented and well-organized
- Database is automatically created on first run
- Both frontend and backend support hot reload during development

---

## 🎉 You're Ready!

The application is fully functional and ready for:
- ✅ Learning and exploration
- ✅ Development and customization
- ✅ Testing and QA
- ✅ Production deployment

**Start with:** `docker-compose up -d` then visit http://localhost:3000
