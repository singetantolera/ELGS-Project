import { Navigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import Loader from '../../common/Loader/Loader'

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="protected-route-loading">
        <Loader size="large" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute