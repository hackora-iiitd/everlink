export type ApiResponse<T> =
  | {
      success: true
      data: T
      error?: string | null
    }
  | {
      success: false
      data?: null
      error?: string | null
    }

export interface Person {
  id: string
  name: string
  role: string
  headline?: string | null
  department?: string | null
  graduation_year?: number | null
  current_position?: string | null
  bio?: string | null
  skills?: string[]
  interests?: string[]
}

export interface SearchIntent {
  intent_type: string
  skills: string[]
  topics: string[]
}

export interface SearchResult {
  candidate_id: string
  candidate_name: string
  candidate_role: string
  headline?: string | null
  score: number
  matched_skills: string[]
  matched_topics: string[]
  explanation: string
}

export interface SearchData {
  results: SearchResult[]
  total: number
  intent: SearchIntent
}
