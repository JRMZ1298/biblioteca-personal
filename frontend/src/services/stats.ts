import api from './api'
import type { OverviewStats, FavoriteGenre, TopAuthor } from '../types/stats'

export async function getOverviewStats(): Promise<OverviewStats> {
  const res = await api.get('/stats/overview')
  return res.data
}

export async function getFavoriteGenres(): Promise<FavoriteGenre[]> {
  const res = await api.get('/stats/favorite-genres')
  return res.data
}

export async function getTopAuthors(): Promise<TopAuthor[]> {
  const res = await api.get('/stats/top-authors')
  return res.data
}
