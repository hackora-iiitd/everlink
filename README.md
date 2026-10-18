# Everlink

> **We don't just match profiles. We connect possibilities.**

Everlink is a university-community discovery platform built to help students find the people, experience, and opportunities that can move an idea forward. It brings students, alumni, seniors, professors, skills, research, and career history into one connected map so discovery can start with what someone wants to do, not only who they already know.

**Live Demo:** [everlink-hackora.vercel.app](https://everlink-hackora.vercel.app)

**Pitch Deck:** [https://canva.link/xq266145pxh3rir](https://canva.link/xq266145pxh3rir)

**Status:** Working prototype. The frontend is deployed; several integrations and production capabilities described below are still in development.

## Why Everlink

Universities are full of useful knowledge, but it is scattered across departments, graduation years, social networks, and people's memories. A student may know the field they want to enter without knowing which alum has relevant experience, which professor leads related work, or which peer has the missing skill.

Everlink is designed to turn those disconnected facts into useful pathways:

- **Start with intent.** Describe a goal in everyday language-find a mentor, explore a research area, meet a teammate, or discover an opportunity.
- **Find relevant people across time.** A person's value to a search should not disappear when their current employer or title changes.
- **See the connections.** Relate people to skills, topics, projects, organizations, and experience instead of treating each profile as an isolated list of keywords.
- **Make the next step clearer.** Give students a way to move from a question to a relevant person, a useful story, or a potential path forward.

The ambition is a living knowledge network for the university community: one that makes expertise easier to discover and makes every generation's experience more useful to the next.

## What makes Everlink different

| | Everlink | LinkedIn | ChatGPT |
|---|---|---|---|
| **Built around** | Discovery within a university community and its connected ecosystem | A broad professional identity and networking graph | Conversational answers and content generation |
| **Typical starting point** | “I want to work on computer vision for health-who could help me take the next step?” | A person's name, title, company, or existing network | A question asked of a language model |
| **Useful context** | Intended to connect skills, interests, projects, affiliations, and career history | Professional profiles, connections, and activity | The prompt and information available to the model |
| **Best role** | Find relevant people and pathways in a shared academic community | Maintain a broad professional presence and network | Explain concepts, brainstorm, and help prepare for a conversation |

Everlink is not a replacement for either platform. LinkedIn is valuable for professional networking at global scale; ChatGPT is valuable for explanation and ideation. Everlink's distinctive opportunity is the **community-specific discovery layer** between them: helping someone find the right human context and a credible next connection, rather than only another answer or another profile.

## A relationship graph, not just a profile directory

The product is built around a graph of entities and their relationships. In the intended model, a person can be connected to skills, interests, projects, achievements, organizations, and time-bounded work or study experiences. A search can then use the paths between a student's goal and a person's relevant evidence to explain *why* that person may be a useful connection.

For example:

```text
Student
  └─ interested in → Computer Vision
       └─ relevant experience → Alum
            ├─ worked at → Previous Company (15 years)
            ├─ currently works at → New Company (joined last month)
            └─ has skills → Python, Medical Imaging
```

If a student searches for alumni with experience at the **previous company**, this alum should rank ahead of someone with only two years there-even though the alum has recently moved. The alum's 15 years of relevant experience are still real historical evidence. A recent job change updates the **current affiliation**; it does not erase the **past affiliation**.

### How the intended weighted ranking should work

Everlink's product direction is to rank by **relevance to the user's goal**, not by whether a person is still at a particular company today. For a company-specific search, the ranker should consider distinct evidence signals:

1. **Relevant experience:** duration and depth of work connected to the requested company, domain, skill, or topic.
2. **Intent fit:** how closely that experience matches the user's actual goal.
3. **Related skills and work:** skills, projects, and achievements that support the match.
4. **Current affiliation:** whether the person is still at the organization, useful context but not a gate on historical experience.
5. **Recency and evidence quality:** when the information was updated and how well it is supported or verified.

Conceptually:

```text
match score =
    relevant experience × intent-specific weight
  + skill and project evidence × intent-specific weight
  + role and community fit × intent-specific weight
  + current-affiliation context × intent-specific weight
  + recency and evidence confidence × intent-specific weight
```

Weights should change with the intent. A mentor search may value depth of experience and evidence; a research search may value topic and project alignment; a teammate search may value complementary skills. **Current employment should be one signal, not a hard requirement**, unless the user explicitly asks for people currently at an organization. In the 15-year example, the strong historical match should outweigh the fact that the alum joined a new company last month.

### What is implemented today

The backend prototype includes a deterministic scoring engine with configurable weight sets for mentor, research, senior, teammate, and opportunity intents. It supports selected profile-based signals such as skills, topics, role, experience duration, availability, and achievements, and returns a score breakdown.

The company-tenure example above describes the **intended ranking behavior**, not a claim about the current live search. The current search endpoint retrieves Person nodes and scores available profile fields; it does **not yet** rank people by dated company-relationship history, apply relationship-path weights, or adjust company relevance based on a recent job change. Those require richer temporal experience data and graph-aware ranking. We want this distinction to be clear: Everlink should earn trust through transparent evidence, not pretend a roadmap feature already exists.

### Prototype scoring weights

These are the intent-specific weights currently configured in the backend scorer. They are **criterion weights**, not weights on graph edges:

| Search intent | Configured criteria and weights |
|---|---|
| Mentor | Topic experience 30%, achievement evidence 20%, skill overlap 20%, role fit 15%, experience duration 10%, availability 5% |
| Research | Research-topic alignment 35%, project relevance 25%, relevant skills 20%, experience duration 10%, role fit 10% |
| Senior / alumni | Achievement match 35%, experience relevance 25%, relevant skills 20%, role fit 10%, topic alignment 10% |
| Teammate | Skill coverage 30%, complementary skills 25%, project experience 20%, domain alignment 15%, availability 10% |
| Opportunity | Topic alignment 30%, eligibility fit 25%, skill alignment 20%, experience relevance 15%, timing fit 10% |

The prototype currently calculates only a subset of these criteria; unsupported or unavailable criteria are omitted and the remaining applicable weights are renormalized. For example, it does not yet calculate company-specific tenure or temporal graph-path relevance. See [the matching algorithm notes](docs/MATCHING_ALGORITHM.md) for the implementation details and intended direction.

## Why alumni would want to join

Everlink should make participation worthwhile for alumni-not treat them as a directory to be mined.

- **Give back on their terms.** Share a story, answer a focused question, mentor occasionally, or simply make expertise discoverable; participation should be opt-in and bounded.
- **Make experience count beyond a job title.** A career change should not erase the value of years spent building expertise, solving problems, or learning a field.
- **Leave a useful legacy.** One practical lesson about a first role, a research project, or a difficult transition can make another student's path less opaque.
- **Meet people with meaningful context.** Connect with students, peers, faculty, and projects through shared interests-not just unsolicited messages.
- **See the community grow.** Over time, alumni can help turn scattered individual experiences into a lasting map of pathways, skills, and opportunities.

The long-term promise is reciprocal: students gain access to guidance and context; alumni gain a trusted way to contribute, reconnect, and be recognized for the experience they have built.

## Current prototype

The repository currently contains:

- A React + TypeScript + Vite frontend with public pages, role-based dashboard experiences, search and profile screens, and an Explore view.
- Community-network visualizations shared across student, professor, and admin dashboard views.
- Senior Success stories and an Opportunities & Stories feed backed by a shared JSON fixture.
- A FastAPI backend with intent parsing, person endpoints, health and metadata endpoints, and a prototype scoring engine.
- Neo4j schema and seed scripts for graph data.

### Important prototype limitations

- The Vercel deployment hosts the **frontend only**. The FastAPI service and Neo4j database are not deployed with it; backend-dependent search is not a production-connected service on that URL.
- Demo authentication and session state are browser-side. Role checks, alumni verification flows, publishing, and moderation are prototype UX-not secure authorization.
- User-created posts and moderation state are stored in the current browser's `localStorage`; they are not shared across users or devices.
- Community fixture content is illustrative and is not a source of verified people, outcomes, live vacancies, or company announcements. Verify real opportunities through official channels.
- Company employment timelines, relationship-aware graph ranking, production identity verification, and shared community publishing are future work.

## Run locally

### Requirements

- Node.js 20 or newer (the current frontend build has been validated with Node 24)
- Python 3.10 or newer
- Neo4j for backend-backed search and graph features

### Start the frontend

```bash
cd frontend
npm ci
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The frontend can be explored in demo mode without connecting Neo4j.

### Start the backend (optional)

1. Start a local Neo4j instance or create a Neo4j Aura database.
2. From the repository root, copy `.env.example` to `.env` and set your Neo4j connection values. Never commit `.env` or credentials.
3. Install backend dependencies and start the service:

```bash
cd backend
python -m pip install -r requirements.txt
python run.py
```

The API runs at [http://localhost:8000](http://localhost:8000); interactive API documentation is at [http://localhost:8000/api/docs](http://localhost:8000/api/docs). Seed the database, when Neo4j is configured, with:

```bash
python seed.py
```

The Vite development server proxies `/api` requests to `http://localhost:8000`. For a different backend URL, configure `VITE_API_URL` for the frontend.

## Test and build

```bash
# Frontend
cd frontend
npm run type-check
npm run build
npm run lint

# Backend
cd ../backend
python -m pytest tests/ -v
```

`npm run lint` requires ESLint to be installed in the frontend development environment.

## API overview

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | Backend and Neo4j health |
| `GET` | `/api/meta` | Service metadata |
| `POST` | `/api/intent/parse` | Parse a natural-language search into structured intent |
| `POST` | `/api/search` | Return ranked people for a search intent |
| `GET` | `/api/people` | List people, optionally filtered by role |
| `GET` | `/api/people/{id}` | Retrieve one person's profile |

## Repository map

```text
everlink/
├── backend/
│   ├── app/
│   │   ├── api/           # FastAPI routes
│   │   ├── graph/         # Neo4j connection and schema
│   │   ├── models/        # Domain and response models
│   │   ├── repositories/  # Graph persistence and queries
│   │   ├── seed/          # Seed data
│   │   └── services/      # Intent parsing and scoring
│   ├── tests/
│   ├── run.py
│   └── seed.py
├── frontend/
│   ├── public/            # Static assets and community fixture
│   └── src/
│       ├── app/           # Routes and application shell
│       ├── components/    # Shared UI
│       ├── lib/           # API client and browser-side demo state
│       └── pages/         # Public, auth, dashboard, and community pages
├── docs/                  # Product, setup, and technical documentation
└── .env.example           # Local environment-variable template
```

## Help build the network

Everlink's best future depends on a community that shares knowledge with care. Alumni, students, and faculty should be able to contribute accurate information, choose how they participate, and help create pathways that are useful-not noisy. If you are exploring, contributing, or giving feedback, the most valuable question is:

> **Who would you have wanted to find when you were taking your next big step?**

## License

Demo project for educational purposes.
