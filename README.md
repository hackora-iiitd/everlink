# Everlink: University Ecosystem Discovery Platform

**Status**: Phase 1 Complete (Foundation). Phase 2-3 Require Neo4j Setup.

**Official Tagline**: We don't just match profiles. We connect possibilities.

## Quick Start

### Prerequisites
- Node v24+
- Python 3.10+
- Neo4j (local installation required — Docker unavailable)

### Setup Steps

#### 1. Install Neo4j Locally (REQUIRED FIRST)

**Option A: Neo4j Community Server (Recommended)**
1. Download from https://neo4j.com/download-center/
2. Extract to `C:\neo4j-community` or similar
3. Start: `cd bin && neo4j.bat console`
4. Open http://localhost:7474
5. Login: `neo4j` / `neo4j` (default)
6. Set password to: `everlink_dev_2024`

**Option B: Neo4j Aura (Hosted)**
- Create free account at https://neo4j.com/cloud/aura/
- Copy URI and update `.env` file

#### 2. Install Backend Dependencies

```bash
cd backend
# Using Python 3.14.6 at: C:\Users\Shreya Srivastava\AppData\Local\Programs\Python\Python314\
C:\Users\Shreya Srivastava\AppData\Local\Programs\Python\Python314\python.exe -m pip install -r requirements.txt
```

#### 3. Seed Database

```bash
cd backend
C:\Users\Shreya Srivastava\AppData\Local\Programs\Python\Python314\python.exe seed.py
```

Expected output:
```
✓ Neo4j connection successful
✓ Graph schema initialized
✓ Database seeding complete!
✓ Created X people
```

#### 4. Start Backend

```bash
cd backend
C:\Users\Shreya Srivastava\AppData\Local\Programs\Python\Python314\python.exe run.py
```

Backend runs at: **http://localhost:8000**
API Docs: **http://localhost:8000/api/docs**

#### 5. Install & Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

## Architecture

### Backend (FastAPI + Neo4j)

- **API**: RESTful endpoints for search, people, profiles, mentorship
- **Graph Database**: Neo4j for relationships (skills, interests, projects, achievements)
- **Matching Engine**: Weighted scoring with configurable criteria by intent type
- **Intent Parser**: Rule-based NLP to extract structured search intent from queries

### Frontend (React + Vite)

- **Pages**: Home (Intent Compass), Search Results, Profile, Navigation
- **Design**: Buttermilk/Midnight Blue color scheme, editorial typography, warm/intellectual aesthetic
- **State**: React hooks with axios for API calls

### Synthetic Data

- 40+ people (students, seniors, alumni, professors)
- Realistic skills, interests, research topics
- Relationships through Neo4j edges
- Clearly labeled as "synthetic_demo"

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/health` | Health check & Neo4j status |
| `GET` | `/api/meta` | App metadata & version |
| `POST` | `/api/intent/parse` | Parse natural language query |
| `POST` | `/api/search` | Search with intent & scoring |
| `GET` | `/api/people` | List all people (filterable by role) |
| `GET` | `/api/people/{id}` | Get single person profile |

## Search Intent Types

- **mentor**: Find experienced guidance
- **research**: Find professors & projects
- **senior**: Find alumni by achievements
- **teammate**: Find complementary skills
- **opportunity**: Find positions & programs
- **general**: Free-form discovery

## Matching Weights

Weights vary by intent type. Example for **mentor** matching:
- 30%: Topic-specific experience
- 20%: Achievement evidence
- 20%: Skill overlap
- 15%: Role fit
- 10%: Experience duration
- 5%: Availability

## Example Queries

1. **"Find a senior who has done GSoC and can guide me in open source."**
   - Intent: mentor
   - Target role: senior
   - Topics: open-source
   - Achievement: GSoC

2. **"Find professors working on healthcare AI with active research projects."**
   - Intent: research
   - Topics: healthcare-ai
   - Target role: professor
   - Project status: active

3. **"Find teammates with backend and deployment experience for a hackathon."**
   - Intent: teammate
   - Skills: backend-development, deployment, devops
   - Prefers project experience

4. **"I want a mentor with at least 18 months of experience in computer vision."**
   - Intent: mentor
   - Skills: computer-vision
   - Minimum experience: 18 months

## File Structure

```
everlink/
├── backend/
│   ├── app/
│   │   ├── api/           # FastAPI route handlers
│   │   ├── core/          # Config, settings
│   │   ├── models/        # Pydantic domain & response models
│   │   ├── services/      # Intent parser, scoring engine
│   │   ├── repositories/  # Neo4j data access
│   │   ├── graph/         # Neo4j connection, schema
│   │   ├── seed/          # Seed data generation
│   │   └── main.py        # FastAPI app
│   ├── requirements.txt
│   ├── pyproject.toml
│   ├── seed.py            # Seed script entry point
│   └── run.py             # Development server
├── frontend/
│   ├── src/
│   │   ├── pages/         # React pages (Home, Search, Profile)
│   │   ├── components/    # Reusable components (Navigation)
│   │   ├── lib/           # API client, utilities
│   │   ├── styles/        # Tailwind CSS
│   │   ├── main.tsx       # React entry point
│   │   └── App.tsx        # Router
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── docs/
├── .env                   # Local config (Neo4j, ports, API keys)
├── .env.example           # Config template
├── .gitignore
└── README.md
```

## Environment Variables

Copy `.env.example` to `.env` and update:

```env
# Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=everlink_dev_2024        # Set to your local password
NEO4J_DATABASE=neo4j

