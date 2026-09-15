import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FONT_MONO, COLORS } from '../data/constants'

export default function ProtectedRoute({ children }) {
  const { session } = useAuth()

  // Sesión cargando
  if (session === undefined) {
    return (
      <div style={{
        background: COLORS.bg,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: COLORS.textMuted,
        fontFamily: FONT_MONO,
        fontSize: 12,
        letterSpacing: 2,
      }}>
        CARGANDO...
      </div>
    )
  }

  if (!session) return <Navigate to="/login" replace />

  return children
}