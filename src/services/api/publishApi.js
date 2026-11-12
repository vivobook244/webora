import { apiClient } from './apiClient'

export async function publishPageApi(id) {
  return apiClient.post(`/pages/${id}/publish`)
}

export async function unpublishPageApi(id) {
  return apiClient.post(`/pages/${id}/unpublish`)
}

export async function getPreviewPageApi(id) {
  return apiClient.get(`/pages/${id}/preview`)
}