# Backend
BACKEND_PORT=8000
BACKEND_HOST=0.0.0.0
DEBUG=true

# Frontend
VITE_API_URL=http://localhost:8000

# Optional (leave empty for MVP)
GEMINI_API_KEY=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
```

## Testing

### Unit Tests (Intent Parser, Scoring)
```bash
cd backend
python -m pytest tests/ -v
```

### Manual Testing
1. Start backend and frontend
2. Visit http://localhost:5173
3. Try a search query
4. Click on a result to view profile
5. Check http://localhost:8000/api/docs for endpoint testing

### Health Check
```bash
curl http://localhost:8000/api/health
```

## Next Steps (Phase 2+)

1. **Neo4j Setup** → Initialize database & seed synthetic data
2. **Matching Engine** → Test scenario-based recommendations
3. **Additional Pages** → Mentorship workflow, team builder, graph explorer
4. **Optional APIs** → Gemini intent parsing, LinkedIn OAuth
5. **QA & Polish** → Test workflows, fix bugs, improve UX

## Database Schema

### Node Labels
- `Person` (student, senior, alumnus, professor)
- `Skill`
- `ResearchTopic`
- `ResearchProject`
- `Achievement`
- `Organization`
- `Opportunity`
- `Venture`

### Relationships
- `HAS_SKILL`
- `INTERESTED_IN`
- `RESEARCHES`
- `LEADS`
- `ACHIEVED`
- `WORKED_AT`
- `WORKED_ON`
- `HAS_EXPERIENCE_IN`
- `MENTORS`
- `PARTICIPATED_IN`

## Troubleshooting

**Neo4j Connection Failed**
- Verify Neo4j is running: http://localhost:7474
- Check credentials in `.env`
- Verify URI (default: `bolt://localhost:7687`)

**Backend Won't Start**
- Check Python version: `python --version` (need 3.10+)
- Install dependencies: `pip install -r requirements.txt`
- Check for port conflicts: `netstat -ano | findstr :8000`

**Frontend Can't Reach Backend**
- Verify backend is running at http://localhost:8000/api/health
- Check CORS settings in `backend/app/main.py`
- Verify `VITE_API_URL` in `.env`

**Search Returns No Results**
- Run seed script: `python seed.py`
- Check database with: `curl http://localhost:8000/api/people`
- Verify seed data in Neo4j Browser: `MATCH (p:Person) RETURN count(p)`

## Notes

- All synthetic data is marked with `data_origin: "synthetic_demo"`
- Do NOT commit secrets (API keys, passwords) — use `.env` (ignored by `.gitignore`)
- Rule-based intent parser works without Gemini API
- MVP tested with seed scenarios (healthcare AI, open-source, experience duration)
- Full graph exploration features pending additional pages

## License

Demo project for educational purposes.
