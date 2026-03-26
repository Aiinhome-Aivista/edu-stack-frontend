---
title: "EduStack LMS — Software Design, Deployment & Troubleshooting Guide"
author: "EduStack Engineering Team"
date: "2026"
---

# EduStack LMS
## Software Design, Deployment & Troubleshooting Guide

**Version:** 1.0.0  
**Platform:** AI-Powered Learning Management System + Financial Management  
**Stack:** React JS · Python Flask · MySQL · ChromaDB · Mistral AI

---

# 1. Executive Overview

EduStack LMS is a next-generation, AI-driven Learning Management System combined with a comprehensive School Financial Management platform. It serves five primary user personas — Director, Principal, Teacher, Student, and Parent — each with a dedicated dashboard and role-specific capabilities.

The platform leverages a Retrieval-Augmented Generation (RAG) pipeline powered by Mistral Cloud AI to auto-generate contextually accurate assessments, analyze student behavioral data during exams, and produce personalized learning roadmaps for every student.

---

# 2. System Architecture

## 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────┐
│           React JS Frontend (Vite)          │
│    Public Site · 5 Role Dashboards ·        │
│    Assessment Room · Fees Portal            │
└──────────────────┬──────────────────────────┘
                   │ HTTPS / REST API
                   ▼
┌─────────────────────────────────────────────┐
│       Python Flask API (Gunicorn)           │
│  Auth · Students · Teachers · Assessments  │
│  Fees · Director · Principal · AI Engine   │
│  Notifications · Admin User Management     │
└──────┬────────────────────────┬─────────────┘
       │                        │
       ▼                        ▼
┌────────────┐         ┌──────────────────┐
│   MySQL    │         │  ChromaDB        │
│  (Core DB) │         │  (Vector Store)  │
└────────────┘         └──────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │  Mistral Cloud API    │
                    │  (LLM: Question Gen  │
                    │  + Roadmap Analysis) │
                    └───────────────────────┘
```

## 2.2 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + Vite + Tailwind CSS | UI/UX for all personas |
| State Management | Zustand + React Query | Client state and server caching |
| Backend API | Python Flask 3 + Gunicorn | REST API server |
| Authentication | Flask-JWT-Extended | JWT access + refresh tokens |
| Core Database | MySQL 8 + SQLAlchemy ORM | Relational data storage |
| Vector Database | ChromaDB (persistent) | RAG document embeddings |
| LLM | Mistral Cloud API | Question generation, roadmap AI |
| File Parsing | pdfplumber, python-docx | Educational content ingestion |
| CORS | Flask-CORS | Cross-origin request handling |

## 2.3 Deployment Architecture

```
Internet
    │
    ▼
