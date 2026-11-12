import { apiClient } from './apiClient'

export async function getSectionsByPageApi(pageId) {
  return apiClient.get(`/pages/${pageId}/sections`)
}

export async function getSectionByIdApi(id) {
  return apiClient.get(`/sections/${id}`)
}

export async function createSectionApi(data) {
  return apiClient.post('/sections', data)
}

export async function updateSectionApi(id, data) {
  return apiClient.put(`/sections/${id}`, data)
}

export async function deleteSectionApi(id) {
  return apiClient.delete(`/sections/${id}`)
}

export async function duplicateSectionApi(id) {
  return apiClient.post(`/sections/${id}/duplicate`)
}

export async function reorderSectionsApi(pageId, orderedIds) {
  return apiClient.put(`/pages/${pageId}/sections/reorder`, { orderedIds })
}

export async function toggleSectionVisibilityApi(id) {
  return apiClient.put(`/sections/${id}/visibility`)
}
