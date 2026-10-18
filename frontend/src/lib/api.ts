import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface SearchResult {
  candidate_id: string
  candidate_name: string
  candidate_role: string
  headline?: string
  score: number
  matching_mode: string
  explanation: string
  matched_skills: string[]
  matched_topics: string[]
}

export interface SearchResponse {
  success: boolean
  data: {
    results: SearchResult[]
    total: number
    intent: any
  }
}

export interface Person {
  id: string
  name: string
  role: string
  headline?: string
  department?: string
  bio?: string
  skills: string[]
  interests: string[]
}

export async function search(query: string, limit?: number): Promise<SearchResponse> {
  const response = await api.post('/api/search', null, {
    params: { query, limit },
  })
  return response.data
}

export async function listPeople(role?: string, limit?: number): Promise<{ success: boolean; data: { people: Person[] } }> {
  const response = await api.get('/api/people', {
    params: { role, limit },
  })
  return response.data
}

export async function getPerson(personId: string): Promise<{ success: boolean; data: Person }> {
  const response = await api.get(`/api/people/${personId}`)
  return response.data
}

export async function healthCheck(): Promise<any> {
  const response = await api.get('/api/health')
  return response.data
}

export default api
