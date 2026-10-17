"""Integration status and setup guide."""

# Everlink Integrations

## Status Table

| Integration | Purpose | Required for MVP? | Status | Setup |
|---|---|---|---|---|
| Neo4j Aura | Knowledge graph (free instance 99c3d760) | **YES** | ⏳ Running; routing error (wait minute) | [Aura Setup](docs/AURA_SETUP.md) |
| Gemini API | Optional intent parsing & explanations | No | 🔴 Disabled | See below |
| LinkedIn OAuth | Optional social sign-in | No | 🔴 Disabled | See below |
| Email Provider | Optional notifications | No | 🔴 Disabled | Not implemented |

## Neo4j (Required)

### Status: ⏳ PENDING SETUP

**What It Does**: Stores all graph entities (people, skills, projects) and relationships. Enables weighted recommendation matching through graph traversal.

**Required for Basic MVP**: Yes

**Local Development Possible**: Yes (no API key needed)

**Setup**:
1. Download Neo4j Community Edition from https://neo4j.com/download-center/
2. Extract and run locally
3. Access browser at http://localhost:7474
4. Set password to `everlink_dev_2024` (or update `.env`)
5. Run seed script: `python seed.py`

**Environment Variables**:
```env
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=everlink_dev_2024
NEO4J_DATABASE=neo4j
```

**Files**:
- `.env` — connection configuration
- `backend/app/graph/connection.py` — driver initialization
- `backend/app/graph/schema.py` — constraints & indexes
- `backend/app/seed/seed_data.py` — synthetic data

**Testing Connectivity**:
```bash
curl http://localhost:8000/api/health
# Should show: "neo4j_connected": true
```

**Verification**: 
- Open http://localhost:7474
- Run: `MATCH (p:Person) RETURN count(p)` in browser
- Should return count of seeded people

---

## Gemini API (Optional)

### Status: 🔴 DISABLED (MVP works without it)

**What It Does**: Natural language intent extraction and polished explanation generation.

**Required for Basic MVP**: No

**Fallback**: Rule-based intent parser works perfectly fine. Queries parse deterministically without LLM.

**When to Enable**: Only if you want LLM-powered intent parsing and explanation rewriting.

**Setup Steps** (if desired):

1. Get API key:
   - Visit https://ai.google.dev/
   - Click "Get API Key"
   - Create new API key for "Generative Language API"

2. Add to `.env`:
   ```env
   GEMINI_API_KEY=your_key_here
   ```

3. Verify (optional):
   - Run: `python -c "import google.generativeai; print('✓ Gemini configured')"`

**Files**:
- `backend/app/core/config.py` — config loading
- No adapter implemented yet (optional Phase 6)

**Fallback Behavior**: 
- If `GEMINI_API_KEY` is empty or request fails, system uses rule-based parser
- No error to user — search continues working

---

## LinkedIn OAuth (Optional)

### Status: 🔴 DISABLED (Demo auth works)

**What It Does**: Alternative sign-in using LinkedIn account (future feature).

**Required for Basic MVP**: No

**Current Auth**: Simple demo sign-in with seeded accounts

**Setup Steps** (if desired in future):

1. Create LinkedIn app:
   - Go to https://www.linkedin.com/developers/apps
   - Create new application
   - Request "Sign In with LinkedIn" product access

2. Configure redirect URI:
   ```
   http://localhost:5173/auth/linkedin/callback
   ```

3. Add to `.env`:
   ```env
   LINKEDIN_CLIENT_ID=your_client_id
   LINKEDIN_CLIENT_SECRET=your_client_secret
   LINKEDIN_REDIRECT_URI=http://localhost:5173/auth/linkedin/callback
   ```

4. Note: Approval may take time; demo auth is sufficient for MVP

**Fallback Behavior**: 
- If `LINKEDIN_CLIENT_ID` is empty, LinkedIn OAuth is disabled
- Demo sign-in continues working

---

## Email Provider (Optional)

### Status: 🔴 NOT IMPLEMENTED

**What It Does**: Send password resets and mentorship request notifications.

**Required for Basic MVP**: No

**Current Workaround**: All workflows implemented in-app; no email needed for demo

**Future Setup**: When implemented, likely using SendGrid or similar

---

## Configuration Checklist

- [ ] Neo4j installed and running locally
- [ ] `.env` file created with Neo4j credentials
- [ ] Backend can connect to Neo4j (verify: `curl http://localhost:8000/api/health`)
- [ ] Seed script ran successfully
- [ ] Gemini API key (optional — leave empty if not using)
- [ ] LinkedIn OAuth (optional — leave empty if not using)

## Verification Script

```bash
# 1. Neo4j connectivity
curl http://localhost:8000/api/health

# 2. Backend running
curl http://localhost:8000/api/meta

# 3. People in database
curl http://localhost:8000/api/people?limit=5

# 4. Search working
curl -X POST "http://localhost:8000/api/search?query=Find%20a%20mentor" \
  -H "Content-Type: application/json"
```

All should return `200 OK` with JSON responses.

---

## Support

- **Neo4j issues**: See main [README.md](../README.md#troubleshooting)
- **API issues**: Check http://localhost:8000/api/docs (Swagger UI)
- **Frontend issues**: Check browser console (F12) for errors
