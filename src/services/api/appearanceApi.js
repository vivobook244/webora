import { apiClient } from './apiClient'

export async function getAppearanceApi() {
  return apiClient.get('/appearance')
}

export async function updateAppearanceApi(data) {
  return apiClient.put('/appearance', data)
}

export async function resetAppearanceApi() {
  return apiClient.post('/appearance/reset')
}
