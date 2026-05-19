import { useQuery } from '@tanstack/react-query'
import { searchGoogleBooks } from '../services/google-books'

export function useGoogleBooksSearch(query: string) {
  return useQuery({
    queryKey: ['google-books', query],
    queryFn: () => searchGoogleBooks(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5,
  })
}
