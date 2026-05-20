import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as notesService from '../services/notes'
import type { CreateNoteRequest } from '../types/book'

export function useCreateNote(userBookId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateNoteRequest) => notesService.createNote(userBookId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['books', userBookId] }),
  })
}

export function useDeleteNote(userBookId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (noteId: string) => notesService.deleteNote(noteId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['books', userBookId] }),
  })
}
