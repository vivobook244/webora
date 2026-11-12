import { apiClient } from './apiClient'

export async function getPagesApi() {
  return apiClient.get('/pages')
}

export async function getPageByIdApi(id) {
  return apiClient.get(`/pages/${id}`)
}

export async function createPageApi(data) {
  return apiClient.post('/pages', data)
}

export async function updatePageApi(id, data) {
  return apiClient.put(`/pages/${id}`, data)
}

export async function deletePageApi(id) {
  return apiClient.delete(`/pages/${id}`)
}
