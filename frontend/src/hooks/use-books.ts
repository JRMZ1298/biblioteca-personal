import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as booksService from '../services/books'
import type { CreateBookRequest, UpdateBookRequest } from '../types/book'

const booksKeys = {
  all: ['books'] as const,
  filtered: (status?: string) => ['books', 'filtered', status] as const,
}

export function useBooks(status?: string) {
  return useQuery({
    queryKey: booksKeys.filtered(status),
    queryFn: () => booksService.getBooks(status),
  })
}

export function useBook(id: string) {
  return useQuery({
    queryKey: ['books', id],
    queryFn: () => booksService.getBook(id),
    enabled: !!id,
  })
}

export function useCreateBook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateBookRequest) => booksService.createBook(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: booksKeys.all }),
  })
}

export function useUpdateBook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookRequest }) =>
      booksService.updateBook(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: booksKeys.all }),
  })
}

export function useDeleteBook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => booksService.deleteBook(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: booksKeys.all }),
  })
}
