import apiClient from './client'
import { Round, RoundFormData } from '../types'

export const getRounds = async (): Promise<Round[]> => {
  const { data } = await apiClient.get<Round[]>('/api/rounds/')
  return data
}

export const createRound = async (roundData: RoundFormData): Promise<Round> => {
  const { data } = await apiClient.post<Round>('/api/rounds/', roundData)
  return data
}

export const updateRound = async (id: number, roundData: Partial<RoundFormData>): Promise<Round> => {
  const { data } = await apiClient.put<Round>(`/api/rounds/${id}/`, roundData)
  return data
}

export const deleteRound = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/rounds/${id}/`)
}

export const getRound = async (id: number): Promise<Round> => {
  const { data } = await apiClient.get<Round>(`/api/rounds/${id}/`)
  return data
}