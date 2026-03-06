# CrowdPhysics

Crowdsourced physical intelligence data platform. Phone-captured, AI-annotated, robot-ready.

Users record everyday physical tasks (washing dishes, folding clothes, tying shoelaces) with their phone cameras. AI auto-annotates hand poses, objects, and actions. Structured data is sold to robotics companies training dexterous manipulation models.

## Architecture

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Mobile App     │     │    Backend API    │     │   Marketplace    │
│   (Expo/RN)      │────▶│    (FastAPI)      │◀────│   (Next.js)      │
│                  │     │                  │     │                  │
│ • Camera record  │     │ • Auth (JWT)     │     │ • Dataset catalog│
│ • Task browsing  │     │ • Task templates │     │ • Pricing tiers  │
│ • Upload queue   │     │ • Upload (S3)    │     │ • API docs       │
│ • Face blur      │     │ • ML pipeline    │     │                  │
│ • Earnings       │     │ • Earnings       │     │                  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   ML Pipeline    │
                    │   (Celery)       │
                    │                  │
                    │ • Quality check  │
                    │ • Hand pose (21) │
                    │ • Object detect  │
                    │ • Grasp classify │
                    │ • Action segment │
                    │ • Scene describe │
                    └──────────────────┘
```

## Quick Start

### Backend

```bash
cd backend

# Start dependencies
docker compose up -d  # PostgreSQL, Redis, MinIO

# Install Python deps
pip install -r requirements.txt

# Start API server
uvicorn app.main:app --port 8100 --reload

# Seed task templates
python seed.py

# Start ML pipeline worker (optional)
celery -A pipeline.celery_app worker --loglevel=info
```

### Mobile App

```bash
# Install dependencies
npm install

# Start Expo dev server
npx expo start

# Or run web version
npx expo start --web
```

### Marketplace Website

```bash
cd web
npm install
npm run dev  # http://localhost:3001
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Get JWT token |
| GET | /api/auth/me | Current user profile |
| GET | /api/tasks/ | List task templates |
| GET | /api/tasks/{id} | Task details |
| POST | /api/submissions/ | Create submission |
| POST | /api/upload/presigned-url | Get S3 upload URL |
| POST | /api/upload/confirm | Confirm upload |
| GET | /api/earnings/balance | User balance |
| GET | /api/earnings/history | Earning events |
| POST | /api/submissions/{id}/process | Trigger ML pipeline |
| GET | /api/submissions/{id}/pipeline-status | Pipeline progress |
| GET | /api/submissions/{id}/results | Processed data |

## Tech Stack

- **Mobile**: Expo SDK 55, React Native, NativeWind, Zustand
- **Backend**: FastAPI, SQLAlchemy (async), PostgreSQL, Redis, MinIO
- **ML Pipeline**: Celery, MediaPipe (stub), YOLO (stub), HaMeR (stub)
- **Website**: Next.js 15, shadcn/ui, Tailwind CSS
- **Export Formats**: RLDS, LeRobot v3, HDF5, JSON

## License

Proprietary - Oyster Labs
