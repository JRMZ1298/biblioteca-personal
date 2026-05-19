import api from './api'
import type { Genre } from '../types/genre'

export async function getGenres(): Promise<Genre[]> {
  const res = await api.get('/genres')
  return res.data
}
