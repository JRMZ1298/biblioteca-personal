import api from './api'
import type { Note, CreateNoteRequest } from '../types/book'

export async function getNotes(userBookId: string): Promise<Note[]> {
  const res = await api.get(`/user-books/${userBookId}/notes`)
  return res.data
}

export async function createNote(userBookId: string, data: CreateNoteRequest): Promise<Note> {
  const res = await api.post(`/user-books/${userBookId}/notes`, data)
  return res.data
}

export async function deleteNote(noteId: string): Promise<void> {
  await api.delete(`/notes/${noteId}`)
}
