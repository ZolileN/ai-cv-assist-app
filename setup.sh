#!/bin/bash

# Production setup script
set -e

echo "🚀 Starting AI CV App setup..."

# Backend setup
echo "📦 Setting up backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update backend/.env with your configuration"
fi

# Check if requirements are installed
if ! python3 -c "import fastapi" 2>/dev/null; then
    echo "Installing Python dependencies..."
    pip install -r requirements.txt
fi

cd ..

# Frontend setup
echo "📦 Setting up frontend..."
cd frontend

if [ ! -f ".env.local" ]; then
    echo "Creating .env.local from .env.local.example..."
    cp .env.local.example .env.local
fi

if [ ! -d "node_modules" ]; then
    echo "Installing Node dependencies..."
    npm install
fi

cd ..

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "  Option 1 (Docker): docker-compose up -d"
echo "  Option 2 (Local): "
echo "    - Terminal 1: cd backend && uvicorn app.main:app --reload"
echo "    - Terminal 2: cd frontend && npm run dev"
echo ""
echo "Frontend will be at http://localhost:3000"
echo "Backend API at http://localhost:8000"
echo "API Docs at http://localhost:8000/docs"
