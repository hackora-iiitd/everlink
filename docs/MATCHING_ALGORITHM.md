# Everlink Matching Algorithm

## Overview

Everlink uses a **weighted, deterministic matching engine** to rank candidates based on explicit intent and configurable criteria. Scores are explained, not opaque.

## Core Principles

1. **Graph-Grounded**: Recommendations come from Neo4j relationships, not full-text search
2. **Intent-Aware**: Different matching modes (mentor vs. research vs. teammate) use different weights
3. **Explainable**: Every score includes breakdown by criterion and evidence paths
4. **Renormalizing**: Missing data doesn't break scoring — weights adjust automatically
5. **Hard Filters**: Explicit requirements (e.g., "18+ months") exclude non-qualifying candidates

## Intent Types

### 1. Mentor Matching
**Use Case**: "Find a mentor with X experience in Y topic"

**Weights**:
- 30%: Topic-specific experience (years in healthcare-ai, etc.)
- 20%: Achievement evidence (publications, projects, recognitions)
- 20%: Skill overlap (match of requested skills)
- 15%: Role fit (senior, alumnus, professor)
- 10%: Experience duration (total years in workforce)
- 5%: Availability (if recorded)

**Score Calculation**:
```
score = (
  topic_exp * 0.30 +
  achievement * 0.20 +
  skills * 0.20 +
  role_fit * 0.15 +
  experience * 0.10 +
  availability * 0.05
) * 100
```

**Example**:
Query: "Find a mentor with healthcare AI experience"
- Candidate A: 0.95 topic + 0.80 achievement + 0.85 skills + 1.0 role + 0.6 exp + 0.8 avail → **83.5/100**
- Candidate B: 0.50 topic + 0.70 achievement + 0.60 skills + 0.8 role + 0.9 exp + 0.5 avail → **65.8/100**

### 2. Research Matching
**Use Case**: "Find professors and projects in X topic using Y skills"

**Weights**:
- 35%: Research-topic alignment
- 25%: Project relevance & active status
- 20%: Relevant skills
- 10%: Experience duration
- 10%: Role fit

### 3. Senior/Alumni Achievement Matching
**Use Case**: "Find seniors who won hackathons / did open-source"

**Weights**:
- 35%: Requested achievement match
- 25%: Relevance of experience behind achievement
- 20%: Relevant skills
- 10%: Role fit
- 10%: Topic alignment

### 4. Teammate Matching
**Use Case**: "Find teammates with backend and deployment skills"

**Weights**:
- 30%: Skill coverage (fills gaps in team)
- 25%: Complementary skills (brings new expertise)
- 20%: Project/hackathon experience
- 15%: Domain alignment
- 10%: Availability

### 5. Opportunity Matching
**Use Case**: "Find internships and programs matching my interests"

**Weights**:
- 30%: Topic & interest alignment
- 25%: Eligibility fit
- 20%: Skill alignment
- 15%: Relevant experience
- 10%: Timing/availability

## Scoring Details

### Criterion: Topic Experience

Measures how deep the candidate's experience is in requested topics.

**Calculation**:
```
topic_score = (
  years_in_topic / requested_topics.count
) clamped [0, 1]
```

**Example**:
- Requested: ["healthcare-ai"]
- Candidate: 8 years in healthcare-ai
- Score: 8 / 1 → clamped to 1.0

**Data Source**: Neo4j relationship properties
```
(:Person)-[:HAS_EXPERIENCE_IN {
  years_experience: 8,
  depth: "expert",
  last_used_year: 2026
}]->(:ResearchTopic {name: "healthcare-ai"})
```

### Criterion: Skill Overlap

Measures intersection of requested and candidate skills.

**Calculation**:
```
skill_score = overlap / requested_skills.count
where overlap = candidate_skills ∩ requested_skills
```

**Example**:
- Requested: ["python", "tensorflow", "computer-vision"]
- Candidate has: ["python", "tensorflow", "pytorch", "java"]
- Overlap: 2 / 3 → **0.67**

### Criterion: Achievement Evidence

Measures relevant achievements and their recency/verification.

**Calculation**:
```
achievement_score = (
  (relevant_achievement_count / 5) +      # 5 is baseline
  (years_in_workforce / 10)
) / 2
clamped [0, 1]
```

**Example**:
- 3 relevant achievements + 8 years experience
- Score: ((3/5) + (8/10)) / 2 = **(0.6 + 0.8) / 2 = 0.70**

### Criterion: Experience Duration

Measures both total workforce experience and minimum requirement.

**Calculation**:
```
if minimum_required:
  if candidate_months >= minimum_required:
    score = 1.0
  else:
    score = candidate_months / minimum_required
else:
  score = min(1.0, candidate_months / 120)  # 10-year baseline
```

**Example 1** (requirement: 18 months):
- Candidate: 24 months → **1.0**

**Example 2** (requirement: 18 months):
- Candidate: 12 months → **12/18 = 0.67**

**Example 3** (no requirement):
- Candidate: 36 months → **36/120 = 0.30** (junior)
- Candidate: 120 months → **1.0** (senior)

### Criterion: Role Fit

Measures whether candidate role matches search intent.

