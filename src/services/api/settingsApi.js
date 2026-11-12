import { apiClient } from './apiClient'

export async function getSettingsApi() {
  return apiClient.get('/settings')
}

export async function updateSettingsApi(settings) {
  return apiClient.put('/settings', settings)
}
