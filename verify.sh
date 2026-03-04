#!/bin/bash

# Verification Script - Check all project files are in place

echo "🔍 AI CV App Project Verification"
echo "=================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Counter
files_found=0
files_missing=0

# Check function
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((files_found++))
    else
        echo -e "${RED}✗${NC} $1 (MISSING)"
        ((files_missing++))
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        ((files_found++))
    else
        echo -e "${RED}✗${NC} $1/ (MISSING)"
        ((files_missing++))
    fi
}

echo -e "${YELLOW}📂 Project Root Files${NC}"
check_file "README.md"
check_file "QUICKSTART.md"
check_file "START_HERE.md"
check_file "PROJECT_SUMMARY.md"
check_file "DEPLOYMENT.md"
check_file "FILE_STRUCTURE.md"
check_file "docker-compose.yml"
check_file "docker-compose.full.yml"
check_file "setup.sh"
check_file "test-api.sh"
check_file "API_COLLECTION.json"
check_file ".gitignore"

echo ""
echo -e "${YELLOW}📁 Backend Structure${NC}"
check_dir "backend"
check_file "backend/requirements.txt"
check_file "backend/.env.example"
check_file "backend/Dockerfile"
check_file "backend/wsgi.py"
check_file "backend/entrypoint.sh"
check_file "backend/.gitignore"
check_file "backend/app/__init__.py"
check_file "backend/app/main.py"
check_file "backend/app/utils.py"

echo ""
echo -e "${YELLOW}🔐 Backend Core${NC}"
check_file "backend/app/core/__init__.py"
check_file "backend/app/core/config.py"
check_file "backend/app/core/database.py"
check_file "backend/app/core/security.py"
check_file "backend/app/core/logger.py"

echo ""
echo -e "${YELLOW}🗄️ Backend Models & Schemas${NC}"
check_file "backend/app/models/__init__.py"
check_file "backend/app/schemas/__init__.py"

echo ""
echo -e "${YELLOW}🛣️ Backend Routes${NC}"
check_file "backend/app/routes/__init__.py"
check_file "backend/app/routes/auth.py"
check_file "backend/app/routes/candidates.py"
check_file "backend/app/routes/recruiters.py"

echo ""
echo -e "${YELLOW}📁 Frontend Structure${NC}"
check_dir "frontend"
check_file "frontend/package.json"
check_file "frontend/tsconfig.json"
check_file "frontend/next.config.js"
check_file "frontend/tailwind.config.js"
check_file "frontend/postcss.config.js"
check_file "frontend/.env.local.example"
check_file "frontend/Dockerfile"
check_file "frontend/.gitignore"

echo ""
echo -e "${YELLOW}⚛️ Frontend App${NC}"
check_file "frontend/src/app/layout.tsx"
check_file "frontend/src/app/page.tsx"
check_file "frontend/src/app/auth/register/page.tsx"
check_file "frontend/src/app/auth/login/page.tsx"
check_file "frontend/src/app/dashboard/page.tsx"

echo ""
echo -e "${YELLOW}🧩 Frontend Components${NC}"
check_file "frontend/src/components/Navbar.tsx"
check_file "frontend/src/components/LoginForm.tsx"
check_file "frontend/src/components/RegisterForm.tsx"
check_file "frontend/src/components/CandidateForm.tsx"

echo ""
echo -e "${YELLOW}📚 Frontend Lib & Types${NC}"
check_file "frontend/src/lib/api.ts"
check_file "frontend/src/lib/authService.ts"
check_file "frontend/src/types/index.ts"
check_file "frontend/src/globals.css"

echo ""
echo "=================================="
echo -e "${GREEN}✓ Files Found: $files_found${NC}"
if [ $files_missing -gt 0 ]; then
    echo -e "${RED}✗ Files Missing: $files_missing${NC}"
else
    echo -e "${GREEN}✓ No Missing Files!${NC}"
fi

echo ""
if [ $files_missing -eq 0 ]; then
    echo -e "${GREEN}🎉 Project is complete and ready to use!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Read START_HERE.md for quick start"
    echo "2. Read QUICKSTART.md for 5-minute setup"
    echo "3. Run: docker-compose up -d"
    echo "4. Visit: http://localhost:3000"
else
    echo -e "${RED}⚠️ Some files are missing. Please check the output above.${NC}"
fi

echo ""
