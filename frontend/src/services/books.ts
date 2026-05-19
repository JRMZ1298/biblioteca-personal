import api from './api'
import type { UserBook, CreateBookRequest, UpdateBookRequest } from '../types/book'

export async function getBooks(status?: string): Promise<UserBook[]> {
  const params = status ? { status } : {}
  const res = await api.get('/books', { params })
  return res.data
}

export async function getBook(id: string): Promise<UserBook> {
  const res = await api.get(`/books/${id}`)
  return res.data
}

export async function createBook(data: CreateBookRequest): Promise<UserBook> {
  const res = await api.post('/books', data)
  return res.data
}

export async function updateBook(id: string, data: UpdateBookRequest): Promise<UserBook> {
  const res = await api.put(`/books/${id}`, data)
  return res.data
}

export async function deleteBook(id: string): Promise<void> {
  await api.delete(`/books/${id}`)
}