**Calculation**:
```
if candidate.role in target_roles:
  score = 1.0
else if related_role_mapping[candidate.role] in target_roles:
  score = 0.7
else:
  score = 0.2
```

**Example**:
- Requested: mentor for open-source
- Target roles: ["senior", "alumnus"]
- Candidate role: professor → **0.2** (can mentor, but not primary profile)
- Candidate role: senior → **1.0**

## Handling Missing Data

The system **does not invent data**. If a criterion cannot be calculated:

1. Mark as "not applicable" (`-1`)
2. Exclude that weight from denominator
3. Renormalize remaining weights
4. Include in `missing_criteria` field

**Example**: No achievement data for candidate

Original weights (mentor):
```
topic: 0.30, achievement: 0.20, skills: 0.20, role: 0.15, experience: 0.10, avail: 0.05
```

If achievement missing:
```
Applicable weights: 0.30 + 0.20 + 0.15 + 0.10 + 0.05 = 0.80
Renormalized: [0.30÷0.80, ..., 0.05÷0.80] = [0.375, 0.25, 0.1875, 0.125, 0.0625]
Score = sum of applicable criteria with new weights
```

## Hard Filters

Explicit requirements that exclude candidates (not soft scores).

**Supported Hard Filters**:
- Minimum experience duration: `minimum_experience_months=18`
- Target role: `target_role=["senior", "professor"]`
- Specific skill required: (implemented as high weight on skill_overlap)
- Availability: (if recorded as "available")

**Behavior**:
- If hard filter not met → candidate **excluded** (not just downscored)
- Filter status shown in `filters_applied` array
- Score is `null` or `0` for excluded candidates

**Example**:
```
Query: "18+ months experience in healthcare-ai"
Candidate A: 24 months → Included
Candidate B: 12 months → Excluded
             filter_applied: ["minimum_experience_months_18"]
```

## Score Breakdown Example

```json
{
  "candidate_id": "prof_001",
  "candidate_name": "Dr. James Wilson",
  "score": 88.5,
  "matching_mode": "mentor",
  "score_breakdown": {
    "topic_experience": 0.95,
    "achievement_evidence": 0.80,
    "skill_overlap": 0.85,
    "role_fit": 1.0,
    "experience_duration": 0.60,
    "availability": 0.80
  },
  "evidence_path": [
    "Student.INTERESTED_IN.healthcare-ai",
    "Dr_James.HAS_EXPERIENCE_IN.healthcare-ai (8 years)",
    "Dr_James.HAS_SKILL.python",
    "Dr_James.LEADS.MedicalImagingProject"
  ],
  "explanation": "Strong match: 8+ years in healthcare AI, led active research projects, Python expertise, available for mentoring."
}
```

## Ranked Results

Multiple candidates are scored, sorted by final score (descending), and ranked.

**Result Set**:
```
1. Dr. James Wilson (88.5) ← Best match
2. Arjun Patel (82.3)
3. Dr. Sarah Kumar (71.0)
...
```

**Pagination**: Results are limited (default: 20, max: 100)

## Testing Scenarios

### Scenario A: Healthcare AI Mentor

**Query**: "Find a mentor with healthcare AI and Python experience"

**Expected**:
- Dr. James Wilson (prof) → Top score
- Arjun Patel (alumnus, 3 yrs exp) → High score
- Junior student → Excluded (no experience)

**Verification**:
```bash
curl -X POST "http://localhost:8000/api/search?query=Find%20a%20mentor%20with%20healthcare%20AI%20experience"
# Check: Top 3 include prof and relevant alumni
```

### Scenario B: Hard Filter: 18 Months Experience

**Query**: "Find an alumnus with at least 18 months at a tech company"

**Expected**:
- Candidates with 18+ months at company → Included
- Candidates with <18 months → Excluded (not downscored)
- Candidates with unknown duration → Marked as "duration_unknown"

### Scenario C: Missing Skill Data

**Query**: "Find backend developers"

**Expected**:
- Candidates with backend skills listed → High score
- Candidates with no skills listed → Lower score (not penalized unfairly)
- Weight renormalization applied

## Configuration

Weights are defined in `backend/app/services/scoring.py`:

```python
WEIGHTS = {
    "mentor": {
        "topic_experience": 0.30,
        "achievement_evidence": 0.20,
        "skill_overlap": 0.20,
        "role_fit": 0.15,
        "experience_duration": 0.10,
        "availability": 0.05,
    },
    # ... other modes
}
```

**To adjust**: Edit weights and restart backend. All scores recalculated.

## Limitations & Future Work

1. **No embeddings**: Currently uses exact keyword matching, not semantic similarity
2. **No feedback loop**: Scores not optimized based on user feedback
3. **No temporal weighting**: Recent experience not explicitly weighted higher (yet)
4. **No collaboration signals**: Team dynamics not factored in
5. **No geographic preference**: Location not considered (local MVP)

## References

- **Intent Parser**: `backend/app/services/intent_parser.py`
- **Scoring Engine**: `backend/app/services/scoring.py`
- **Score Response Model**: `backend/app/models/response.py`
- **API Endpoint**: `backend/app/api/search.py` → `/api/search`
