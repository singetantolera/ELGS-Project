import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Navbar from '../components/common/Navbar/Navbar'
import Footer from '../components/common/Footer/Footer'
import ProtectedRoute from '../components/auth/ProtectedRoute/ProtectedRoute'

import HomePage from '../pages/HomePage/HomePage'
import LoginPage from '../pages/LoginPage/LoginPage'
import RegisterPage from '../pages/RegisterPage/RegisterPage'
import DashboardPage from '../pages/DashboardPage/DashboardPage'
import SearchPage from '../pages/SearchPage/SearchPage'
import CategoryPage from '../pages/CategoryPage/CategoryPage'
import LegalContentViewPage from '../pages/LegalContentViewPage/LegalContentViewPage'
import ChatbotPage from '../pages/ChatbotPage/ChatbotPage'
import BookmarksPage from '../pages/BookmarksPage/BookmarksPage'
import ProfilePage from '../pages/ProfilePage/ProfilePage'
import AdminDashboardPage from '../pages/AdminDashboardPage/AdminDashboardPage'
import AboutPage from '../pages/AboutPage/AboutPage'
import PrivacyPage from '../pages/PrivacyPage/PrivacyPage'
import TermsPage from '../pages/TermsPage/TermsPage'
import AccessibilityPage from '../pages/AccessibilityPage/AccessibilityPage'
import VerifyEmailPage from '../pages/VerifyEmailPage/VerifyEmailPage'

const AppRoutes = () => {
  const { isAuthenticated, isAdmin } = useAuth()

  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/legal-content/:id" element={<LegalContentViewPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
         <Route path="/verify-email/:token" element={<VerifyEmailPage />} />

          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} 
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <ChatbotPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute>
                <BookmarksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default AppRoutes