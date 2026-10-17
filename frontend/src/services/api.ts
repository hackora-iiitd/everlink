import axios from 'axios'
import type { ApiResponse, Person, SearchData } from '../types/api'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export async function getPerson(personId: string): Promise<ApiResponse<Person>> {
  const response = await apiClient.get<ApiResponse<Person>>(
    `/api/people/${encodeURIComponent(personId)}`,
  )
  return response.data
}

export async function search(
  query: string,
  limit = 20,
): Promise<ApiResponse<SearchData>> {
  const response = await apiClient.post<ApiResponse<SearchData>>(
    '/api/search',
    null,
    { params: { query, limit } },
  )
  return response.data
}