[Nginx Reverse Proxy]  ← Port 80/443 (SSL via Let's Encrypt)
    │              │
    │              │
    ▼              ▼
[React Build]   [Flask API]     ← Gunicorn, Port 5000 (internal)
(Static files)      │
  /var/www/         ▼
  edustack/   [MySQL 8 Server]  ← Port 3306 (localhost only)
              [ChromaDB]        ← /var/edustack/chromadb/
              [Uploads Dir]     ← /var/edustack/uploads/
```

---

# 3. Database Design

## 3.1 Core Tables Summary

| Table | Purpose |
|-------|---------|
| users | Central authentication (all personas) |
| institutions | School/college profile |
| academic_sessions | Annual academic sessions |
| grades | Grade/standard levels |
| classes | Class sections per session |
| subjects | Subject catalogue |
| chapters | Chapter structure per subject |
| topics | Topic nodes (mapped to ChromaDB) |
| directors | Director persona profiles |
| principals | Principal persona profiles |
| teachers | Teacher profiles with salary info |
| teacher_subjects | Teacher–subject–class mapping |
| students | Student profiles with enrollment |
| parents | Parent profiles |
| parent_students | Parent–child relationships |
| attendance | Daily attendance records |
| assessments | Assessment header records |
| questions | Individual questions per assessment |
| assessment_attempts | Student attempt sessions |
| student_answers | Per-question responses |
| behavioral_data | Hesitation, confidence signals |
| student_learning_profiles | AI-generated learning summaries |
| topic_mastery | Per-student topic proficiency |
| knowledge_documents | Uploaded educational content |
| fee_structures | Fee schedules per grade/session |
| student_fees | Individual student fee ledger |
| fee_transactions | Payment records |
| expenses | Institutional expense tracking |
| notifications | In-app notification queue |
| academic_events | Events calendar |

## 3.2 Key Relationships

- `users` ←1:1→ `students` / `teachers` / `parents` / `principals` / `directors`
- `students` ←M:N→ `parents` via `parent_students`
- `assessments` ←1:N→ `questions`
- `assessment_attempts` ←1:N→ `student_answers` + `behavioral_data`
- `knowledge_documents` → ChromaDB collection (indexed asynchronously)
- `topics` ←1:N→ `topic_mastery` (per student)

---

# 4. API Reference

## 4.1 Authentication

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | /api/auth/login | Email + password → JWT tokens |
| POST | /api/auth/refresh | Refresh access token |
| GET | /api/auth/me | Get current user + profile |
| POST | /api/auth/change-password | Change password |

## 4.2 Students

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | /api/students/dashboard | Student KPI dashboard |

## 4.3 Teachers

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | /api/teachers/dashboard | Teacher KPI dashboard |
| GET | /api/teachers/students | List students for teacher's classes |

## 4.4 Assessments

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | /api/assessments/ | Create assessment |
| GET | /api/assessments/{id} | Get assessment with questions |
| POST | /api/assessments/{id}/publish | Publish assessment |
| GET | /api/assessments/class/{class_id} | List assessments for class |
| POST | /api/assessments/{id}/start | Student starts attempt |
| POST | /api/assessments/attempt/{id}/answer | Submit/update answer |
| POST | /api/assessments/attempt/{id}/submit | Submit entire attempt |
| GET | /api/assessments/attempt/{id}/result | Get scored result |

## 4.5 AI Engine

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | /api/ai/upload-document | Upload PDF/DOCX/TXT for RAG |
| POST | /api/ai/generate-questions | AI question generation |
| POST | /api/ai/analyze-student/{id} | Run AI learning analysis |
| GET | /api/ai/learning-profile/{id} | Get student AI profile |
| GET | /api/ai/smart-suggestions/{teacher_id} | Teacher assessment suggestions |

## 4.6 Fees

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | /api/fees/structure | Fee structure |
| GET | /api/fees/student/{id} | Student fee summary |
| POST | /api/fees/pay | Initiate payment |
| GET | /api/fees/transactions/{id} | Transaction history |

## 4.7 Admin

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | /api/admin/users | Create user |
| PUT | /api/admin/users/{id} | Update user |
| DELETE | /api/admin/users/{id} | Deactivate user |
| GET | /api/admin/users | List users (paginated) |
| POST | /api/admin/bulk-import | Bulk JSON import |

## 4.8 Director / Principal

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | /api/director/overview | Revenue, expenses, enrollment, performance |
| GET | /api/principal/kpi | Class and teacher KPI metrics |

---

# 5. AI Engine Architecture

## 5.1 RAG Pipeline Flow

```
Admin uploads PDF/DOCX/TXT
        │
        ▼
Text Extraction
(pdfplumber / python-docx)
        │
        ▼
Chunking (800-word chunks, 100-word overlap)
        │
        ▼
ChromaDB Collection
(collection: edu_s{subject_id}_g{grade_id})
        │
  ┌─────┘
  │ At assessment creation time:
  ▼
Similarity Search (query = subject + chapter + topic)
        │
        ▼
Top-K Context Chunks retrieved
        │
        ▼
Mistral Cloud API prompt (with context + constraints)
        │
        ▼
JSON-structured questions returned
        │
        ▼
Saved to questions table
```

## 5.2 Question Generation Prompt Strategy

Each prompt specifies:

- Count and difficulty level
- Educational context from RAG retrieval
- Strict JSON-only output format
- Question type-specific schema (MCQ, True/False, Short Answer)

## 5.3 Learning Analytics Flow

```
Student completes assessment
        │
        ▼
StudentAnswer + BehavioralData recorded
        │
        ▼
LearningAnalyticsService.analyze(student_id)
        │
        ├── Compute topic mastery per topic
        ├── Identify strong topics (>75%) and weak topics (<50%)
        ├── Update TopicMastery table
        │
        ▼
Mistral API: generate personalized roadmap
(short-term goals · mid-term goals · long-term vision · strategies)
        │
        ▼
StudentLearningProfile updated
```

## 5.4 Behavioral Proctoring Signals

During each assessment attempt, the following signals are captured:

- **Tab switch detection** — `document.visibilitychange` event counted
- **Time to first answer** — measures confidence / deliberation
- **Answer revision count** — indicates hesitation or reconsideration
- **Flag-for-review** — student-initiated uncertainty marker
- **Hesitation events** — time gaps between interactions

All signals are stored in `behavioral_data` and can feed future ML models.

---

# 6. Role-Based Access Control

| Role | Can Create | Can View |
|------|-----------|---------|
| superadmin | All users | All data |
| director | principal, teacher, student, parent | Financial + academic aggregates |
| principal | teacher, student, parent | Academic KPIs, teacher performance |
| teacher | student, parent | Own class + assessments |
| student | — | Own data, own assessments |
| parent | — | Linked children's data |

JWT claims include `role` field. Backend `role_required()` decorator enforces access on every protected endpoint.

---

# 7. Deployment Guide

## 7.1 Prerequisites

- **OS:** Ubuntu 22.04 LTS (or 20.04 LTS) on a VPS
- **RAM:** Minimum 2 GB (4 GB recommended for ChromaDB + Flask)
- **Storage:** Minimum 20 GB (for uploads and ChromaDB index)
- **Python:** 3.11+
- **Node.js:** 18+
- **MySQL:** 8.0+
- **Nginx:** Latest stable

## 7.2 Step-by-Step Backend Deployment

### Step 1 — System setup

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3.11 python3.11-venv python3-pip \
    mysql-server nginx git curl build-essential
```

### Step 2 — MySQL setup

```sql
sudo mysql
CREATE DATABASE edustack_lms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'edustack_user'@'localhost' IDENTIFIED BY 'StrongPassword!2024';
GRANT ALL PRIVILEGES ON edustack_lms.* TO 'edustack_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3 — Application setup

```bash
mkdir -p /var/edustack/{uploads,chromadb,logs}
git clone https://github.com/yourorg/edustack-lms.git /opt/edustack
cd /opt/edustack/backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
nano .env   # Fill in all required values
```

### Step 4 — Initialize database

```bash
source venv/bin/activate
cd /opt/edustack/backend
python -c "from app import create_app; from models.db import db; app = create_app(); app.app_context().push(); db.create_all(); print('Tables created')"
```

### Step 5 — Gunicorn systemd service

Create file `/etc/systemd/system/edustack-api.service`:

```ini
[Unit]
Description=EduStack LMS API
After=network.target mysql.service

[Service]
User=www-data
Group=www-data
WorkingDirectory=/opt/edustack/backend
EnvironmentFile=/opt/edustack/backend/.env
ExecStart=/opt/edustack/backend/venv/bin/gunicorn \
    --workers 4 \
    --worker-class sync \
    --timeout 120 \
    --bind 127.0.0.1:5000 \
    --access-logfile /var/edustack/logs/access.log \
    --error-logfile /var/edustack/logs/error.log \
    "app:create_app()"
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable edustack-api
sudo systemctl start edustack-api
sudo systemctl status edustack-api
```

## 7.3 Step-by-Step Frontend Deployment

```bash
cd /opt/edustack/frontend
npm install
# Create .env.production
echo "VITE_API_URL=/api" > .env.production
npm run build
sudo cp -r dist/* /var/www/edustack/
sudo chown -R www-data:www-data /var/www/edustack/
```

## 7.4 Nginx Configuration

Create `/etc/nginx/sites-available/edustack`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root /var/www/edustack;
    index index.html;

    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 120s;
        proxy_read_timeout 120s;
        client_max_body_size 50M;
    }

    # React SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
}
```

```bash
sudo ln -s /etc/nginx/sites-available/edustack /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
# SSL via certbot
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

## 7.5 File Permissions

```bash
sudo chown -R www-data:www-data /var/edustack/uploads /var/edustack/chromadb /var/edustack/logs
sudo chmod 755 /var/edustack/uploads /var/edustack/chromadb
```

## 7.6 Create First Superadmin User

```bash
cd /opt/edustack/backend
source venv/bin/activate
python -c "
from app import create_app
from models.db import db, User
app = create_app()
with app.app_context():
    u = User(email='admin@yourdomain.com', role='superadmin', is_active=True)
    u.set_password('ChangeMe@2024!')
    db.session.add(u)
    db.session.commit()
    print('Superadmin created: admin@yourdomain.com')
"
```

---

# 8. Troubleshooting Guide

## 8.1 Backend / API Issues

### Issue: `502 Bad Gateway` from Nginx

**Cause:** Gunicorn is not running or crashed.

**Fix:**
```bash
sudo systemctl status edustack-api
sudo journalctl -u edustack-api -n 50
sudo systemctl restart edustack-api
```

---

### Issue: `sqlalchemy.exc.OperationalError: Can't connect to MySQL`

**Cause:** Wrong MySQL credentials or MySQL service not running.

**Fix:**
```bash
sudo systemctl status mysql
sudo systemctl start mysql
# Verify credentials in .env match MySQL user
mysql -u edustack_user -p edustack_lms -e "SELECT 1;"
```

---

### Issue: JWT `Token has expired` errors

**Cause:** Access token expired; client should use refresh token.

**Fix (frontend):** The `api.js` interceptor handles this automatically. If refresh also fails, user is redirected to `/login`.

**Fix (server-side):** Check `JWT_ACCESS_TOKEN_EXPIRES` in `.env`. Default is 8 hours.

---

### Issue: `CORS policy: No 'Access-Control-Allow-Origin'`

**Cause:** Frontend origin not in `CORS_ORIGINS`.

**Fix:** Add the frontend URL to `.env`:
```
CORS_ORIGINS=https://yourdomain.com,http://localhost:3000
```
Then restart Gunicorn: `sudo systemctl restart edustack-api`

---

### Issue: File uploads failing with `413 Request Entity Too Large`

**Cause:** Nginx default max body size is 1 MB.

**Fix:** In Nginx config, ensure `client_max_body_size 50M;` is set in the `/api/` location block (already included in the config above).

---

## 8.2 AI / RAG Pipeline Issues

### Issue: `MISTRAL_API_KEY not configured`

**Cause:** Missing API key in `.env`.

**Fix:**
1. Obtain API key from `console.mistral.ai`
2. Add to `.env`: `MISTRAL_API_KEY=your-key-here`
3. Restart service: `sudo systemctl restart edustack-api`

---

### Issue: ChromaDB collection not found / empty context

**Cause:** Educational documents have not been uploaded and indexed yet.

**Fix:**
1. Log in as teacher or admin
2. Navigate to AI Engine → Upload Document
3. Upload PDF/DOCX/TXT for relevant subject and grade
4. Wait for indexing confirmation (chunk count displayed)
5. Retry question generation

---

### Issue: AI returns malformed JSON / parsing fails

**Cause:** Mistral response exceeded token limit or included unexpected text.

**Symptoms:** `JSONDecodeError` in Flask logs.

**Fix:** The `_parse_response()` method in `QuestionGeneratorService` includes fallback questions. For persistent failures:
- Reduce question count (`count` parameter)
- Check Mistral API quota at `console.mistral.ai`
- Verify `MISTRAL_MODEL=mistral-large-latest` in `.env`

---

### Issue: Document indexing is slow for large PDFs

**Cause:** Large PDFs produce many chunks; ChromaDB batch writes take time.

**Fix:** This is expected behavior. For PDFs over 200 pages, indexing may take 2-5 minutes. The API returns `"indexing pending"` with status 201 if indexing fails inline — it can be retried.

---

## 8.3 Frontend Issues

### Issue: Blank white screen after deployment

**Cause:** React build not served correctly; SPA routes return 404 from Nginx.

**Fix:** Ensure the Nginx `location /` block contains `try_files $uri $uri/ /index.html;`

---

### Issue: `VITE_API_URL` not defined — API calls going to wrong URL

**Cause:** Missing production environment file.

**Fix:**
```bash
echo "VITE_API_URL=/api" > /opt/edustack/frontend/.env.production
npm run build
```

---

### Issue: Login succeeds but dashboard shows blank / 403

**Cause:** JWT role claim mismatch with route guard `allowedRoles`.

**Fix:** Check the `role` field on the user record in MySQL:
```sql
SELECT email, role, is_active FROM users WHERE email = 'user@example.com';
```
Update if incorrect:
```sql
UPDATE users SET role = 'teacher' WHERE email = 'user@example.com';
```

---

### Issue: Assessment timer not counting down

**Cause:** `assessment.duration_minutes` is null (assessment created without duration).

**Fix:** Ensure `duration_minutes` is set (default 60) when creating assessments. Verify via:
```sql
SELECT id, title, duration_minutes FROM assessments WHERE id = {id};
UPDATE assessments SET duration_minutes = 60 WHERE id = {id};
```

---

## 8.4 Fee Module Issues

### Issue: Payment shows success but `StudentFee.status` remains `unpaid`

**Cause:** `student_fee_id` mismatch in payment request.

**Fix:** Verify the correct `student_fee_id` is passed from the frontend. Check fee IDs:
```sql
SELECT id, student_id, due_amount, paid_amount, status FROM student_fees WHERE student_id = {id};
```

---

## 8.5 Performance Optimization

### MySQL Slow Queries

Add these indexes if not already present:

```sql
CREATE INDEX idx_attempts_student ON assessment_attempts(student_id);
CREATE INDEX idx_answers_attempt ON student_answers(attempt_id);
CREATE INDEX idx_fees_student ON student_fees(student_id);
CREATE INDEX idx_notif_user ON notifications(user_id, is_read);
CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
```

### Gunicorn Workers

Optimal worker count = `(2 × CPU cores) + 1`. For a 2-core VPS:
```ini
--workers 5
```

---

# 9. Security Checklist

- [x] All API endpoints require JWT (except `/api/auth/login`)
- [x] Role-based access enforced on every sensitive route
- [x] Passwords hashed with Werkzeug (PBKDF2-SHA256)
- [x] JWT secrets loaded from environment variables (never hardcoded)
- [x] MySQL user has least-privilege access (only `edustack_lms` database)
- [x] MySQL bound to `localhost` only
- [x] Nginx enforces HTTPS redirect
- [x] File uploads restricted to PDF/DOCX/TXT
- [x] Max upload size 50 MB
- [x] CORS whitelist configured
- [ ] Implement rate limiting on `/api/auth/login` (use Flask-Limiter)
- [ ] Enable MySQL SSL for production
- [ ] Set up automated DB backups (cron + `mysqldump`)
- [ ] Configure fail2ban for SSH and Nginx

---

# 10. Maintenance & Backup

## 10.1 Daily Database Backup (cron)

```bash
sudo crontab -e
# Add:
0 2 * * * mysqldump -u edustack_user -pYourPassword edustack_lms | gzip > /var/backups/edustack_$(date +\%Y\%m\%d).sql.gz
# Keep last 30 days
0 3 * * * find /var/backups/ -name "edustack_*.sql.gz" -mtime +30 -delete
```

## 10.2 Log Rotation

```bash
# /etc/logrotate.d/edustack
/var/edustack/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    notifempty
    postrotate
        systemctl reload edustack-api
    endscript
}
```

## 10.3 Updating the Application

```bash
cd /opt/edustack
git pull origin main

# Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart edustack-api

# Frontend
cd ../frontend
npm install
npm run build
sudo cp -r dist/* /var/www/edustack/
```

---

# 11. Project File Structure

```
edustack/
├── backend/
│   ├── app.py                     # Flask app factory
│   ├── requirements.txt
│   ├── .env.example
│   ├── config/
│   │   └── settings.py            # All config classes
│   ├── models/
│   │   └── db.py                  # All SQLAlchemy models
│   ├── api/
│   │   ├── auth.py                # Login, refresh, me
│   │   ├── students.py            # Student dashboard API
│   │   ├── teachers.py            # Teacher dashboard API
│   │   ├── assessments.py         # Full assessment CRUD + attempt flow
│   │   ├── fees.py                # Fee structure, payment, transactions
│   │   ├── admin.py               # User management CRUD
│   │   ├── principal.py           # Principal KPI API
│   │   ├── director.py            # Director financial overview API
│   │   ├── ai_engine.py           # RAG upload, question gen, analysis
│   │   └── notifications.py       # In-app notifications
│   ├── services/
│   │   ├── rag_service.py         # ChromaDB indexing + retrieval
│   │   ├── question_gen_service.py# Mistral question generation
│   │   └── learning_analytics_service.py  # AI learning profiles
│   └── middleware/
│       └── auth.py                # role_required decorator
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── package.json
    └── src/
        ├── main.jsx               # App entry + providers
        ├── App.jsx                # Router + protected routes
        ├── context/
        │   └── authStore.js       # Zustand auth store (persisted)
        ├── utils/
        │   └── api.js             # Axios with JWT interceptors
        ├── styles/
        │   └── globals.css        # Design tokens + utility classes
        ├── components/common/
        │   └── Layout.jsx         # Sidebar, Topbar, StatCard, DashboardLayout
        └── pages/
            ├── LoginPage.jsx
            ├── PublicHomePage.jsx
            ├── director/DirectorDashboard.jsx
            ├── principal/PrincipalDashboard.jsx
            ├── teacher/
            │   ├── TeacherDashboard.jsx
            │   └── CreateAssessment.jsx
            ├── student/
            │   ├── StudentDashboard.jsx
            │   ├── AssessmentRoom.jsx
            │   ├── AssessmentResult.jsx
            │   └── StudentFees.jsx
            └── admin/
                └── UserManagement.jsx
```

---

# 12. Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| SECRET_KEY | Yes | Flask secret key (min 32 chars) |
| JWT_SECRET_KEY | Yes | JWT signing key (min 32 chars) |
| MYSQL_HOST | Yes | MySQL server hostname |
| MYSQL_PORT | Yes | MySQL port (default 3306) |
| MYSQL_USER | Yes | MySQL username |
| MYSQL_PASSWORD | Yes | MySQL password |
| MYSQL_DB | Yes | MySQL database name |
| MISTRAL_API_KEY | Yes | Mistral Cloud API key |
| MISTRAL_MODEL | No | Model name (default: mistral-large-latest) |
| CHROMA_PERSIST_DIR | Yes | Path for ChromaDB persistence |
| UPLOAD_FOLDER | Yes | Path for uploaded educational files |
| CORS_ORIGINS | Yes | Comma-separated frontend origins |
| SMTP_HOST | No | SMTP server for email notifications |
| SMTP_USER | No | SMTP username |
| SMTP_PASSWORD | No | SMTP password |
| SMS_API_KEY | No | Fast2SMS API key for India SMS |
| DEBUG | No | Set to False in production |

---

*EduStack LMS — Built for India's educational institutions. Powered by AI, driven by data.*
