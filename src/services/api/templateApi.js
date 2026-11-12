import { apiClient } from './apiClient'

export async function getTemplatesApi() {
  return apiClient.get('/templates')
}

export async function getTemplateByIdApi(id) {
  return apiClient.get(`/templates/${id}`)
}

export async function getActiveTemplateApi() {
  return apiClient.get('/templates/active')
}

export async function activateTemplateApi(id) {
  return apiClient.put(`/templates/${id}/activate`)
}
