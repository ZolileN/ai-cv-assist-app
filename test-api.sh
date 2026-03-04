#!/bin/bash

# API Testing Script
# This script tests all endpoints of the AI CV App API

BASE_URL="http://localhost:8000"
TOKEN=""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🧪 AI CV App API Testing${NC}\n"

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
curl -X GET "$BASE_URL/health" 2>/dev/null | jq .
echo ""

# Test 2: Root Endpoint
echo -e "${YELLOW}Test 2: Root Endpoint${NC}"
curl -X GET "$BASE_URL/" 2>/dev/null | jq .
echo ""

# Test 3: Register User
echo -e "${YELLOW}Test 3: Register User${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "testpass123",
    "full_name": "Test User"
  }')

echo "$REGISTER_RESPONSE" | jq .

# Extract token
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.access_token')
echo -e "${GREEN}✓ Token: $TOKEN${NC}\n"

# Test 4: Get Current User
echo -e "${YELLOW}Test 4: Get Current User${NC}"
curl -s -X GET "$BASE_URL/api/auth/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq .
echo ""

# Test 5: Create Candidate
echo -e "${YELLOW}Test 5: Create Candidate Profile${NC}"
CANDIDATE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/candidates/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Software Engineer",
    "summary": "Experienced full-stack developer",
    "phone": "+1-555-0123",
    "location": "San Francisco, CA"
  }')

echo "$CANDIDATE_RESPONSE" | jq .

CANDIDATE_ID=$(echo "$CANDIDATE_RESPONSE" | jq -r '.id')
echo -e "${GREEN}✓ Candidate ID: $CANDIDATE_ID${NC}\n"

# Test 6: Get Candidate
echo -e "${YELLOW}Test 6: Get Candidate Profile${NC}"
curl -s -X GET "$BASE_URL/api/candidates/$CANDIDATE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq .
echo ""

# Test 7: Update Candidate
echo -e "${YELLOW}Test 7: Update Candidate Profile${NC}"
curl -s -X PUT "$BASE_URL/api/candidates/$CANDIDATE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Staff Software Engineer",
    "location": "New York, NY"
  }' | jq .
echo ""

# Test 8: Add Experience
echo -e "${YELLOW}Test 8: Add Work Experience${NC}"
EXPERIENCE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/candidates/$CANDIDATE_ID/experiences" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Tech Corp",
    "position": "Senior Engineer",
    "description": "Led development of microservices",
    "start_date": "2020-01-15T00:00:00",
    "end_date": null,
    "is_current": "true"
  }')

echo "$EXPERIENCE_RESPONSE" | jq .

EXPERIENCE_ID=$(echo "$EXPERIENCE_RESPONSE" | jq -r '.id')
echo -e "${GREEN}✓ Experience ID: $EXPERIENCE_ID${NC}\n"

# Test 9: List Experiences
echo -e "${YELLOW}Test 9: List Work Experiences${NC}"
curl -s -X GET "$BASE_URL/api/candidates/$CANDIDATE_ID/experiences" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq .
echo ""

# Test 10: Create Recruiter
echo -e "${YELLOW}Test 10: Create Recruiter Profile${NC}"
RECRUITER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/recruiters/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "TechJobs Inc",
    "phone": "+1-555-9876",
    "website": "https://techjobs.com"
  }')

echo "$RECRUITER_RESPONSE" | jq .

RECRUITER_ID=$(echo "$RECRUITER_RESPONSE" | jq -r '.id')
echo -e "${GREEN}✓ Recruiter ID: $RECRUITER_ID${NC}\n"

# Test 11: Create Job Description
echo -e "${YELLOW}Test 11: Create Job Description${NC}"
JOB_RESPONSE=$(curl -s -X POST "$BASE_URL/api/recruiters/$RECRUITER_ID/jobs" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Software Engineer",
    "description": "We are looking for experienced engineers",
    "required_skills": "Python, FastAPI, PostgreSQL",
    "experience_required": 5,
    "salary_min": 120000,
    "salary_max": 180000,
    "location": "Remote",
    "is_active": "true"
  }')

echo "$JOB_RESPONSE" | jq .

JOB_ID=$(echo "$JOB_RESPONSE" | jq -r '.id')
echo -e "${GREEN}✓ Job ID: $JOB_ID${NC}\n"

# Test 12: List Job Descriptions
echo -e "${YELLOW}Test 12: List Job Descriptions${NC}"
curl -s -X GET "$BASE_URL/api/recruiters/$RECRUITER_ID/jobs" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq .
echo ""

# Test 13: Update Job Description
echo -e "${YELLOW}Test 13: Update Job Description${NC}"
curl -s -X PUT "$BASE_URL/api/recruiters/jobs/$JOB_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Principal Engineer",
    "salary_max": 200000
  }' | jq .
echo ""

# Test 14: Login (create another token)
echo -e "${YELLOW}Test 14: Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "testpass123"
  }')

echo "$LOGIN_RESPONSE" | jq .

NEW_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token')
echo -e "${GREEN}✓ New Token: $NEW_TOKEN${NC}\n"

# Test 15: List All Candidates
echo -e "${YELLOW}Test 15: List All Candidates${NC}"
curl -s -X GET "$BASE_URL/api/candidates/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq .
echo ""

# Test 16: List All Recruiters
echo -e "${YELLOW}Test 16: List All Recruiters${NC}"
curl -s -X GET "$BASE_URL/api/recruiters/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq .
echo ""

echo -e "${GREEN}✅ All tests completed!${NC}"
