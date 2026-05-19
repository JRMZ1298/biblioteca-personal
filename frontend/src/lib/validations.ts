import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Ingresa un email válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})

export const registerSchema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres').max(30, 'Máximo 30 caracteres'),
  email: z.string().email('Ingresa un email válido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

export const bookSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  author: z.string().min(1, 'El autor es obligatorio'),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  pages: z.string().optional(),
  published_date: z.string().optional(),
  genre_ids: z.array(z.string()).optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type BookFormData = z.infer<typeof bookSchema>
