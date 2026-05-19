import api from './api'
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/user'

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await api.post('/auth/login', data)
  return res.data
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const res = await api.post('/auth/register', data)
  return res.data
}

export async function getMe(): Promise<User> {
  const res = await api.get('/auth/me')
  return res.data
}
