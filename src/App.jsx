import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './layouts/AdminLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import SettingsPage from './pages/SettingsPage'
import MediaPage from './pages/MediaPage'
import TemplatesPage from './pages/TemplatesPage'
import PagesPage from './pages/PagesPage'
import SectionBuilderPage from './pages/SectionBuilderPage'
import NavigationPage from './pages/NavigationPage'
import AppearancePage from './pages/AppearancePage'
import SeoPage from './pages/SeoPage'
import PagePreview from './pages/admin/PagePreview'
import PublicPage from './pages/PublicPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicPage />} />
          <Route path="/:slug" element={<PublicPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="media" element={<MediaPage />} />
            <Route path="templates" element={<TemplatesPage />} />
            <Route path="pages" element={<PagesPage />} />
            <Route path="pages/:pageId/sections" element={<SectionBuilderPage />} />
            <Route path="pages/:pageId/preview" element={<PagePreview />} />
            <Route path="navigation" element={<NavigationPage />} />
            <Route path="appearance" element={<AppearancePage />} />
            <Route path="seo" element={<SeoPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
