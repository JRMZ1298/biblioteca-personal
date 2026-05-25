import { useQuery } from '@tanstack/react-query'
import * as statsService from '../services/stats'

export function useOverviewStats() {
  return useQuery({
    queryKey: ['stats', 'overview'],
    queryFn: () => statsService.getOverviewStats(),
  })
}

export function useFavoriteGenres() {
  return useQuery({
    queryKey: ['stats', 'favorite-genres'],
    queryFn: () => statsService.getFavoriteGenres(),
  })
}

export function useTopAuthors() {
  return useQuery({
    queryKey: ['stats', 'top-authors'],
    queryFn: () => statsService.getTopAuthors(),
  })
}
