import api from './api'
import type { GoogleBooksResponse } from '../types/google-books'

export async function searchGoogleBooks(query: string): Promise<GoogleBooksResponse> {
  const res = await api.get('/google-books/search', { params: { q: query } })
  return res.data
}
