import { apiClient } from './apiClient'

export async function loginApi(email, password) {
  return apiClient.post('/auth/login', { email, password })
}

export async function logoutApi() {
  return apiClient.post('/auth/logout')
}

export async function getCurrentUserApi() {
  return apiClient.get('/auth/me')
}
