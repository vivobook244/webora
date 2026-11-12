import { apiClient } from './apiClient'

export async function getNavigationApi() {
  return apiClient.get('/navigation')
}

export async function getNavigationItemApi(id) {
  return apiClient.get(`/navigation/${id}`)
}

export async function createNavigationItemApi(data) {
  return apiClient.post('/navigation', data)
}

export async function updateNavigationItemApi(id, data) {
  return apiClient.put(`/navigation/${id}`, data)
}

export async function deleteNavigationItemApi(id) {
  return apiClient.delete(`/navigation/${id}`)
}

export async function reorderNavigationApi(orderedIds) {
  return apiClient.put('/navigation/reorder', { orderedIds })
}

export async function toggleNavigationVisibilityApi(id) {
  return apiClient.put(`/navigation/${id}/visibility`)
}
