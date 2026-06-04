import apiClient from './client'
import type { AuthTokens, LoginCredentials, RegisterCredentials, User } from '../types'

export const login = async (credentials: LoginCredentials): Promise<AuthTokens> => {
  const { data } = await apiClient.post<AuthTokens>('/api/accounts/login/', credentials)
  localStorage.setItem('access_token', data.access)
  localStorage.setItem('refresh_token', data.refresh)
  return data
}

export const register = async (credentials: RegisterCredentials): Promise<User> => {
  const { data } = await apiClient.post<User>('/api/accounts/register/', credentials)
  return data
}

export const logout = (): void => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export const getMe = async (): Promise<User> => {
  const { data } = await apiClient.get<User>('/api/accounts/me/')
  return data
}