import { apiClient } from './apiClient'

export async function getMediaApi() {
  return apiClient.get('/media')
}

export async function getMediaByIdApi(id) {
  return apiClient.get(`/media/${id}`)
}

export async function uploadMediaApi(mediaData) {
  return apiClient.post('/media', mediaData)
}

export async function updateMediaApi(id, data) {
  return apiClient.put(`/media/${id}`, data)
}

export async function deleteMediaApi(id) {
  return apiClient.delete(`/media/${id}`)
}
