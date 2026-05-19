import { useQuery } from '@tanstack/react-query'
import * as genresService from '../services/genres'

export function useGenres() {
  return useQuery({
    queryKey: ['genres'],
    queryFn: () => genresService.getGenres(),
    staleTime: 1000 * 60 * 10,
  })
}
