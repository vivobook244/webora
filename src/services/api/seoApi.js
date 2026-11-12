import { apiClient } from './apiClient'

export async function getSeoApi() {
  return apiClient.get('/seo')
}

export async function updateSeoApi(data) {
  return apiClient.put('/seo', data)
}

export async function resetSeoApi() {
  return apiClient.post('/seo/reset')
}
